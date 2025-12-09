import axios from "axios";

const testJWT = async () => {
  console.log("🔐 Testing JWT Configuration...\n");

  try {
    console.log("Testing login with JWT...");
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: "student@learnkins.com",
        password: "student123",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.status === 200) {
      console.log("✅ Login successful");
      console.log(`   Token: ${response.data.token ? "Present" : "Missing"}`);
      console.log(`   User: ${response.data.user.name}`);

      // Test token validation
      console.log("\n🔍 Testing token validation...");
      const meResponse = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });

      if (meResponse.status === 200) {
        console.log("✅ Token validation successful");
      } else {
        console.log("❌ Token validation failed");
      }
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log("❌ Login failed");
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(
        `   Message: ${error.response.data?.message || "Unknown error"}`
      );
      console.log(`   Error: ${JSON.stringify(error.response.data)}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
};

testJWT().catch(console.error);
