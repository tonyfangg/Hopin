import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Test both methods
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('🔍 Session data:', session)
    console.log('🔍 User data:', user)
    
    return NextResponse.json({
      session: {
        exists: !!session,
        userId: session?.user?.id || null,
        userEmail: session?.user?.email || null,
        sessionError: sessionError?.message || null
      },
      user: {
        exists: !!user,
        userId: user?.id || null,
        userEmail: user?.email || null,
        userError: userError?.message || null
      },
      debug: {
        sessionObject: session,
        userObject: user
      }
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
} 