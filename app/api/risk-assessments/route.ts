// =====================================================
// RISK ASSESSMENTS API ENDPOINTS
// File: app/api/risk-assessments/route.ts
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
    const assessmentType = searchParams.get('assessment_type')

    // First get user's authorised organisations
    const { data: userPermissions } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    const authorisedOrganisationIds = userPermissions?.map(p => p.organisation_id) || []

    if (authorisedOrganisationIds.length === 0) {
      return NextResponse.json({ assessments: [] })
    }

    // Get accessible property IDs
    const { data: accessibleProperties } = await supabase
      .from('properties')
      .select('id')
      .in('organisation_id', authorisedOrganisationIds)
      .eq('is_active', true)

    const accessiblePropertyIds = accessibleProperties?.map(p => p.id) || []

    if (accessiblePropertyIds.length === 0) {
      return NextResponse.json({ assessments: [] })
    }

    // Build query
    let query = supabase
      .from('risk_assessments')
      .select(`
        *,
        property:properties(name, address, organisation_id)
      `)
      .in('property_id', accessiblePropertyIds)

    // Filter by property if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    // Filter by assessment type if specified
    if (assessmentType) {
      query = query.eq('assessment_type', assessmentType)
    }

    const { data: assessments, error } = await query
      .order('assessment_date', { ascending: false })

    if (error) {
      console.error('Error fetching risk assessments:', error)
      return NextResponse.json({ error: 'Failed to fetch risk assessments' }, { status: 500 })
    }

    return NextResponse.json({ assessments })
  } catch (error) {
    console.error('Risk assessments API error:', error)
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
      assessment_type,
      assessor_name,
      assessor_qualification,
      assessment_date,
      review_date,
      overall_risk_level,
      risk_factors,
      control_measures,
      recommendations,
      action_plan,
      insurance_implications,
      compliance_status
    } = body

    // Validate required fields
    if (!property_id || !assessment_type || !assessor_name || !assessment_date) {
      return NextResponse.json(
        { error: 'Property, assessment type, assessor name, and assessment date are required' }, 
        { status: 400 }
      )
    }

    // Check user has permission to manage risk assessments
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
      .select('can_manage_risk_assessments')
      .eq('user_id', session.user.id)
      .eq('organisation_id', property.organisation_id)
      .eq('is_active', true)
      .single()

    if (!permission || !permission.can_manage_risk_assessments) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create risk assessments' }, 
        { status: 403 }
      )
    }

    // Create risk assessment
    const { data: assessment, error } = await supabase
      .from('risk_assessments')
      .insert([{
        property_id,
        assessment_type,
        assessor_name,
        assessor_qualification,
        assessment_date,
        review_date,
        overall_risk_level,
        risk_factors,
        control_measures,
        recommendations,
        action_plan,
        insurance_implications,
        compliance_status
      }])
      .select(`
        *,
        property:properties(name, address)
      `)
      .single()

    if (error) {
      console.error('Error creating risk assessment:', error)
      return NextResponse.json({ error: 'Failed to create risk assessment' }, { status: 500 })
    }

    return NextResponse.json({ assessment }, { status: 201 })
  } catch (error) {
    console.error('Create risk assessment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 