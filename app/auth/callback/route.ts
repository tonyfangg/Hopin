import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Enhanced logging
  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('Request URL:', requestUrl.toString())
  console.log('Query params:', {
    code: code ? `${code.substring(0, 10)}...` : null,
    type,
    next,
    error,
    errorDescription,
    allParams: Object.fromEntries(requestUrl.searchParams)
  })

  // Check for OAuth errors first
  if (error) {
    console.log('OAuth error detected:', { error, errorDescription })
    return NextResponse.redirect(requestUrl.origin + `/auth/login?error=oauth_${error}`)
  }

  if (!code) {
    console.log('No authorization code provided')
    return NextResponse.redirect(requestUrl.origin + '/auth/login?error=no_code')
  }

  try {
    const supabase = await createServerSupabaseClient()
    
    console.log('Attempting to exchange code for session...')
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Code exchange error:', {
        message: exchangeError.message,
        status: exchangeError.status,
        details: exchangeError
      })
      
      // More specific error handling
      if (exchangeError.message?.includes('expired')) {
        return NextResponse.redirect(requestUrl.origin + '/auth/login?error=expired_code')
      }
      if (exchangeError.message?.includes('invalid')) {
        return NextResponse.redirect(requestUrl.origin + '/auth/login?error=invalid_code')
      }
      
      return NextResponse.redirect(requestUrl.origin + '/auth/login?error=exchange_failed')
    }

    if (!data.session) {
      console.error('No session returned after successful code exchange')
      return NextResponse.redirect(requestUrl.origin + '/auth/login?error=no_session')
    }

    console.log('Session created successfully:', {
      userId: data.session.user.id,
      email: data.session.user.email,
      type,
      sessionId: data.session.access_token.substring(0, 10) + '...'
    })

    // Handle different auth flows
    if (type === 'recovery') {
      console.log('Password recovery flow - redirecting to reset password page')
      const resetUrl = requestUrl.origin + '/auth/reset-password'
      console.log('Reset URL:', resetUrl)
      return NextResponse.redirect(resetUrl)
    }

    // Default flow (signup confirmation, etc.)
    console.log('Default flow - redirecting to:', next)
    return NextResponse.redirect(requestUrl.origin + next)
    
  } catch (err) {
    console.error('Auth callback exception:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      error: err
    })
    
    return NextResponse.redirect(requestUrl.origin + '/auth/login?error=callback_exception')
  }
} 