import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Eye,
  EyeOff,
  BookOpen,
  Brain,
  Target,
  Trophy,
  Search,
  Filter,
  Star,
} from "lucide-react";
import { flashcardAPI } from "../utils/api";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  studyCount: number;
  rating: number;
}

const Flashcards = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [newCard, setNewCard] = useState({
    question: "",
    answer: "",
    subject: "science",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    tags: "",
    isPublic: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Demo flashcards
  const demoFlashcards: Flashcard[] = [
    {
      id: "1",
      question: "What is photosynthesis?",
      answer:
        "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
      subject: "science",
      difficulty: "Medium",
      tags: ["biology", "plants", "energy"],
      createdBy: "Dr. Smith",
      isPublic: true,
      createdAt: "2024-01-15",
      studyCount: 245,
      rating: 4.8,
    },
    {
      id: "2",
      question: "What is the quadratic formula?",
      answer:
        "x = (-b ± √(b² - 4ac)) / 2a, where a, b, and c are coefficients of the quadratic equation ax² + bx + c = 0.",
      subject: "mathematics",
      difficulty: "Hard",
      tags: ["algebra", "equations", "formula"],
      createdBy: "Prof. Johnson",
      isPublic: true,
      createdAt: "2024-01-14",
      studyCount: 189,
      rating: 4.6,
    },
    {
      id: "3",
      question: "Who was the first President of India?",
      answer:
        "Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962.",
      subject: "social-science",
      difficulty: "Easy",
      tags: ["history", "india", "president"],
      createdBy: "Ms. Patel",
      isPublic: true,
      createdAt: "2024-01-13",
      studyCount: 156,
      rating: 4.9,
    },
    {
      id: "4",
      question: "What is a metaphor?",
      answer:
        "A metaphor is a figure of speech that compares two unlike things without using 'like' or 'as', stating that one thing is another.",
      subject: "english",
      difficulty: "Medium",
      tags: ["grammar", "literature", "figures of speech"],
      createdBy: "Mrs. Brown",
      isPublic: true,
      createdAt: "2024-01-12",
      studyCount: 203,
      rating: 4.7,
    },
    {
      id: "5",
      question: "What is the chemical formula for water?",
      answer: "H₂O - two hydrogen atoms bonded to one oxygen atom.",
      subject: "science",
      difficulty: "Easy",
      tags: ["chemistry", "molecules", "basic"],
      createdBy: "Dr. Wilson",
      isPublic: true,
      createdAt: "2024-01-11",
      studyCount: 312,
      rating: 4.9,
    },
    {
      id: "6",
      question: "What is the area of a circle?",
      answer:
        "A = πr², where r is the radius of the circle and π (pi) ≈ 3.14159.",
      subject: "mathematics",
      difficulty: "Medium",
      tags: ["geometry", "area", "circle"],
      createdBy: "Mr. Davis",
      isPublic: true,
      createdAt: "2024-01-10",
      studyCount: 178,
      rating: 4.5,
    },
  ];

  useEffect(() => {
    let mounted = true;
    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await flashcardAPI.getFlashcards();
        const data = res.data?.data || res.data;
        if (mounted && Array.isArray(data)) {
          setFlashcards(data);
          setFilteredCards(data);
        } else if (mounted) {
          setFlashcards(demoFlashcards);
          setFilteredCards(demoFlashcards);
        }
      } catch (err: any) {
        console.error('Failed to fetch flashcards', err);
        if (mounted) {
          setFlashcards(demoFlashcards);
          setFilteredCards(demoFlashcards);
          setError(err?.response?.data?.message || err.message || 'Failed to load flashcards');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFlashcards();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let filtered = flashcards;

    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter((card) => card.subject === selectedSubject);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (card) => card.difficulty === selectedDifficulty
      );
    }

    setFilteredCards(filtered);
  }, [searchTerm, selectedSubject, selectedDifficulty, flashcards]);

  const handleCreateCard = async () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) return;

    const cardPayload = {
      question: newCard.question,
      answer: newCard.answer,
      subject: newCard.subject,
      difficulty: newCard.difficulty,
      tags: newCard.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isPublic: newCard.isPublic,
    };

    // optimistic local card while creating on server
    const optimisticCard: Flashcard = {
      id: Date.now().toString(),
      question: newCard.question,
      answer: newCard.answer,
      subject: newCard.subject,
      difficulty: newCard.difficulty,
      tags: cardPayload.tags,
      createdBy: "You",
      isPublic: newCard.isPublic,
      createdAt: new Date().toISOString().split("T")[0],
      studyCount: 0,
      rating: 0,
    };

    try {
      const res = await flashcardAPI.createFlashcard(cardPayload);
      const created = res.data?.data || res.data;
      if (created && created.id) {
        setFlashcards([created, ...flashcards]);
        setFilteredCards([created, ...filteredCards]);
      } else {
        // fallback
        setFlashcards([optimisticCard, ...flashcards]);
        setFilteredCards([optimisticCard, ...filteredCards]);
      }
    } catch (err) {
      console.error('Create flashcard failed, using optimistic card', err);
      setFlashcards([optimisticCard, ...flashcards]);
      setFilteredCards([optimisticCard, ...filteredCards]);
    } finally {
      setNewCard({
        question: "",
        answer: "",
        subject: "science",
        difficulty: "Medium",
        tags: "",
        isPublic: true,
      });
      setActiveTab("browse");
    }
  };

  const startStudyMode = () => {
    if (filteredCards.length === 0) return;
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const nextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setStudyMode(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-learnkins-green-100 text-learnkins-green-800";
      case "Medium":
        return "bg-learnkins-orange-100 text-learnkins-orange-800";
      case "Hard":
        return "bg-learnkins-purple-100 text-learnkins-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "science":
        return "bg-learnkins-purple-500";
      case "mathematics":
        return "bg-learnkins-blue-500";
      case "social-science":
        return "bg-learnkins-green-500";
      case "english":
        return "bg-learnkins-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const tabs = [
    {
      id: "browse",
      label: "Browse Cards",
      icon: <BookOpen className="h-5 w-5" />,
    },
    { id: "create", label: "Create Card", icon: <Plus className="h-5 w-5" /> },
    { id: "study", label: "Study Mode", icon: <Brain className="h-5 w-5" /> },
  ];

  if (studyMode && filteredCards.length > 0) {
    const currentCard = filteredCards[currentCardIndex];

    return (
      <div className="min-h-screen bg-learnkins-subtle flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Study Mode
            </h2>
            <p className="text-gray-600">
              Card {currentCardIndex + 1} of {filteredCards.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-learnkins-gradient h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentCardIndex + 1) / filteredCards.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex flex-col justify-center">
            <div className="text-center mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                  currentCard.difficulty
                )}`}
              >
                {currentCard.difficulty}
              </span>
              <span
                className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-medium text-white ${getSubjectColor(
                  currentCard.subject
                )}`}
              >
                {currentCard.subject}
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {showAnswer ? "Answer:" : "Question:"}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {showAnswer ? currentCard.answer : currentCard.question}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex items-center px-6 py-3 bg-learnkins-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Show Answer
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={previousCard}
                    disabled={currentCardIndex === 0}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setShowAnswer(false)}
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <EyeOff className="h-5 w-5 mr-2" />
                    Hide Answer
                  </button>
                  <button
                    onClick={nextCard}
                    className="px-6 py-3 bg-learnkins-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {currentCardIndex === filteredCards.length - 1
                      ? "Finish"
                      : "Next"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setStudyMode(false)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Exit Study Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-learnkins-blue-900 to-slate-800 text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link
              to="/"
              className="hover:text-learnkins-blue-400 transition-colors"
            >
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Flashcards</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Flashcards</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create, study, and master concepts with interactive flashcards
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                label: "Total Cards",
                value: flashcards.length.toString(),
                icon: <BookOpen className="h-8 w-8" />,
                color: "text-learnkins-blue-600",
              },
              {
                label: "Study Sessions",
                value: "1,250+",
                icon: <Brain className="h-8 w-8" />,
                color: "text-learnkins-purple-600",
              },
              {
                label: "Success Rate",
                value: "94%",
                icon: <Target className="h-8 w-8" />,
                color: "text-learnkins-green-600",
              },
              {
                label: "Achievements",
                value: "156",
                icon: <Trophy className="h-8 w-8" />,
                color: "text-learnkins-orange-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300"
              >
                <div className={`${stat.color} mb-4 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-learnkins-blue-500 text-learnkins-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "browse" && (
            <div>
              {loading && (
                <div className="py-12">
                  <div className="max-w-3xl mx-auto text-center bg-white rounded-xl p-8 shadow-md">
                    <div className="text-2xl font-semibold text-gray-900 mb-2">Loading flashcards...</div>
                    <div className="text-sm text-gray-500">Fetching cards from the server. This may take a moment.</div>
                    {error && <div className="text-sm text-red-400 mt-4">{error}</div>}
                  </div>
                </div>
              )}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Browse Flashcards
                  </h2>
                  <p className="text-lg text-gray-600">
                    Discover and study from our collection of flashcards
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startStudyMode}
                  disabled={filteredCards.length === 0}
                  className="flex items-center px-6 py-3 bg-learnkins-gradient text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Start Study Mode ({filteredCards.length} cards)
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search flashcards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      title="Subject"
                      aria-label="Subject"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Subjects</option>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="social-science">Social Science</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      title="Difficulty"
                      aria-label="Difficulty"
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Levels</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedSubject("all");
                        setSelectedDifficulty("all");
                      }}
                      title="Clear all filters"
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Flashcards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          card.difficulty
                        )}`}
                      >
                        {card.difficulty}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-learnkins-orange-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {card.rating}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {card.question}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {card.answer}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {card.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {card.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{card.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {card.createdBy}</span>
                      <span>{card.studyCount} studies</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCards.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No flashcards found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or create a new flashcard
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-6 py-3 bg-learnkins-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Flashcard
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "create" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create New Flashcard
                </h2>
                <p className="text-lg text-gray-600">
                  Add your own flashcard to help others learn
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question *
                      </label>
                      <textarea
                        value={newCard.question}
                        onChange={(e) =>
                          setNewCard({ ...newCard, question: e.target.value })
                        }
                        placeholder="Enter your question here..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer *
                      </label>
                      <textarea
                        value={newCard.answer}
                        onChange={(e) =>
                          setNewCard({ ...newCard, answer: e.target.value })
                        }
                        placeholder="Enter the answer here..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <select
                          title="Select subject"
                          value={newCard.subject}
                          onChange={(e) =>
                            setNewCard({ ...newCard, subject: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                        >
                          <option value="science">Science</option>
                          <option value="mathematics">Mathematics</option>
                          <option value="social-science">Social Science</option>
                          <option value="english">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty
                        </label>
                        <select
                          title="Select difficulty level"
                          value={newCard.difficulty}
                          onChange={(e) =>
                            setNewCard({
                              ...newCard,
                              difficulty: e.target.value as
                                | "Easy"
                                | "Medium"
                                | "Hard",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newCard.tags}
                        onChange={(e) =>
                          setNewCard({ ...newCard, tags: e.target.value })
                        }
                        placeholder="e.g., biology, plants, photosynthesis"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newCard.isPublic}
                        onChange={(e) =>
                          setNewCard({ ...newCard, isPublic: e.target.checked })
                        }
                        className="h-4 w-4 text-learnkins-blue-600 focus:ring-learnkins-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isPublic"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Make this flashcard public for others to study
                      </label>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleCreateCard}
                        disabled={
                          !newCard.question.trim() || !newCard.answer.trim()
                        }
                        className="flex-1 px-6 py-3 bg-learnkins-gradient text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Flashcard
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("browse")}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "study" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Study Mode
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Choose your study preferences and start learning
                </p>

                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        title="Select subject for study mode"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Subjects</option>
                        <option value="science">Science</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="social-science">Social Science</option>
                        <option value="english">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        title="Select difficulty level for study mode"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-600 mb-4">
                        {filteredCards.length} flashcards available
                      </p>
                      <button
                        onClick={startStudyMode}
                        disabled={filteredCards.length === 0}
                        className="w-full px-6 py-3 bg-learnkins-gradient text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Start Studying
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-learnkins-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Master Any Subject with Flashcards
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Create, study, and share flashcards to accelerate your learning
            journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className="inline-flex items-center px-8 py-4 bg-white text-learnkins-blue-600 font-semibold rounded-lg text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Create Flashcard
              <Plus className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/subjects"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg text-lg hover:bg-white hover:text-learnkins-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              Explore Subjects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Flashcards;
