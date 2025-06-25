// =====================================================
// UPDATED ORGANISATIONS API - app/api/organisations/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // First, check if user_permissions table has data
    const { data: userPermissions, error: permError } = await supabase
      .from('user_permissions')
      .select('organisation_id, role')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    if (permError) {
      console.error('Error fetching user permissions:', permError)
      // If user_permissions doesn't exist or has issues, return empty for now
      return NextResponse.json({ organisations: [] })
    }

    if (!userPermissions || userPermissions.length === 0) {
      // User has no organisation permissions yet
      return NextResponse.json({ organisations: [] })
    }

    const orgIds = userPermissions.map(perm => perm.organisation_id)

    // Get organisations with basic info
    const { data: organisations, error } = await supabase
      .from('organisations')
      .select('*')
      .in('id', orgIds)
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching organisations:', error)
      return NextResponse.json({ error: 'Failed to fetch organisations' }, { status: 500 })
    }

    return NextResponse.json({ organisations: organisations || [] })
  } catch (error) {
    console.error('Organisations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      type,
      trading_name,
      company_number,
      vat_number,
      address_line_1,
      address_line_2,
      town_city,
      county,
      postcode,
      contact_email,
      contact_telephone,
      contact_mobile,
      website_url
    } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' }, 
        { status: 400 }
      )
    }

    const { data: organisation, error: orgError } = await supabase
      .from('organisations')
      .insert([{
        name,
        type,
        trading_name,
        company_number,
        vat_number,
        address_line_1,
        address_line_2,
        town_city,
        county,
        postcode,
        contact_email,
        contact_telephone,
        contact_mobile,
        website_url,
        is_active: true
      }])
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organisation:', orgError)
      return NextResponse.json({ error: 'Failed to create organisation' }, { status: 500 })
    }

    // Add user as director
    const { error: permissionError } = await supabase
      .from('user_permissions')
      .insert([{
        user_id: session.user.id,
        organisation_id: organisation.id,
        role: 'director',
        access_level: 'organisation_wide',
        can_manage_properties: true,
        can_manage_staff: true,
        can_view_reports: true,
        can_manage_risk_assessments: true,
        can_upload_documents: true,
        is_active: true
      }])

    if (permissionError) {
      console.error('Error creating user permissions:', permissionError)
    }

    return NextResponse.json({ organisation }, { status: 201 })
  } catch (error) {
    console.error('Create organisation API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 