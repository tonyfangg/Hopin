// Debug authentication - run this in browser console while on dashboard
async function debugAuth() {
  console.log('🔍 Testing authentication...');
  
  try {
    // Test 1: Auth debug endpoint
    const authResponse = await fetch('/api/auth-debug', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    const authData = await authResponse.json();
    console.log('✅ Auth Debug Response:', authData);
    
    // Test 2: Electrical reports endpoint
    const electricalResponse = await fetch('/api/electrical-reports', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('⚡ Electrical API Status:', electricalResponse.status);
    
    if (electricalResponse.ok) {
      const electricalData = await electricalResponse.json();
      console.log('⚡ Electrical API Response:', electricalData);
    } else {
      const error = await electricalResponse.text();
      console.log('❌ Electrical API Error:', error);
    }
    
    // Test 3: Check cookies
    console.log('🍪 Document cookies:', document.cookie);
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

// Run the test
debugAuth();