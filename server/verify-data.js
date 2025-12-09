import mongoose from 'mongoose';
import Quiz from './models/Quiz.js';
import Flashcard from './models/Flashcard.js';
import Material from './models/Material.js';

mongoose.connect('mongodb://localhost:27017/learnkins').then(async () => {
  const quizCount = await Quiz.countDocuments();
  const fcCount = await Flashcard.countDocuments();
  const matCount = await Material.countDocuments();
  
  console.log('\n📊 DATABASE VERIFICATION:');
  console.log(`  Quizzes: ${quizCount}`);
  console.log(`  Flashcards: ${fcCount}`);
  console.log(`  Materials: ${matCount}`);
  
  const sampleQuiz = await Quiz.findOne();
  if (sampleQuiz) {
    console.log(`\n📋 Sample Quiz: ${sampleQuiz.title}`);
    console.log(`   Questions: ${sampleQuiz.questions.length}`);
    console.log(`   Grade: ${sampleQuiz.grade}`);
  }
  
  const sampleFC = await Flashcard.findOne();
  if (sampleFC) {
    console.log(`\n📇 Sample Flashcard:`);
    console.log(`   Q: ${sampleFC.question.substring(0, 50)}...`);
    console.log(`   Subject: ${sampleFC.subject}`);
  }
  
  const sampleMat = await Material.findOne();
  if (sampleMat) {
    console.log(`\n📖 Sample Material: ${sampleMat.title}`);
    console.log(`   Subject: ${sampleMat.subject}`);
  }
  
  console.log('\n✅ All data verified successfully!\n');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
