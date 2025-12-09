import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnkins';

const checkParent = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Search variations
    console.log('Searching for parent users...\n');
    
    const allParents = await User.find({ role: 'parent' }).select('name email createdAt');
    console.log(`Found ${allParents.length} parent users:`);
    allParents.forEach(p => console.log(`  - ${p.email} (${p.name})`));
    
    console.log('\nLooking for specific parent:');
    const emails = [
      'mohitlalwani1931.parent@gmail.com',
      'MOHITLALWANI1931.PARENT@GMAIL.COM',
      'Mohitlalwani1931.parent@gmail.com'
    ];
    
    for (const email of emails) {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (user) {
        console.log(`\n✅ Found with email: ${email}`);
        console.log(`   Actual DB email: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Password field exists: ${!!user.password}`);
        
        // Test password
        const isMatch = await user.matchPassword('mohit@123');
        console.log(`   Password "mohit@123" matches: ${isMatch}`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkParent();
