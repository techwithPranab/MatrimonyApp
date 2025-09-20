// Test script to verify JWT error handling
const fetch = require('node-fetch');

async function testAuth() {
  console.log('🔍 Testing JWT error handling...\n');
  
  try {
    // Test home page load (should work with safe session handling)
    console.log('1. Testing home page load...');
    const homeResponse = await fetch('http://localhost:3001');
    console.log(`   Status: ${homeResponse.status} ${homeResponse.statusText}`);
    
    // Test clear session endpoint
    console.log('\n2. Testing session clearing endpoint...');
    const clearResponse = await fetch('http://localhost:3001/api/auth/clear-session', {
      method: 'POST'
    });
    const clearResult = await clearResponse.json();
    console.log(`   Status: ${clearResponse.status}`);
    console.log(`   Response: ${JSON.stringify(clearResult, null, 2)}`);
    
    // Test NextAuth status endpoint
    console.log('\n3. Testing NextAuth session endpoint...');
    const sessionResponse = await fetch('http://localhost:3001/api/auth/session');
    const sessionResult = await sessionResponse.json();
    console.log(`   Status: ${sessionResponse.status}`);
    console.log(`   Session: ${JSON.stringify(sessionResult, null, 2)}`);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testAuth();
