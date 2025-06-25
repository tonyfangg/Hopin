// =====================================================
// INDIVIDUAL PROPERTY API ENDPOINTS
// File: app/api/properties/[id]/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // First get user's authorised organisations
    const { data: userPermissions } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    const authorisedOrganisationIds = userPermissions?.map(p => p.organisation_id) || []

    if (authorisedOrganisationIds.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        organisation:organisations(name, type, postcode),
        property_manager:auth.users(email),
        electrical_reports(*),
        drainage_reports(*),
        risk_assessments(*),
        documents(*)
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .in('organisation_id', authorisedOrganisationIds)
      .single()

    if (error) {
      console.error('Error fetching property:', error)
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Property detail API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    
    // Check user has permission to manage properties
    const { data: property } = await supabase
      .from('properties')
      .select('organisation_id')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const { data: permission } = await supabase
      .from('user_permissions')
      .select('can_manage_properties')
      .eq('user_id', session.user.id)
      .eq('organisation_id', property.organisation_id)
      .eq('is_active', true)
      .single()

    if (!permission || !permission.can_manage_properties) {
      return NextResponse.json(
        { error: 'Insufficient permissions to manage properties' }, 
        { status: 403 }
      )
    }

    // Update property
    const { data: updatedProperty, error } = await supabase
      .from('properties')
      .update(body)
      .eq('id', params.id)
      .select(`
        *,
        organisation:organisations(name, type)
      `)
      .single()

    if (error) {
      console.error('Error updating property:', error)
      return NextResponse.json({ error: 'Failed to update property' }, { status: 500 })
    }

    return NextResponse.json({ property: updatedProperty })
  } catch (error) {
    console.error('Update property API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // Check user has permission to manage properties
    const { data: property } = await supabase
      .from('properties')
      .select('organisation_id')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const { data: permission } = await supabase
      .from('user_permissions')
      .select('can_manage_properties')
      .eq('user_id', session.user.id)
      .eq('organisation_id', property.organisation_id)
      .eq('is_active', true)
      .single()

    if (!permission || !permission.can_manage_properties) {
      return NextResponse.json(
        { error: 'Insufficient permissions to manage properties' }, 
        { status: 403 }
      )
    }

    // Delete property (this will cascade to related records)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting property:', error)
      return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Delete property API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 