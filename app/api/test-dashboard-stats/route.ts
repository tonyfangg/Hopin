// =====================================================
// TEST DASHBOARD STATS API ENDPOINT (DEVELOPMENT ONLY)
// File: app/api/test-dashboard-stats/route.ts
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
    
    // Get counts for dashboard statistics
    const [
      { count: organisationsCount },
      { count: propertiesCount },
      { count: electricalReportsCount },
      { count: drainageReportsCount },
      { count: documentsCount },
      { count: riskAssessmentsCount }
    ] = await Promise.all([
      supabase.from('organisations').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('properties').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('electrical_reports').select('*', { count: 'exact', head: true }),
      supabase.from('drainage_reports').select('*', { count: 'exact', head: true }),
      supabase.from('documents').select('*', { count: 'exact', head: true }),
      supabase.from('risk_assessments').select('*', { count: 'exact', head: true })
    ])
    
    // Get recent activities
    const { data: recentActivities } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Get risk scores
    const { data: riskScores } = await supabase
      .from('risk_assessments')
      .select('risk_score, assessment_date')
      .order('assessment_date', { ascending: false })
      .limit(30)
    
    return NextResponse.json({
      message: 'Dashboard statistics retrieved successfully',
      stats: {
        organisations: organisationsCount || 0,
        properties: propertiesCount || 0,
        electricalReports: electricalReportsCount || 0,
        drainageReports: drainageReportsCount || 0,
        documents: documentsCount || 0,
        riskAssessments: riskAssessmentsCount || 0
      },
      recentActivities: recentActivities || [],
      riskScores: riskScores || []
    })
  } catch (error) {
    console.error('Test dashboard stats API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 