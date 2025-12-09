import axios from "axios";

const testLogin = async () => {
  console.log("🔐 Testing LearnKins Login Functionality...\n");

  const testCredentials = [
    { email: "student@learnkins.com", password: "student123", role: "Student" },
    { email: "teacher@learnkins.com", password: "teacher123", role: "Teacher" },
    { email: "parent@learnkins.com", password: "parent123", role: "Parent" },
    { email: "admin@learnkins.com", password: "admin123", role: "Admin" },
  ];

  for (const cred of testCredentials) {
    try {
      console.log(`Testing ${cred.role} login...`);
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: cred.email,
          password: cred.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      if (response.status === 200) {
        console.log(`✅ ${cred.role}: Login successful`);
        console.log(`   User: ${response.data.user.name}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${response.data.token ? "Present" : "Missing"}`);
      } else {
        console.log(`⚠️  ${cred.role}: Unexpected status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${cred.role}: Login failed`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(
          `   Message: ${error.response.data?.message || "Unknown error"}`
        );
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
    console.log("");
  }

  // Test API configuration
  console.log("🔧 Testing API Configuration...");
  try {
    const response = await axios.get("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: "Bearer test-token",
      },
    });
    console.log("✅ API configuration test completed");
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("✅ API authentication middleware working correctly");
    } else {
      console.log(`⚠️  API configuration issue: ${error.message}`);
    }
  }
};

testLogin().catch(console.error);
