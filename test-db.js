import mongoose from "mongoose";

const testDatabase = async () => {
  console.log("🗄️  Testing Database Connection...\n");

  try {
    // Connect to database
    await mongoose.connect("mongodb://localhost:27017/learnkins");
    console.log("✅ Database connected successfully");

    // Check if users exist
    const User = mongoose.model(
      "User",
      new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        role: String,
        grade: String,
      })
    );

    const users = await User.find({});
    console.log(`📊 Found ${users.length} users in database`);

    if (users.length > 0) {
      console.log("👥 Users found:");
      users.forEach((user) => {
        console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
      });
    } else {
      console.log("❌ No users found in database");
      console.log("💡 Run: npm run server:seed to populate database");
    }

    await mongoose.disconnect();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.log("❌ Database connection failed");
    console.log(`   Error: ${error.message}`);
  }
};

testDatabase().catch(console.error);
