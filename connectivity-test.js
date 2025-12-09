import axios from "axios";

const testConnections = async () => {
  console.log("🔍 Testing LearnKins Connectivity...\n");

  const tests = [
    {
      name: "Backend Server",
      url: "http://localhost:5000/api/health",
      method: "GET",
    },
    {
      name: "Frontend Dev Server",
      url: "http://localhost:5173",
      method: "GET",
    },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000,
      });

      if (response.status === 200) {
        console.log(`✅ ${test.name}: Connected successfully`);
        if (test.name === "Backend Server") {
          console.log(`   Response: ${JSON.stringify(response.data)}`);
        }
      } else {
        console.log(`⚠️  ${test.name}: Unexpected status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Connection failed`);
      console.log(`   Error: ${error.message}`);
    }
    console.log("");
  }

  console.log("📋 Connection Summary:");
  console.log("• Frontend: http://localhost:5173");
  console.log("• Backend: http://localhost:5000");
  console.log("• API Health: http://localhost:5000/api/health");
  console.log("• Database: MongoDB (check if running)");
};

testConnections().catch(console.error);
