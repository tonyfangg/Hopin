import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(requestUrl.origin + '/auth/login?error=callback_error')
    }

    // Handle different auth flows
    if (type === 'recovery') {
      // Password reset flow - redirect to reset password page
      return NextResponse.redirect(requestUrl.origin + '/auth/reset-password')
    }
  }

  // Default redirect for sign up confirmations and other flows
  return NextResponse.redirect(requestUrl.origin + next)
};
