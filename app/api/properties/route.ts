// =====================================================
// UPDATED PROPERTIES API - app/api/properties/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Properties API: Starting...')
    const supabase = await createServerSupabaseClient()
    
    // Use getSession() since getUser() returns undefined
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (!session?.user || sessionError) {
      console.log('❌ No session found:', sessionError)
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    console.log('✅ Session user ID:', session.user.id)

    const { searchParams } = new URL(request.url)
    const organisationId = searchParams.get('organisation_id')
    console.log('🔍 Requested organisation_id:', organisationId)

    // Get user's accessible organisations
    const { data: userPermissions, error: permError } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', session.user.id)  // Use session.user.id
      .eq('is_active', true)

    console.log('🔍 User permissions:', userPermissions, 'Error:', permError)

    if (permError) {
      console.error('Error fetching user permissions:', permError)
      return NextResponse.json({ properties: [] })
    }

    if (!userPermissions || userPermissions.length === 0) {
      console.log('❌ No permissions found for user:', session.user.id)
      return NextResponse.json({ properties: [] })
    }

    const orgIds = userPermissions.map(perm => perm.organisation_id)
    console.log('🔍 Organisation IDs:', orgIds)

    // Add this debug query right before your main properties query
    const { data: debugProps, error: debugError } = await supabase
      .from('properties')
      .select('id, name, organisation_id, is_active')

    console.log('🔍 ALL properties (no filters):', {
      count: debugProps?.length,
      error: debugError,
      properties: debugProps
    })

    // Check specific organisation
    const { data: orgProps, error: orgError } = await supabase
      .from('properties')
      .select('id, name, organisation_id, is_active')
      .eq('organisation_id', 'ad4f135d-f141-4738-9471-55fe6a39d9ab')

    console.log('🔍 Properties for specific org:', {
      count: orgProps?.length,
      error: orgError,
      properties: orgProps
    })

    // Check is_active values
    const { data: activeProps, error: activeError } = await supabase
      .from('properties')
      .select('id, name, is_active')
      .eq('organisation_id', 'ad4f135d-f141-4738-9471-55fe6a39d9ab')

    console.log('🔍 Properties with is_active check:', {
      count: activeProps?.length,
      error: activeError,
      properties: activeProps
    })

    // Query properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        id,
        name,
        address,
        organisation_id,
        property_type,
        floor_area_sqm,
        risk_score,
        safety_score,
        is_active
      `)
      .in('organisation_id', orgIds)
      .eq('is_active', true)
      .order('name')

    console.log('🔍 Properties result:', { count: properties?.length, error })

    if (error) {
      console.error('Error fetching properties:', error)
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }

    return NextResponse.json({ properties: properties || [] })
  } catch (error) {
    console.error('Properties API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      address,
      organisation_id,
      property_type,
      floor_area_sqm,
      number_of_floors,
      building_age_years,
      lease_type,
      lease_expiry_date,
      council_tax_band,
      business_rates_reference,
      is_listed_building,
      conservation_area
    } = body

    if (!name || !address || !organisation_id) {
      return NextResponse.json(
        { error: 'Name, address, and organisation are required' }, 
        { status: 400 }
      )
    }

    // Check if user has permission to manage properties for this organisation
    const { data: permission } = await supabase
      .from('user_permissions')
      .select('can_manage_properties, role')
      .eq('user_id', user.id)
      .eq('organisation_id', organisation_id)
      .eq('is_active', true)
      .single()

    if (!permission) {
      return NextResponse.json(
        { error: 'No access to this organisation' }, 
        { status: 403 }
      )
    }

    if (!permission.can_manage_properties && !['director', 'manager'].includes(permission.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to manage properties' }, 
        { status: 403 }
      )
    }

    const { data: property, error } = await supabase
      .from('properties')
      .insert([{
        name,
        address,
        organisation_id,
        property_manager_id: user.id,
        property_type,
        floor_area_sqm,
        number_of_floors,
        building_age_years,
        lease_type,
        lease_expiry_date,
        council_tax_band,
        business_rates_reference,
        is_listed_building: is_listed_building || false,
        conservation_area: conservation_area || false,
        is_active: true
      }])
      .select(`
        *,
        organisations!properties_organisation_id_fkey(name, type)
      `)
      .single()

    if (error) {
      console.error('Error creating property:', error)
      return NextResponse.json({ 
        error: 'Failed to create property',
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error('Create property API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
