// =====================================================
// BUSINESS INTELLIGENCE DASHBOARD
// File: app/api/admin/analytics/route.ts - Admin-only analytics
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // Check if user is platform admin (add admin role to your system)
    const { data: userRole } = await supabase
      .from('user_permissions')
      .select('access_level')
      .eq('user_id', session.user.id)
      .single()

    if (userRole?.access_level !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get business intelligence metrics
    const [
      userGrowth,
      documentUploads,
      riskScoreDistribution,
      topPerformingOrganisations
    ] = await Promise.all([
      // User growth over time
      supabase
        .from('user_permissions')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Document upload trends
      supabase
        .from('documents')
        .select('category, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Risk score distribution (placeholder - would need risk_scores table)
      Promise.resolve({ data: [] }),
      
      // Top performing organisations (placeholder - would need compliance metrics)
      Promise.resolve({ data: [] })
    ])

    return NextResponse.json({
      user_growth: userGrowth.data,
      document_uploads: documentUploads.data,
      risk_scores: riskScoreDistribution.data,
      top_organisations: topPerformingOrganisations.data,
      generated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ error: 'Failed to generate analytics' }, { status: 500 })
  }
} 