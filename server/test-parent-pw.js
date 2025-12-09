import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnkins';

const testParentPassword = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const email = 'mohitlalwani1931.parent@gmail.com';
    const password = 'mohit@123';
    
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }
    
    console.log(`✓ Parent user found: ${user.email}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Stored hash: ${user.password.substring(0, 30)}...`);
    
    const isMatch = await user.matchPassword(password);
    console.log(`\n✓ Password test: ${isMatch ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
    
    if (!isMatch) {
      console.log(`\n  Tried password: "${password}"`);
      console.log('  Resetting password...\n');
      user.password = password;
      await user.save();
      console.log('  ✅ Password reset successfully');
      
      // Test new password
      const updatedUser = await User.findOne({ email: email.toLowerCase() }).select('+password');
      const newMatch = await updatedUser.matchPassword(password);
      console.log(`  Verification: ${newMatch ? '✅ NEW PASSWORD WORKS' : '❌ STILL FAILING'}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

testParentPassword();
