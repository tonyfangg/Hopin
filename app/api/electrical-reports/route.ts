// =====================================================
// ELECTRICAL REPORTS API ENDPOINTS - BRITISH ENGLISH
// File: app/api/electrical-reports/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Dynamic import for build safety
    const { createClient } = await import('@/app/lib/supabase-client')
    const supabase = createClient()

    const { data, error } = await supabase
      .from('electrical_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch electrical reports' },
        { status: 500 }
      )
    }

    // Transform data with safe fallbacks
    const transformedData = (data || []).map((report: any) => ({
      id: report.id || '',
      property_id: report.property_id || '',
      inspector_name: report.inspector_name || 'Unknown Inspector',
      inspection_date: report.inspection_date || new Date().toISOString(),
      safety_score: report.safety_score || 0,
      compliance_status: report.compliance_status || 'Unknown',
      issues_found: report.issues_found || [],
      recommendations: report.recommendations || [],
      next_inspection_date: report.next_inspection_date || null,
      created_at: report.created_at || new Date().toISOString(),
      updated_at: report.updated_at || new Date().toISOString()
    }))

    // Calculate stats
    const total_reports = transformedData.length;
    const average_safety_score = total_reports
      ? Math.round(
          transformedData.reduce((sum, r) => sum + (Number(r.safety_score) || 0), 0) / total_reports
        )
      : 0;
    const pending_inspections = transformedData.filter(r => r.compliance_status === 'Pending').length;
    const overdue_inspections = transformedData.filter(r => {
      const next = r.next_inspection_date ? new Date(r.next_inspection_date) : null;
      return next && next < new Date();
    }).length;
    const high_risk_items = transformedData.filter(r => (Number(r.safety_score) || 0) < 60).length;

    const stats = {
      total_reports,
      average_safety_score,
      pending_inspections,
      overdue_inspections,
      high_risk_items
    };

    return NextResponse.json({
      success: true,
      data: transformedData,
      stats
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Dynamic import for build safety
    const { createClient } = await import('@/app/lib/supabase-client')
    const supabase = createClient()

    const { data, error } = await supabase
      .from('electrical_reports')
      .insert([body])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create electrical report' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data?.[0] || null,
      message: 'Electrical report created successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 