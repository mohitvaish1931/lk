import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import {
  Play,
  RotateCcw,
  Clock,
  Zap,
  Star,
  Trophy,
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

// Historical periods data
const historicalPeriods = [
  {
    id: "harappan",
    name: "Harappan Civilization",
    year: "2600-1900 BCE",
    description: "Ancient Indus Valley Civilization",
    background: "bg-gradient-to-br from-amber-600 to-orange-700",
    ambient: "birds",
    questions: [
      {
        question:
          "Which river was most important for the Harappan civilization?",
        options: ["Ganga", "Indus", "Yamuna", "Brahmaputra"],
        correct: 1,
        explanation:
          "The Indus River was the lifeline of the Harappan civilization.",
      },
      {
        question: "What was the main occupation of Harappan people?",
        options: ["Hunting", "Agriculture", "Fishing", "Mining"],
        correct: 1,
        explanation:
          "Agriculture was the primary occupation of Harappan people.",
      },
    ],
  },
  {
    id: "mauryan",
    name: "Mauryan Empire",
    year: "322-185 BCE",
    description: "The First Great Empire of India",
    background: "bg-gradient-to-br from-red-600 to-purple-700",
    ambient: "battle",
    questions: [
      {
        question: "Who was the founder of the Maurya Empire?",
        options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Samprati"],
        correct: 1,
        explanation:
          "Chandragupta Maurya founded the Maurya Empire in 322 BCE.",
      },
      {
        question: "Which famous emperor converted to Buddhism?",
        options: ["Chandragupta", "Ashoka", "Bindusara", "Samprati"],
        correct: 1,
        explanation: "Ashoka converted to Buddhism after the Kalinga war.",
      },
    ],
  },
  {
    id: "delhi-sultanate",
    name: "Delhi Sultanate",
    year: "1206-1526 CE",
    description: "Medieval Islamic Sultanate",
    background: "bg-gradient-to-br from-green-600 to-blue-700",
    ambient: "market",
    questions: [
      {
        question: "Who was the first Sultan of Delhi?",
        options: [
          "Qutb-ud-din Aibak",
          "Iltutmish",
          "Balban",
          "Alauddin Khalji",
        ],
        correct: 0,
        explanation: "Qutb-ud-din Aibak was the first Sultan of Delhi.",
      },
      {
        question: "Which Sultan built the Qutub Minar?",
        options: [
          "Qutb-ud-din Aibak",
          "Iltutmish",
          "Balban",
          "Alauddin Khalji",
        ],
        correct: 0,
        explanation: "Qutb-ud-din Aibak started building the Qutub Minar.",
      },
    ],
  },
  {
    id: "mughal",
    name: "Mughal Empire",
    year: "1526-1857 CE",
    description: "The Golden Age of Indian Culture",
    background: "bg-gradient-to-br from-yellow-600 to-pink-700",
    ambient: "palace",
    questions: [
      {
        question: "Who was the first Mughal emperor?",
        options: ["Akbar", "Babur", "Humayun", "Jahangir"],
        correct: 1,
        explanation:
          "Babur was the first Mughal emperor who established the empire.",
      },
      {
        question: 'Which Mughal emperor was known as "Akbar the Great"?',
        options: ["Babur", "Humayun", "Akbar", "Jahangir"],
        correct: 2,
        explanation:
          'Akbar was known as "Akbar the Great" for his administrative skills.',
      },
    ],
  },
];

// 3D Components
const TimeMachine = ({ isActive }: { isActive: boolean }) => {
  return (
    <group>
      {/* Main Cockpit */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 3, 8]} />
        <meshStandardMaterial color={isActive ? "#4f46e5" : "#6b7280"} />
      </mesh>

      {/* Glass Dome */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
      </mesh>

      {/* Control Panel */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[3, 0.5, 1]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Lights */}
      {isActive && (
        <>
          <pointLight position={[0, 2, 0]} intensity={2} color="#4f46e5" />
          <pointLight position={[0, -2, 0]} intensity={1} color="#ec4899" />
        </>
      )}
    </group>
  );
};

const Student = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.5, 0.4]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.6, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.6, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -0.8, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.2, -0.8, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
};

const HistoricalScene = ({
  period,
}: {
  period: (typeof historicalPeriods)[0];
}) => {
  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Buildings/Structures based on period */}
      {period.id === "harappan" && (
        <>
          <mesh position={[-3, 0, -3]}>
            <boxGeometry args={[2, 3, 2]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          <mesh position={[3, 0, -3]}>
            <boxGeometry args={[2, 3, 2]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
        </>
      )}

      {period.id === "mughal" && (
        <>
          <mesh position={[0, 1, -5]}>
            <cylinderGeometry args={[2, 2, 6, 8]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, 4, -5]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </>
      )}

      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </group>
  );
};

const HistoryGame = () => {
  const [gameState, setGameState] = useState<
    "cockpit" | "traveling" | "historical" | "quiz" | "feedback"
  >("cockpit");
  const [currentPeriod, setCurrentPeriod] = useState<
    (typeof historicalPeriods)[0] | null
  >(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const startTimeTravel = () => {
    setGameState("traveling");
    const randomPeriod =
      historicalPeriods[Math.floor(Math.random() * historicalPeriods.length)];
    setCurrentPeriod(randomPeriod);

    setTimeout(() => {
      setGameState("historical");
      const randomQuestion =
        randomPeriod.questions[
          Math.floor(Math.random() * randomPeriod.questions.length)
        ];
      setCurrentQuestion(randomQuestion);
      setTimeout(() => {
        setGameState("quiz");
      }, 2000);
    }, 3000);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correct;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setGameState("feedback");
  };

  const returnToCockpit = () => {
    setGameState("cockpit");
    setCurrentPeriod(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/games"
          className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span>Back to Games</span>
        </Link>
      </div>

      {/* Score Display */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span>Score: {score}</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-purple-400" />
            <span>Streak: {streak}</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-screen">
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
          <OrbitControls enableZoom={false} />

          {gameState === "cockpit" && (
            <>
              <TimeMachine isActive={false} />
              <Student />
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
            </>
          )}

          {gameState === "traveling" && (
            <>
              <TimeMachine isActive={true} />
              <Student />
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[0, 0, 0]} intensity={2} color="#4f46e5" />
            </>
          )}

          {gameState === "historical" && currentPeriod && (
            <HistoricalScene period={currentPeriod} />
          )}

          {gameState === "quiz" && currentPeriod && (
            <HistoricalScene period={currentPeriod} />
          )}

          {gameState === "feedback" && currentPeriod && (
            <HistoricalScene period={currentPeriod} />
          )}
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {gameState === "cockpit" && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTimeTravel}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2 shadow-lg shadow-purple-500/25"
            >
              <Zap className="h-6 w-6" />
              <span>Move to Past</span>
              <Clock className="h-6 w-6" />
            </motion.button>
          </div>
        )}

        {gameState === "traveling" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [1, 1.5, 2], rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl"
            >
              ⏰
            </motion.div>
            <div className="absolute text-white text-2xl font-bold">
              Time Traveling...
            </div>
          </div>
        )}

        {gameState === "historical" && currentPeriod && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white max-w-md"
            >
              <h2 className="text-3xl font-bold mb-2">{currentPeriod.name}</h2>
              <p className="text-lg mb-2">{currentPeriod.year}</p>
              <p className="text-gray-300">{currentPeriod.description}</p>
            </motion.div>
          </div>
        )}

        {gameState === "quiz" && currentQuestion && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white max-w-2xl w-full mx-4"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">
                {currentQuestion.question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map(
                  (option: string, index: number) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(index)}
                      className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl p-4 text-left transition-all duration-300"
                    >
                      <span className="font-semibold">
                        {String.fromCharCode(65 + index)}.
                      </span>{" "}
                      {option}
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}

        {gameState === "feedback" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white max-w-md text-center"
            >
              <div className="text-6xl mb-4">{isCorrect ? "✅" : "❌"}</div>
              <h3 className="text-2xl font-bold mb-4">
                {isCorrect ? "Great Job!" : "Oops! Try again."}
              </h3>
              <p className="text-gray-300 mb-6">
                {currentQuestion?.explanation}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={returnToCockpit}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Return to Time Machine</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryGame;
