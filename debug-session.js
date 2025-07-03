// Quick debug script to run in browser console
// debug-session.js
/*
// Run this in browser console after login to debug:

console.log('=== SESSION DEBUG ===');

// Check if supabase client exists
if (typeof window !== 'undefined' && window.supabase) {
  console.log('Supabase client found');
} else {
  console.log('Supabase client not found in window');
}

// Try to get session
const checkSession = async () => {
  try {
    const supabase = createClient(); // This might fail if not in scope
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Session check result:', { 
      hasSession: !!session, 
      error: error?.message,
      userId: session?.user?.id,
      email: session?.user?.email 
    });
    
    if (session) {
      console.log('Session is valid - should be able to access dashboard');
      console.log('Attempting redirect...');
      window.location.href = '/dashboard';
    } else {
      console.log('No valid session found');
    }
  } catch (err) {
    console.error('Session check failed:', err);
  }
};

checkSession();
*/

// Alternative debug function that can be called directly
export function debugSession() {
  console.log('=== SESSION DEBUG ===');
  
  // Check current URL
  console.log('Current URL:', window.location.href);
  
  // Check for any auth-related cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  console.log('Cookies:', cookies);
  
  // Check localStorage for any auth data
  const authData = localStorage.getItem('supabase.auth.token');
  console.log('LocalStorage auth data:', authData ? 'Found' : 'Not found');
  
  // Try to access Supabase client if available
  if (typeof window !== 'undefined' && window.supabase) {
    console.log('Supabase client found in window object');
  } else {
    console.log('Supabase client not found in window object');
  }
}

// Export for use in components
if (typeof window !== 'undefined') {
  window.debugSession = debugSession;
} 