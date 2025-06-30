import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Dynamic import for build safety
    const { createClient } = await import('@/app/lib/supabase-client')
    const supabase = createClient()

    // Test the connection by making a simple query
    const { data, error } = await supabase
      .from('electrical_reports')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Supabase',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Supabase',
      timestamp: new Date().toISOString(),
      data: {
        connection: 'active',
        table_access: 'electrical_reports',
        records_found: data?.length || 0
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 