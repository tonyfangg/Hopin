// =====================================================
// ELECTRICAL REPORTS API ENDPOINTS - BRITISH ENGLISH
// File: app/api/electrical-reports/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create the Supabase client with your keys
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Starting electrical reports API call')
    
    // Extract parameters
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('property_id')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

    // Build query
    let query = supabase
      .from('electrical_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (propertyId && propertyId !== 'all') {
      query = query.eq('property_id', propertyId)
    }

    query = query.range(offset, offset + limit - 1)

    console.log('🔄 Executing Supabase query...')
    const { data: reports, error: reportsError } = await query

    if (reportsError) {
      console.error('❌ Supabase error:', reportsError)
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        details: reportsError.message
      }, { status: 500 })
    }

    console.log(`✅ Found ${reports?.length || 0} electrical reports`)



    // Process data safely
    const safeReports = reports || []
    
    // Calculate stats
    const stats = {
      total_reports: safeReports.length,
      pending_inspections: safeReports.filter(r => 
        r?.compliance_status?.toLowerCase() === 'pending'
      ).length,
      overdue_inspections: safeReports.filter(r => {
        if (!r?.next_inspection_due) return false
        try {
          return new Date(r.next_inspection_due) < new Date()
        } catch {
          return false
        }
      }).length,
      average_safety_score: safeReports.length > 0 ? 
        Math.round(
          safeReports.reduce((sum, r) => sum + (Number(r?.safety_score) || 0), 0) / safeReports.length
        ) : 0,
      high_risk_items: safeReports.filter(r => (Number(r?.risk_rating) || 0) >= 7).length
    }

    // Transform data to prevent undefined errors
    const transformedReports = safeReports.map(report => ({
      id: report.id || '',
      issue_type: report.issue_type || 'Unknown',
      person_injury: report.person_injury || null,
      appliance_damage: report.appliance_damage || null,
      address: report.address || null,
      date_needed: report.date_needed || null,
      photo_url: report.photo_url || null,
      created_at: report.created_at || new Date().toISOString(),
      inspection_type: report.inspection_type || null,
      certificate_number: report.certificate_number || null,
      inspector_name: report.inspector_name || 'Not assigned',
      inspector_qualification: report.inspector_qualification || null,
      inspection_date: report.inspection_date || null,
      next_inspection_due: report.next_inspection_due || null,
      overall_condition: report.overall_condition || null,
      remedial_work_required: Boolean(report.remedial_work_required),
      remedial_work_description: report.remedial_work_description || null,
      remedial_work_priority: report.remedial_work_priority || null,
      test_results: (() => {
        try {
          return typeof report.test_results === 'string' 
            ? JSON.parse(report.test_results) 
            : report.test_results || {}
        } catch {
          return {}
        }
      })(),
      risk_rating: Number(report.risk_rating) || 0,
      compliance_status: report.compliance_status || 'unknown',
      updated_at: report.updated_at || new Date().toISOString(),
      property_id: report.property_id || null,
      safety_score: Number(report.safety_score) || 0,
      cost: Number(report.cost) || 0
    }))

    return NextResponse.json({
      success: true,
      data: transformedReports,
      pagination: {
        total: safeReports.length,
        limit,
        offset,
        has_more: safeReports.length === limit
      },
      stats
    })

  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.issue_type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: issue_type'
      }, { status: 400 })
    }

    const { data: newReport, error: insertError } = await supabase
      .from('electrical_reports')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create electrical report',
        details: insertError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: newReport
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 