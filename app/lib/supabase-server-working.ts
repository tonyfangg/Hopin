import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from './supabase'

export async function createWorkingSupabaseClient() {
  const cookieStore = await cookies()
  
  // Create base client
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  // Get all cookies and find auth tokens
  const allCookies = cookieStore.getAll()
  const authCookies = allCookies.filter(cookie => 
    cookie.name.includes('auth-token') && 
    !cookie.name.includes('code-verifier')
  ).sort((a, b) => a.name.localeCompare(b.name))
  
  if (authCookies.length > 0) {
    try {
      // Reconstruct the token from cookie chunks
      let tokenString = ''
      authCookies.forEach(cookie => {
        tokenString += cookie.value
      })
      
      const authData = JSON.parse(tokenString)
      
      // Check if token is not expired
      const now = Math.floor(Date.now() / 1000)
      if (authData.expires_at > now) {
        // Set the session manually
        await supabase.auth.setSession({
          access_token: authData.access_token,
          refresh_token: authData.refresh_token
        })
        
        console.log('✅ Session restored for user:', authData.user?.id)
      } else {
        console.log('⚠️ Token expired, expires_at:', authData.expires_at, 'now:', now)
      }
    } catch (error) {
      console.log('⚠️ Failed to restore session:', error)
    }
  }
  
  return supabase
}