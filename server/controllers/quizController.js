import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = async (req, res) => {
  try {
    const { subject, grade, difficulty, page = 1, limit = 10 } = req.query;
    
    let filter = { isActive: true };
    if (subject) filter.subject = subject;
    if (grade) filter.grade = grade;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter)
      .select('-questions.correctAnswer -questions.explanation')
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Quiz.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: quizzes.length,
      total,
      data: quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation')
      .populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private (Admin/Teacher)
export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Admin/Teacher)
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin/Teacher)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    quiz.isActive = false;
    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    let score = 0;
    const results = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = question.type === 'multiple-choice' 
        ? question.options.find(opt => opt.isCorrect)?.text === userAnswer
        : question.correctAnswer === userAnswer;

      if (isCorrect) {
        score += question.points;
      }

      results.push({
        questionId: question._id,
        answer: userAnswer,
        isCorrect,
        explanation: question.explanation
      });
    });

    // Save attempt
    quiz.attempts.push({
      userId: req.user.id,
      score,
      totalQuestions: quiz.questions.length,
      timeTaken,
      answers: results
    });

    await quiz.save();

    // Update progress
    await Progress.findOneAndUpdate(
      { userId: req.user.id, subject: quiz.subject, chapter: quiz.chapter },
      {
        $push: {
          completedActivities: {
            type: 'quiz',
            activityId: quiz._id,
            score: (score / quiz.totalPoints) * 100
          }
        },
        lastAccessed: new Date()
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      data: {
        score,
        totalPoints: quiz.totalPoints,
        percentage: Math.round((score / quiz.totalPoints) * 100),
        results
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private
export const getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const userAttempts = quiz.attempts.filter(
      attempt => attempt.userId.toString() === req.user.id
    );

    res.status(200).json({
      success: true,
      data: userAttempts
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quiz statistics
// @route   GET /api/quizzes/:id/statistics
// @access  Private (Admin/Teacher)
export const getQuizStatistics = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    const statistics = quiz.getStatistics();

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Get quiz statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};