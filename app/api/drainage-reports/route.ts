// =====================================================
// DRAINAGE REPORTS API ENDPOINTS - BRITISH ENGLISH
// File: app/api/drainage-reports/route.ts
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

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('property_id')
    const inspectionType = searchParams.get('inspection_type')

    // First get user's authorised organisations
    const { data: userPermissions } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    const authorisedOrganisationIds = userPermissions?.map(p => p.organisation_id) || []

    if (authorisedOrganisationIds.length === 0) {
      return NextResponse.json({ reports: [] })
    }

    // Get properties user has access to
    const { data: userProperties } = await supabase
      .from('properties')
      .select('id')
      .in('organisation_id', authorisedOrganisationIds)
      .eq('is_active', true)

    const userPropertyIds = userProperties?.map(p => p.id) || []

    if (userPropertyIds.length === 0) {
      return NextResponse.json({ reports: [] })
    }

    // Build query
    let query = supabase
      .from('drainage_reports')
      .select(`
        *,
        property:properties(name, address, organisation_id)
      `)
      .in('property_id', userPropertyIds)

    // Filter by property if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    // Filter by inspection type if specified
    if (inspectionType) {
      query = query.eq('inspection_type', inspectionType)
    }

    const { data: reports, error } = await query
      .order('inspection_date', { ascending: false })

    if (error) {
      console.error('Error fetching drainage reports:', error)
      return NextResponse.json({ error: 'Failed to fetch drainage reports' }, { status: 500 })
    }

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Drainage reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const {
      property_id,
      inspection_type,
      inspector_name,
      inspection_date,
      next_inspection_due,
      drainage_condition,
      blockages_found,
      blockage_location,
      damage_found,
      damage_description,
      cleaning_performed,
      repairs_required,
      repair_description,
      repair_priority,
      risk_rating,
      recommendations,
      photos_taken
    } = body

    // Validate required fields
    if (!property_id || !inspection_type || !inspector_name || !inspection_date) {
      return NextResponse.json(
        { error: 'Property, inspection type, inspector name, and inspection date are required' }, 
        { status: 400 }
      )
    }

    // Check user has permission to manage this property
    const { data: property } = await supabase
      .from('properties')
      .select('organisation_id')
      .eq('id', property_id)
      .eq('is_active', true)
      .single()

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const { data: permission } = await supabase
      .from('user_permissions')
      .select('can_view_reports, can_upload_documents')
      .eq('user_id', session.user.id)
      .eq('organisation_id', property.organisation_id)
      .eq('is_active', true)
      .single()

    if (!permission || (!permission.can_view_reports && !permission.can_upload_documents)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create drainage reports' }, 
        { status: 403 }
      )
    }

    // Create drainage report
    const { data: report, error } = await supabase
      .from('drainage_reports')
      .insert([{
        property_id,
        inspection_type,
        inspector_name,
        inspection_date,
        next_inspection_due,
        drainage_condition,
        blockages_found: blockages_found || false,
        blockage_location,
        damage_found: damage_found || false,
        damage_description,
        cleaning_performed: cleaning_performed || false,
        repairs_required: repairs_required || false,
        repair_description,
        repair_priority,
        risk_rating,
        recommendations,
        photos_taken: photos_taken || false
      }])
      .select(`
        *,
        property:properties(name, address)
      `)
      .single()

    if (error) {
      console.error('Error creating drainage report:', error)
      return NextResponse.json({ error: 'Failed to create drainage report' }, { status: 500 })
    }

    return NextResponse.json({ report }, { status: 201 })
  } catch (error) {
    console.error('Create drainage report API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 