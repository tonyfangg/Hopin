// =====================================================
// TEST ORGANISATIONS API ENDPOINT (DEVELOPMENT ONLY)
// File: app/api/test-organisations/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Use service role key for testing (bypasses authentication)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: organisations, error } = await supabase
      .from('organisations')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) {
      console.error('Organisations query error:', error)
      return NextResponse.json({ 
        error: 'Database error',
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Organisations retrieved successfully',
      count: organisations?.length || 0,
      organisations: organisations || []
    })
  } catch (error) {
    console.error('Test organisations API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 