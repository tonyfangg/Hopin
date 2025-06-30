// =====================================================
// ELECTRICAL REPORTS API ENDPOINTS - BRITISH ENGLISH
// File: app/api/electrical-reports/route.ts
// =====================================================

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Extract search parameters
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('property_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('electrical_reports')
      .select(`
        id,
        issue_type,
        person_injury,
        appliance_damage,
        address,
        date_needed,
        photo_url,
        created_at,
        inspection_type,
        certificate_number,
        inspector_name,
        inspector_qualification,
        inspection_date,
        next_inspection_due,
        overall_condition,
        remedial_work_required,
        remedial_work_description,
        remedial_work_priority,
        test_results,
        risk_rating,
        compliance_status,
        updated_at,
        property_id,
        safety_score,
        cost
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply property filter if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    let reports: any[] = []
    
    // Proper error handling in API route
    try {
      const { data, error: reportsError } = await query
      if (reportsError) {
        console.error('Error fetching electrical reports:', reportsError)
        return NextResponse.json({ error: 'Failed to fetch electrical reports' }, { status: 500 })
      }
      reports = data || []
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('electrical_reports')
      .select('*', { count: 'exact', head: true })

    if (propertyId) {
      countQuery = countQuery.eq('property_id', propertyId)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error counting electrical reports:', countError)
    }

    // Calculate summary statistics
    const stats = {
      total_reports: reports.length || 0,
      pending_inspections: reports.filter((r: any) => r.compliance_status === 'pending').length || 0,
      overdue_inspections: reports.filter((r: any) => {
        if (!r.next_inspection_due) return false
        return new Date(r.next_inspection_due) < new Date()
      }).length || 0,
      average_safety_score: reports.length ? 
        Math.round(reports.reduce((sum: number, r: any) => sum + (r.safety_score || 0), 0) / reports.length) : 0,
      high_risk_items: reports.filter((r: any) => (r.risk_rating || 0) >= 7).length || 0
    }

    // Transform data to ensure consistent structure with enhanced safety
    const transformedReports = (reports || []).map(report => ({
      ...report,
      // Ensure consistent date formatting
      created_at: report?.created_at ? new Date(report.created_at).toISOString() : null,
      updated_at: report?.updated_at ? new Date(report.updated_at).toISOString() : null,
      inspection_date: report?.inspection_date ? new Date(report.inspection_date).toISOString() : null,
      next_inspection_due: report?.next_inspection_due ? new Date(report.next_inspection_due).toISOString() : null,
      date_needed: report?.date_needed ? new Date(report.date_needed).toISOString() : null,
      
      // Ensure numeric fields are properly typed
      risk_rating: report?.risk_rating ? Number(report.risk_rating) : null,
      safety_score: report?.safety_score ? Number(report.safety_score) : null,
      cost: report?.cost ? Number(report.cost) : null,
      
      // Ensure booleans are properly typed
      remedial_work_required: Boolean(report?.remedial_work_required),
      
      // Parse JSON fields safely
      test_results: typeof report?.test_results === 'string' 
        ? (() => {
            try {
              return JSON.parse(report.test_results)
            } catch {
              return {}
            }
          })()
        : report?.test_results || {}
    }))

    return NextResponse.json({
      success: true,
      data: transformedReports,
      pagination: {
        total: count || 0,
        limit,
        offset,
        has_more: (count || 0) > offset + limit
      },
      stats
    })

  } catch (error) {
    console.error('Unexpected error in electrical reports API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['issue_type', 'property_id']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: `Required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Insert new electrical report
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
      console.error('Error creating electrical report:', insertError)
      return NextResponse.json(
        { 
          error: 'Failed to create electrical report', 
          details: insertError.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newReport
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error creating electrical report:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 