import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Use your actual environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    console.log('Testing connection with:')
    console.log('URL:', supabaseUrl ? 'Set ✅' : 'Missing ❌')
    console.log('Service Key:', supabaseServiceKey ? 'Set ✅' : 'Missing ❌')

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase configuration',
        details: {
          url: !!supabaseUrl,
          serviceKey: !!supabaseServiceKey
        }
      }, { status: 500 })
    }

    // Create Supabase client with your keys
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test connection
    const { data: electricalTest, error: electricalError } = await supabase
      .from('electrical_reports')
      .select('id')
      .limit(1)

    const { data: propertiesTest, error: propertiesError } = await supabase
      .from('properties')
      .select('id')
      .limit(1)

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      connection: {
        url: supabaseUrl,
        configured: true
      },
      tables: {
        electrical_reports: {
          accessible: !electricalError,
          error: electricalError?.message || null,
          sample_count: electricalTest?.length || 0
        },
        properties: {
          accessible: !propertiesError,
          error: propertiesError?.message || null,
          sample_count: propertiesTest?.length || 0
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 