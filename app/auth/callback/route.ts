import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  // Handle both code-based and token_hash-based authentication
  if (code || tokenHash) {
    const supabase = await createServerSupabaseClient()
    
    try {
      let sessionData: any = null
      let sessionError: any = null

      if (code) {
        // Exchange the code for a session (OAuth flows)
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        sessionData = data
        sessionError = error
      } else if (tokenHash) {
        // Handle token_hash from email templates
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type === 'recovery' ? 'recovery' : 'email'
        })
        sessionData = data
        sessionError = error
      }
      
      if (sessionError) {
        console.error('Auth callback error:', sessionError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=auth_callback_failed`, request.url)
        )
      }

      // Handle different callback types
      if (type === 'recovery') {
        // Password reset flow - redirect to reset password page
        return NextResponse.redirect(
          new URL('/auth/reset-password', request.url)
        )
      } else if (type === 'signup' || type === 'email') {
        // Email confirmation flow - redirect to login with success message
        return NextResponse.redirect(
          new URL('/auth/login?message=email_confirmed', request.url)
        )
      } else if (type === 'magiclink') {
        // Magic link flow - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        // Default authentication flow
        return NextResponse.redirect(new URL(next, request.url))
      }
    } catch (error) {
      console.error('Auth callback exception:', error)
      return NextResponse.redirect(
        new URL(`/auth/login?error=auth_callback_failed`, request.url)
      )
    }
  }

  // No authentication parameters provided, redirect to login
  return NextResponse.redirect(
    new URL('/auth/login?error=no_auth_code', request.url)
  )
} 