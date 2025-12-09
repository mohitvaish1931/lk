import Progress from '../models/Progress.js';
import User from '../models/User.js';

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id })
      .sort({ lastAccessed: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update progress
// @route   PUT /api/progress/update
// @access  Private
export const updateProgress = async (req, res) => {
  try {
    const { subject, chapter, progress, timeSpent, activityType, activityId, score } = req.body;

    let userProgress = await Progress.findOne({
      userId: req.user.id,
      subject,
      chapter
    });

    if (!userProgress) {
      userProgress = new Progress({
        userId: req.user.id,
        subject,
        chapter,
        progress: 0,
        timeSpent: 0
      });
    }

    // Update progress
    userProgress.progress = Math.max(userProgress.progress, progress);
    userProgress.timeSpent += timeSpent || 0;
    userProgress.lastAccessed = new Date();

    // Add activity if provided
    if (activityType && activityId) {
      userProgress.addActivity(activityType, activityId, score);
    }

    await userProgress.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: userProgress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get subject progress
// @route   GET /api/progress/subject/:subject
// @access  Private
export const getSubjectProgress = async (req, res) => {
  try {
    const { subject } = req.params;

    const progress = await Progress.find({
      userId: req.user.id,
      subject
    }).sort({ chapter: 1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Get subject progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get overall stats
// @route   GET /api/progress/stats
// @access  Private
export const getOverallStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all progress records
    const allProgress = await Progress.find({ userId });

    // Calculate stats
    const totalTimeSpent = allProgress.reduce((total, p) => total + p.timeSpent, 0);
    const averageProgress = allProgress.length > 0 
      ? allProgress.reduce((total, p) => total + p.progress, 0) / allProgress.length 
      : 0;

    // Get current streak
    const currentStreak = allProgress.length > 0 
      ? Math.max(...allProgress.map(p => p.streak.current))
      : 0;

    // Get longest streak
    const longestStreak = allProgress.length > 0 
      ? Math.max(...allProgress.map(p => p.streak.longest))
      : 0;

    // Count completed activities
    const totalActivities = allProgress.reduce((total, p) => total + p.completedActivities.length, 0);

    // Subject-wise progress
    const subjectProgress = {};
    allProgress.forEach(p => {
      if (!subjectProgress[p.subject]) {
        subjectProgress[p.subject] = {
          totalProgress: 0,
          totalTime: 0,
          chapters: 0
        };
      }
      subjectProgress[p.subject].totalProgress += p.progress;
      subjectProgress[p.subject].totalTime += p.timeSpent;
      subjectProgress[p.subject].chapters += 1;
    });

    // Calculate averages for each subject
    Object.keys(subjectProgress).forEach(subject => {
      const data = subjectProgress[subject];
      data.averageProgress = data.chapters > 0 ? data.totalProgress / data.chapters : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        totalTimeSpent,
        averageProgress: Math.round(averageProgress),
        currentStreak,
        longestStreak,
        totalActivities,
        subjectProgress
      }
    });
  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Log study session
// @route   POST /api/progress/session
// @access  Private
export const logStudySession = async (req, res) => {
  try {
    const { subject, chapter, duration, activities } = req.body;

    let progress = await Progress.findOne({
      userId: req.user.id,
      subject,
      chapter
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        subject,
        chapter
      });
    }

    progress.timeSpent += duration;
    progress.lastAccessed = new Date();
    progress.updateStreak();

    // Add activities
    if (activities && activities.length > 0) {
      activities.forEach(activity => {
        progress.addActivity(activity.type, activity.id, activity.score);
      });
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Study session logged successfully',
      data: progress
    });
  } catch (error) {
    console.error('Log study session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};