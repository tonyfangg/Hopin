// =====================================================
// DASHBOARD STATISTICS API
// File: app/api/dashboard/stats/route.ts
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

    // Get user's accessible organisations safely
    const { data: userPermissions, error: permError } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    if (permError || !userPermissions || userPermissions.length === 0) {
      return NextResponse.json({
        organisations: 0,
        properties: 0,
        electrical_reports: 0,
        drainage_reports: 0,
        risk_assessments: 0,
        documents: 0,
        expiring_documents: 0,
        overdue_inspections: 0
      })
    }

    const orgIds = userPermissions.map(perm => perm.organisation_id)

    // Get basic counts with error handling
    const stats = {
      organisations: 0,
      properties: 0,
      electrical_reports: 0,
      drainage_reports: 0,
      risk_assessments: 0,
      documents: 0,
      expiring_documents: 0,
      overdue_inspections: 0
    }

    try {
      // Organisations count
      const { count: orgsCount } = await supabase
        .from('organisations')
        .select('id', { count: 'exact', head: true })
        .in('id', orgIds)
        .eq('is_active', true)
      stats.organisations = orgsCount || 0
    } catch (error) {
      console.error('Error counting organisations:', error)
    }

    try {
      // Properties count
      const { count: propsCount } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .in('organisation_id', orgIds)
        .eq('is_active', true)
      stats.properties = propsCount || 0
    } catch (error) {
      console.error('Error counting properties:', error)
    }

    try {
      // Get property IDs for report filtering
      const { data: userProperties } = await supabase
        .from('properties')
        .select('id')
        .in('organisation_id', orgIds)

      const propertyIds = userProperties?.map(p => p.id) || []

      if (propertyIds.length > 0) {
        // Electrical reports count (last 30 days)
        const { count: electricalCount } = await supabase
          .from('electrical_reports')
          .select('id', { count: 'exact', head: true })
          .in('property_id', propertyIds)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        stats.electrical_reports = electricalCount || 0

        // Drainage reports count (last 30 days)
        const { count: drainageCount } = await supabase
          .from('drainage_reports')
          .select('id', { count: 'exact', head: true })
          .in('property_id', propertyIds)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        stats.drainage_reports = drainageCount || 0

        // Risk assessments count
        const { count: riskCount } = await supabase
          .from('risk_assessments')
          .select('id', { count: 'exact', head: true })
          .in('property_id', propertyIds)
        stats.risk_assessments = riskCount || 0
      }
    } catch (error) {
      console.error('Error counting reports:', error)
    }

    try {
      // Documents count
      const { count: docsCount } = await supabase
        .from('documents')
        .select('id', { count: 'exact', head: true })
        .in('organisation_id', orgIds)
        .eq('is_active', true)
      stats.documents = docsCount || 0
    } catch (error) {
      console.error('Error counting documents:', error)
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 