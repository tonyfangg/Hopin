import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET() {
  try {
    console.log('🔍 Debug API: Starting...')
    const supabase = await createServerSupabaseClient()
    
    // Test basic connection
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('🔍 Session exists:', !!session)
    console.log('🔍 Session error:', sessionError)
    
    // Test properties table access
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, name')
      .limit(3)
    
    console.log('🔍 Properties test result:', properties)
    console.log('🔍 Properties error:', propertiesError)
    
    // Test user permissions table
    const { data: permissions, error: permissionsError } = await supabase
      .from('user_permissions')
      .select('user_id, organisation_id')
      .limit(3)
    
    console.log('🔍 Permissions test result:', permissions)
    console.log('🔍 Permissions error:', permissionsError)
    
    return NextResponse.json({
      status: 'success',
      session: {
        exists: !!session,
        userId: session?.user?.id,
        error: sessionError?.message
      },
      properties: {
        count: properties?.length || 0,
        sample: properties?.slice(0, 2) || [],
        error: propertiesError?.message
      },
      permissions: {
        count: permissions?.length || 0,
        sample: permissions?.slice(0, 2) || [],
        error: permissionsError?.message
      }
    })
    
  } catch (error) {
    console.error('❌ Debug API error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 