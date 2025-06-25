// =====================================================
// TEST PROPERTIES API ENDPOINT (DEVELOPMENT ONLY)
// File: app/api/test-properties/route.ts
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
    
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) {
      console.error('Properties query error:', error)
      return NextResponse.json({ 
        error: 'Database error',
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Properties retrieved successfully',
      count: properties?.length || 0,
      properties: properties || []
    })
  } catch (error) {
    console.error('Test properties API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 