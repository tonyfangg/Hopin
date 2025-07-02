import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url)
  
  // Check for both new (code) and old (token_hash) auth flows
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('Request URL:', requestUrl.toString())
  console.log('Auth flow detection:', {
    hasCode: !!code,
    hasTokenHash: !!tokenHash,
    type,
    next,
    error,
    errorDescription
  })

  // Check for OAuth errors first
  if (error) {
    console.log('OAuth error detected:', { error, errorDescription })
    return NextResponse.redirect(requestUrl.origin + `/auth/login?error=oauth_${error}`)
  }

  // Handle token_hash flow (older Supabase auth flow)
  if (tokenHash && type === 'recovery') {
    console.log('Token hash recovery flow detected - redirecting to reset password')
    
    // For token_hash flow, we redirect to reset password page
    // The client-side will handle the session using the token_hash
    const resetUrl = new URL('/auth/reset-password', requestUrl.origin)
    resetUrl.searchParams.set('token_hash', tokenHash)
    resetUrl.searchParams.set('type', type)
    
    console.log('Redirecting to:', resetUrl.toString())
    return NextResponse.redirect(resetUrl.toString())
  }

  // Handle code flow (newer PKCE flow)
  if (code) {
    console.log('Code flow detected - exchanging code for session')
    
    try {
      const supabase = await createServerSupabaseClient()
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        return NextResponse.redirect(requestUrl.origin + '/auth/login?error=exchange_failed')
      }

      if (!data.session) {
        console.error('No session returned after code exchange')
        return NextResponse.redirect(requestUrl.origin + '/auth/login?error=no_session')
      }

      console.log('Session created successfully for code flow')

      if (type === 'recovery') {
        return NextResponse.redirect(requestUrl.origin + '/auth/reset-password')
      }

      return NextResponse.redirect(requestUrl.origin + next)
      
    } catch (err) {
      console.error('Code exchange exception:', err)
      return NextResponse.redirect(requestUrl.origin + '/auth/login?error=callback_exception')
    }
  }

  // No valid auth parameters
  console.log('No valid auth parameters found')
  return NextResponse.redirect(requestUrl.origin + '/auth/login?error=no_auth_params')
} 