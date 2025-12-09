# 3D History Time Machine Game

An interactive 3D educational game built with Three.js and React for students of classes 6 to 8, based on NCERT History curriculum.

## 🎮 Features

### Core Gameplay

- **3D Time Machine Cockpit**: Students sit in a futuristic time machine with animated controls
- **Time Travel Animation**: Dynamic light tunnel effects with spinning clocks and glitch transitions
- **Historical Settings**: 5 different historical periods with unique 3D environments
- **Interactive Quizzes**: MCQ-style questions based on NCERT curriculum
- **Real-time Feedback**: Immediate feedback with explanations for each answer

### Historical Periods

1. **Harappan Civilization** (2600-1900 BCE)

   - Ancient Indus Valley structures
   - Questions about rivers, agriculture, and domestication

2. **Mauryan Empire** (322-185 BCE)

   - Imperial architecture
   - Questions about Chandragupta, Ashoka, and Pataliputra

3. **Delhi Sultanate** (1206-1526 CE)

   - Qutub Minar and fort walls
   - Questions about Sultans and their achievements

4. **Mughal Empire** (1526-1857 CE)

   - Taj Mahal and palace architecture
   - Questions about Babur, Akbar, and Shah Jahan

5. **Gupta Empire** (320-550 CE)
   - Temple architecture with pillars
   - Questions about Chandragupta I, Samudragupta, and Kalidasa

### Technical Features

- **Three.js 3D Graphics**: Real-time 3D rendering with WebGL
- **React Three Fiber**: React integration for Three.js
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Works on tablets and laptops
- **Sound Controls**: Toggle ambient sounds for different periods
- **Score Tracking**: Real-time score and streak tracking

### Game States

1. **Cockpit**: Time machine with student character
2. **Traveling**: Animated time travel with particle effects
3. **Historical**: Period-specific 3D environment
4. **Quiz**: Interactive multiple-choice questions
5. **Feedback**: Answer feedback with explanations

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 🎯 Educational Value

### NCERT Curriculum Alignment

- **Class 6**: Ancient civilizations and early empires
- **Class 7**: Medieval period and Delhi Sultanate
- **Class 8**: Mughal Empire and modern history

### Learning Objectives

- **Historical Knowledge**: Reinforce key facts and dates
- **Critical Thinking**: Analyze historical events and figures
- **Engagement**: Make history fun and interactive
- **Retention**: Gamified learning improves memory retention

### Quiz Categories

- **Founders and Rulers**: Who established which empire?
- **Architecture**: Famous monuments and their builders
- **Cultural Achievements**: Literature, art, and science
- **Geographic Knowledge**: Capitals, rivers, and regions

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Modern browser with WebGL support

### Installation

```bash
# Install dependencies
npm install three @react-three/fiber @react-three/drei framer-motion

# Start development server
npm run dev
```

### Usage

1. Navigate to `/games` in the application
2. Click on "3D History Time Machine"
3. Click "Move to Past" to start time travel
4. Answer quiz questions in historical settings
5. Return to time machine to try different periods

## 🎨 Customization

### Adding New Historical Periods

1. Add period data to `historicalPeriods` array
2. Create 3D models in `HistoricalScene` component
3. Add period-specific questions
4. Update ambient sounds and lighting

### Modifying Quiz Questions

- Edit the `questions` array for each period
- Add new question types (True/False, matching, etc.)
- Customize feedback messages and explanations

### Styling Customization

- Modify Tailwind classes for different themes
- Update color schemes for different periods
- Customize animations and transitions

## 📱 Responsive Design

### Device Support

- **Desktop**: Full 3D experience with mouse controls
- **Tablet**: Touch-friendly interface with gesture support
- **Laptop**: Optimized for trackpad and keyboard

### Performance Optimization

- **LOD (Level of Detail)**: Simplified models for mobile
- **Texture Compression**: Optimized 3D textures
- **Frame Rate**: Maintains 60fps on modern devices

## 🎵 Audio Features

### Ambient Sounds

- **Harappan**: Birds and nature sounds
- **Mauryan**: Battle and marching sounds
- **Delhi Sultanate**: Market and crowd sounds
- **Mughal**: Palace and court music
- **Gupta**: Temple bells and chants

### Sound Controls

- Toggle sound on/off
- Volume adjustment
- Period-specific audio themes

## 🏆 Gamification Elements

### Scoring System

- **Correct Answer**: +10 points
- **Streak Bonus**: Consecutive correct answers
- **Total Score**: Cumulative points across sessions

### Achievements

- **Perfect Score**: All questions correct in one session
- **Streak Master**: 10+ consecutive correct answers
- **Time Traveler**: Visit all historical periods
- **History Buff**: Answer 50+ questions correctly

### Leaderboard

- **Global Rankings**: Compare with other students
- **Class Rankings**: Compete within your class
- **Period Specialists**: Best scores for each historical period

## 🔧 Development

### Project Structure

```
src/games/3d-history-game/
├── HistoryGame.tsx          # Basic version
├── EnhancedHistoryGame.tsx  # Full featured version
├── index.ts                 # Exports
└── README.md               # Documentation
```

### Key Components

- **TimeMachine**: 3D cockpit with animated controls
- **Student**: 3D character model with animations
- **HistoricalScene**: Period-specific 3D environments
- **TimeTravelEffect**: Particle effects for time travel
- **QuizInterface**: Interactive question system

### State Management

- **Game State**: cockpit → traveling → historical → quiz → feedback
- **Score Tracking**: Real-time updates
- **Period Selection**: Random historical period selection
- **Question Management**: Dynamic question loading

## 🎯 Future Enhancements

### Planned Features

- **Multiplayer Mode**: Compete with classmates
- **VR Support**: Virtual reality experience
- **More Periods**: Additional historical eras
- **Advanced 3D Models**: Detailed architectural models
- **Voice Narration**: Audio explanations
- **Progress Tracking**: Detailed learning analytics

### Technical Improvements

- **WebGL 2.0**: Enhanced graphics capabilities
- **PWA Support**: Offline functionality
- **Performance**: Further optimization for mobile
- **Accessibility**: Screen reader support

## 📚 Educational Standards

### NCERT Alignment

- **Class 6**: Ancient India and early civilizations
- **Class 7**: Medieval India and Delhi Sultanate
- **Class 8**: Modern India and Mughal Empire

### Learning Outcomes

- **Knowledge**: Historical facts and dates
- **Understanding**: Cause and effect relationships
- **Application**: Connect historical events to present
- **Analysis**: Compare different historical periods

## 🤝 Contributing

### Development Guidelines

1. Follow React and TypeScript best practices
2. Maintain 3D performance standards
3. Ensure educational accuracy
4. Test on multiple devices
5. Document new features

### Educational Content

- Verify historical accuracy with NCERT textbooks
- Include diverse perspectives and cultures
- Ensure age-appropriate content
- Provide clear explanations for all answers

## 📄 License

This project is part of the LearnKins educational platform and follows the same licensing terms.

---

**Made with ❤️ for educational excellence**
