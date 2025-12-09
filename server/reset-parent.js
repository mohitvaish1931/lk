import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnkins';

const resetParent = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const email = 'mohitlalwani1931.parent@gmail.com';
    const password = 'mohit@123';
    
    let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('Resetting parent password...');
    user.password = password;
    await user.save();
    
    // Verify
    user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    const isMatch = await user.matchPassword(password);
    console.log(isMatch ? '✅ Password reset successful' : '❌ Reset failed');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

resetParent();
