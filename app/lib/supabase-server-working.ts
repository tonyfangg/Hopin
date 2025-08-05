import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from './supabase'

export async function createWorkingSupabaseClient() {
  try {
    const cookieStore = await cookies()
    
    // Create base client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Get all cookies and find auth tokens
    const allCookies = cookieStore.getAll()
    console.log('🔍 All cookies:', allCookies.map(c => c.name))
    
    const authCookies = allCookies.filter(cookie => 
      cookie.name.includes('auth-token') && 
      !cookie.name.includes('code-verifier')
    ).sort((a, b) => a.name.localeCompare(b.name))
    
    console.log('🔍 Auth cookies found:', authCookies.length)
    
    if (authCookies.length > 0) {
      try {
        // Reconstruct the token from cookie chunks
        let tokenString = ''
        authCookies.forEach(cookie => {
          tokenString += cookie.value
        })
        
        console.log('🔍 Token string length:', tokenString.length)
        
        const authData = JSON.parse(tokenString)
        
        // Check if token is not expired
        const now = Math.floor(Date.now() / 1000)
        if (authData.expires_at > now) {
          // Set the session manually
          const { error } = await supabase.auth.setSession({
            access_token: authData.access_token,
            refresh_token: authData.refresh_token
          })
          
          if (error) {
            console.log('⚠️ Session set error:', error)
          } else {
            console.log('✅ Session restored for user:', authData.user?.id)
          }
        } else {
          console.log('⚠️ Token expired, expires_at:', authData.expires_at, 'now:', now)
        }
      } catch (error) {
        console.log('⚠️ Failed to restore session:', error)
      }
    } else {
      console.log('⚠️ No auth cookies found')
    }
    
    return supabase
  } catch (error) {
    console.error('🚨 createWorkingSupabaseClient error:', error)
    // Fallback to basic client
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
}