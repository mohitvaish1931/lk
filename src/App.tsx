import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// @ts-ignore
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
// @ts-ignore
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// @ts-ignore
import Login from "./pages/Login";
// @ts-ignore
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import StudyMaterials from "./pages/StudyMaterials";
import GamesQuiz from "./pages/GamesQuiz";
import Games from "./pages/Games";
import Quizzes from "./pages/Quizzes";
import Quiz from "./pages/Quiz";
import Game from "./pages/Game";

import Community from "./pages/Community";
import ParentalControl from "./pages/ParentalControl";
import Contact from "./pages/Contact";
import Flashcards from "./pages/Flashcards";
import Notes from "./pages/Notes";
import Mathematics from "./pages/Mathematics";
import Science from "./pages/Science";
import SocialScience from "./pages/SocialScience";
import English from "./pages/English";
import Progress from "./pages/Progress";
import Team from "./pages/Team";
import AdminPanel from "./pages/AdminPanel";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import StartupAnimation from "./components/StartupAnimation";
import LearnerBot from "./learnerbot/EmbeddedLearnerBot";

function App() {
  const [showStartupAnimation, setShowStartupAnimation] = useState(true);

  useEffect(() => {
    // Temporarily disable localStorage check to always show animation
    // const hasSeenAnimation = localStorage.getItem('hasSeenStartupAnimation');
    // if (hasSeenAnimation) {
    //   setShowStartupAnimation(false);
    // }

    // Clear localStorage to reset animation
    localStorage.removeItem("hasSeenStartupAnimation");
  }, []);

  const handleAnimationComplete = () => {
    setShowStartupAnimation(false);
    localStorage.setItem("hasSeenStartupAnimation", "true");
  };

  if (showStartupAnimation) {
    return <StartupAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <AuthProvider>
      <GameProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subjects/:slug" element={<SubjectDetail />} />
                <Route path="/study-materials" element={<StudyMaterials />} />
                <Route path="/games-quiz" element={<GamesQuiz />} />
                <Route path="/games" element={<Games />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/game/:id" element={<Game />} />

                <Route path="/community" element={<Community />} />
                <Route path="/parental-control" element={<ParentalControl />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/mathematics" element={<Mathematics />} />
                <Route path="/science" element={<Science />} />
                <Route path="/social-science" element={<SocialScience />} />
                <Route path="/english" element={<English />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/team" element={<Team />} />
                <Route path="/learnerbot" element={<LearnerBot />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
