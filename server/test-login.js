import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnkins';

const testLogin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const email = 'mohitlalwani1907@gmail.com';
    const password = 'mohitvaish@1931';
    
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }
    
    console.log(`✓ User found: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Stored hash: ${user.password.substring(0, 20)}...`);
    
    const isMatch = await user.matchPassword(password);
    console.log(`\n✓ Password test: ${isMatch ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
    
    if (!isMatch) {
      console.log(`\n  Tried password: "${password}"`);
      console.log('  This password does not match the stored hash.');
      console.log('  Consider resetting the password using the createTestUsers script.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

testLogin();
