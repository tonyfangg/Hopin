import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createServerSupabaseClient()
    
    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
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
      } else if (type === 'signup') {
        // Email confirmation flow - redirect to login with success message
        return NextResponse.redirect(
          new URL('/auth/login?message=email_confirmed', request.url)
        )
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

  // No code provided, redirect to login
  return NextResponse.redirect(
    new URL('/auth/login?error=no_auth_code', request.url)
  )
} 