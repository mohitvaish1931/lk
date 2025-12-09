import axios from 'axios';

const testBackend = async () => {
  try {
    console.log('Testing LearnKins Backend...\n');
    
    const API_URL = 'http://localhost:5000/api';
    
    // Test 1: Health check
    console.log('1️⃣  Health Check');
    const health = await axios.get(`${API_URL}/health`);
    console.log('   ✅ Backend running:', health.data.message);
    
    // Test 2: Get Quizzes
    console.log('\n2️⃣  Quizzes');
    const quizzes = await axios.get(`${API_URL}/quizzes?limit=1`);
    console.log('   ✅ Quizzes found:', quizzes.data.count, '(showing first 1)');
    if (quizzes.data.data && quizzes.data.data[0]) {
      console.log('   Title:', quizzes.data.data[0].title);
    }
    
    // Test 3: Get Materials
    console.log('\n3️⃣  Study Materials');
    const materials = await axios.get(`${API_URL}/materials?limit=1`);
    console.log('   ✅ Materials found:', materials.data.count);
    if (materials.data.data && materials.data.data[0]) {
      console.log('   Title:', materials.data.data[0].title);
    }
    
    // Test 4: Get Flashcards
    console.log('\n4️⃣  Flashcards');
    const flashcards = await axios.get(`${API_URL}/flashcards?limit=1`);
    console.log('   ✅ Flashcards found:', flashcards.data.count);
    if (flashcards.data.data && flashcards.data.data[0]) {
      console.log('   Question:', flashcards.data.data[0].question?.substring(0, 50));
    }
    
    // Test 5: Admin Login
    console.log('\n5️⃣  Admin Login');
    try {
      const adminLogin = await axios.post(`${API_URL}/auth/login`, {
        email: 'mohitlalwani1907@gmail.com',
        password: 'mohitvaish@1931'
      });
      console.log('   ✅ Admin login successful');
      console.log('   Role:', adminLogin.data.user.role);
      console.log('   Token:', adminLogin.data.token?.substring(0, 20) + '...');
    } catch (err) {
      console.log('   ❌ Admin login failed:', err.response?.data?.message);
    }
    
    // Test 6: Student Login
    console.log('\n6️⃣  Student Login');
    try {
      const studentLogin = await axios.post(`${API_URL}/auth/login`, {
        email: 'mohitlalwani1931@gmail.com',
        password: 'mohit@123'
      });
      console.log('   ✅ Student login successful');
      console.log('   Role:', studentLogin.data.user.role);
      console.log('   Token:', studentLogin.data.token?.substring(0, 20) + '...');
    } catch (err) {
      console.log('   ❌ Student login failed:', err.response?.data?.message);
    }
    
    // Test 7: Parent Login
    console.log('\n7️⃣  Parent Login');
    try {
      const parentLogin = await axios.post(`${API_URL}/auth/login`, {
        email: 'mohitlalwani1931.parent@gmail.com',
        password: 'mohit@123'
      });
      console.log('   ✅ Parent login successful');
      console.log('   Role:', parentLogin.data.user.role);
      console.log('   Token:', parentLogin.data.token?.substring(0, 20) + '...');
    } catch (err) {
      console.log('   ❌ Parent login failed:', err.response?.data?.message);
    }
    
    // Test 8: Get Users (Admin only)
    console.log('\n8️⃣  Get Users (Protected - requires admin token)');
    try {
      const adminLogin = await axios.post(`${API_URL}/auth/login`, {
        email: 'mohitlalwani1907@gmail.com',
        password: 'mohitvaish@1931'
      });
      const token = adminLogin.data.token;
      const users = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('   ✅ Users retrieved:', users.data.data.length, 'users');
      console.log('   First 3 users:');
      users.data.data.slice(0, 3).forEach((u, i) => {
        console.log(`     ${i+1}. ${u.name} (${u.email}) - ${u.role}`);
      });
    } catch (err) {
      console.log('   ❌ Failed:', err.response?.data?.message);
    }
    
    console.log('\n✅ All backend tests completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
};

testBackend();
