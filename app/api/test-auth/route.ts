// =====================================================
// AUTHENTICATION TEST API ENDPOINT
// File: app/api/test-auth/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ 
        error: 'Session error',
        details: sessionError.message 
      }, { status: 500 })
    }

    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        message: 'User is not authenticated',
        auth_headers: request.headers.get('authorization') ? 'Present' : 'Missing'
      }, { status: 401 })
    }

    // Get user details
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('User error:', userError)
      return NextResponse.json({ 
        error: 'User error',
        details: userError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user?.id,
        email: user?.email,
        created_at: user?.created_at
      },
      session: {
        access_token: session.access_token ? 'Present' : 'Missing',
        refresh_token: session.refresh_token ? 'Present' : 'Missing',
        expires_at: session.expires_at
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Auth test API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 