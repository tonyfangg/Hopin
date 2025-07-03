// Alternative: Console command to run manually
// Run this in browser console after successful login:
/*
console.log('=== MANUAL REDIRECT TEST ===');

// Check session
const checkAndRedirect = async () => {
  try {
    // Get supabase client (you might need to adjust this)
    const supabase = window.supabase || createClient();
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('Session check:', {
      hasSession: !!session,
      error: error?.message,
      email: session?.user?.email
    });
    
    if (session) {
      console.log('✅ Session found - attempting redirect');
      
      // Try multiple redirect methods
      console.log('🚀 Method 1: window.location.href');
      window.location.href = '/dashboard';
      
      // Fallback after 2 seconds
      setTimeout(() => {
        console.log('🚀 Method 2: window.location.replace');
        window.location.replace('/dashboard');
      }, 2000);
      
    } else {
      console.log('❌ No session - cannot redirect');
    }
  } catch (err) {
    console.error('Manual redirect error:', err);
  }
};

checkAndRedirect();
*/

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.debugRedirect = function() {
    console.log('=== MANUAL REDIRECT TEST ===');
    
    const checkAndRedirect = async () => {
      try {
        // Try to get supabase client
        let supabase;
        if (window.supabase) {
          supabase = window.supabase;
        } else if (typeof createClient === 'function') {
          supabase = createClient();
        } else {
          console.error('❌ Supabase client not found');
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Session check:', {
          hasSession: !!session,
          error: error?.message,
          email: session?.user?.email,
          userId: session?.user?.id?.substring(0, 8)
        });
        
        if (session) {
          console.log('✅ Session found - attempting redirect');
          
          // Try multiple redirect methods
          console.log('🚀 Method 1: window.location.href');
          window.location.href = '/dashboard';
          
          // Fallback after 2 seconds
          setTimeout(() => {
            console.log('🚀 Method 2: window.location.replace');
            window.location.replace('/dashboard');
          }, 2000);
          
        } else {
          console.log('❌ No session - cannot redirect');
          console.log('💡 Try logging in first');
        }
      } catch (err) {
        console.error('Manual redirect error:', err);
      }
    };
    
    checkAndRedirect();
  };
  
  // Also add a session checker
  window.checkSession = function() {
    console.log('=== SESSION CHECK ===');
    
    const checkSession = async () => {
      try {
        let supabase;
        if (window.supabase) {
          supabase = window.supabase;
        } else if (typeof createClient === 'function') {
          supabase = createClient();
        } else {
          console.error('❌ Supabase client not found');
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Session Status:', {
          hasSession: !!session,
          error: error?.message,
          email: session?.user?.email,
          userId: session?.user?.id?.substring(0, 8),
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'
        });
        
        if (session) {
          console.log('✅ Session is valid');
        } else {
          console.log('❌ No valid session found');
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    
    checkSession();
  };
  
  console.log('🔧 Debug functions loaded:');
  console.log('- debugRedirect() - Test redirect functionality');
  console.log('- checkSession() - Check current session status');
} 