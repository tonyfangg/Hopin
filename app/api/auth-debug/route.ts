import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Auth Debug - Headers:', Object.fromEntries(request.headers.entries()))
    console.log('🔍 Auth Debug - Cookies:', request.cookies.getAll())
    
    const supabase = await createServerSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    console.log('🔍 Auth Debug - Session:', !!session)
    console.log('🔍 Auth Debug - Error:', error)
    
    return NextResponse.json({
      hasSession: !!session,
      sessionUser: session?.user?.id || null,
      error: error?.message || null,
      cookies: request.cookies.getAll(),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}