// =====================================================
// UPDATED PROPERTIES API - app/api/properties/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Properties API: Starting...')
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('🔍 User exists:', !!user)
    console.log('🔍 User ID:', user?.id)
    console.log('🔍 User error:', userError)
    
    if (!user || userError) {
      console.log('❌ No user found or user error')
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organisationId = searchParams.get('organisation_id')
    console.log('🔍 Requested organisation_id:', organisationId)

    // Get user's accessible organisations
    const { data: userPermissions, error: permError } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', user.id)
      .eq('is_active', true)

    console.log('🔍 User permissions query result:', userPermissions)
    console.log('🔍 Permission error:', permError)

    if (permError) {
      console.error('❌ Error fetching user permissions:', permError)
      return NextResponse.json({ properties: [] })
    }

    if (!userPermissions || userPermissions.length === 0) {
      console.log('❌ No user permissions found')
      return NextResponse.json({ properties: [] })
    }

    const orgIds = userPermissions.map(perm => perm.organisation_id)
    console.log('🔍 Organisation IDs from permissions:', orgIds)

    // Build query for properties with safe column selection
    let query = supabase
      .from('properties')
      .select(`
        id,
        name,
        address,
        organisation_id,
        property_manager_id,
        property_type,
        floor_area_sqm,
        number_of_floors,
        building_age_years,
        lease_type,
        lease_expiry_date,
        council_tax_band,
        business_rates_reference,
        is_listed_building,
        conservation_area,
        created_at,
        updated_at,
        organisations!properties_organisation_id_fkey(name, type)
      `)
      .in('organisation_id', orgIds)
      .eq('is_active', true)

    // Filter by specific organisation if requested
    if (organisationId && orgIds.includes(organisationId)) {
      query = query.eq('organisation_id', organisationId)
      console.log('🔍 Filtering by organisation_id:', organisationId)
    }

    const { data: properties, error } = await query.order('name')
    
    console.log('🔍 Properties query result:', properties)
    console.log('🔍 Properties error:', error)
    console.log('🔍 Properties count:', properties?.length || 0)

    if (error) {
      console.error('❌ Error fetching properties:', error)
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }

    console.log('✅ Properties API: Success')
    return NextResponse.json({ properties: properties || [] })
  } catch (error) {
    console.error('❌ Properties API error:', error)
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
