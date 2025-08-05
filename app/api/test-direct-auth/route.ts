import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get cookies from request
    const cookies = request.cookies.getAll()
    console.log('🔍 Direct Auth Test - All cookies:', cookies.map(c => c.name))
    
    // Look for auth token in cookies
    const authTokenCookies = cookies.filter(cookie => 
      cookie.name.includes('auth-token') && !cookie.name.includes('code-verifier')
    )
    
    console.log('🔍 Auth token cookies found:', authTokenCookies.length)
    
    if (authTokenCookies.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No auth token cookies found',
        cookieNames: cookies.map(c => c.name)
      })
    }
    
    // Reconstruct the auth token from multiple cookie chunks
    let authTokenString = ''
    authTokenCookies
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(cookie => {
        authTokenString += cookie.value
      })
    
    console.log('🔍 Reconstructed token length:', authTokenString.length)
    
    let authToken
    try {
      authToken = JSON.parse(authTokenString)
      console.log('🔍 Token parsed successfully, user:', authToken.user?.id)
    } catch (e) {
      console.log('🔍 Failed to parse auth token:', e)
      return NextResponse.json({
        success: false,
        error: 'Failed to parse auth token',
        tokenLength: authTokenString.length
      })
    }
    
    // Create supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Set the session manually
    const { data: { user }, error } = await supabase.auth.setSession({
      access_token: authToken.access_token,
      refresh_token: authToken.refresh_token
    })
    
    if (error) {
      console.log('🔍 Supabase auth error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      })
    }
    
    return NextResponse.json({
      success: true,
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      tokenExpiry: new Date(authToken.expires_at * 1000).toISOString()
    })
    
  } catch (error) {
    console.error('Direct auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}