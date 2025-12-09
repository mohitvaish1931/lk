import mongoose from 'mongoose';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnkins';

const checkUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find().select('name email role');
    console.log('\nAll Users in Database:');
    console.log(JSON.stringify(users, null, 2));
    
    const adminUser = await User.findOne({ email: 'mohitlalwani1907@gmail.com' });
    console.log('\nAdmin User Found:', adminUser ? 'YES' : 'NO');
    if (adminUser) console.log('  Email:', adminUser.email, '  Role:', adminUser.role);
    
    const studentUser = await User.findOne({ email: 'mohitlalwani1931@gmail.com' });
    console.log('Student User Found:', studentUser ? 'YES' : 'NO');
    if (studentUser) console.log('  Email:', studentUser.email, '  Role:', studentUser.role);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkUsers();
