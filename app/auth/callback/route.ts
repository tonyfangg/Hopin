import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerSupabaseClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + '/dashboard')
};
