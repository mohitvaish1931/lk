import axios from 'axios';

const testParentLogin = async () => {
  try {
    const API_URL = 'http://localhost:5000/api';
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'mohitlalwani1931.parent@gmail.com',
      password: 'mohit@123'
    });
    
    console.log('✅ Parent login successful');
    console.log('User:', response.data.user.name);
    console.log('Role:', response.data.user.role);
    console.log('Token:', response.data.token.substring(0, 30) + '...');
  } catch (err) {
    console.error('❌ Parent login failed');
    console.error('Error message:', err.message);
    console.error('Response data:', err.response?.data);
    console.error('Status:', err.response?.status);
    console.error('Full error:', err);
  }
};

testParentLogin();
