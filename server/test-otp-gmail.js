import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testOTPToGmail = async () => {
  try {
    console.log('\n🔑 Testing OTP Password Reset with Gmail\n');
    
    // Step 1: Request OTP
    console.log('Step 1: Requesting OTP...');
    const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'mohitlalwani1931@gmail.com'
    });
    console.log('✅ OTP sent to gmail:', forgotRes.data.message);
    
    // Wait a moment for email to arrive (in real scenario)
    console.log('\n⏳ OTP should be arriving in your Gmail inbox (mohitlalwani1931@gmail.com)');
    console.log('📧 Check: Inbox for OTP code\n');
    
    // For testing, you can manually enter the OTP from email
    console.log('Next steps:');
    console.log('1. Check your Gmail inbox for the OTP code');
    console.log('2. Copy the 6-digit code');
    console.log('3. Go to http://localhost:5173/forgot-password');
    console.log('4. Enter email: mohitlalwani1931@gmail.com');
    console.log('5. Enter the OTP code');
    console.log('6. Set new password');
    console.log('7. You will be auto-logged in!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
};

testOTPToGmail();
