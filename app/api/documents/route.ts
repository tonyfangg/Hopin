// =====================================================
// DOCUMENTS API ENDPOINTS - BRITISH ENGLISH
// File: app/api/documents/route.ts
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
    const organisationId = searchParams.get('organisation_id')
    const category = searchParams.get('category')
    const expiringInDays = searchParams.get('expiring_in_days')

    // First get user's authorised organisations
    const { data: userPermissions } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', session.user.id)
      .eq('is_active', true)

    const authorisedOrganisationIds = userPermissions?.map(p => p.organisation_id) || []

    if (authorisedOrganisationIds.length === 0) {
      return NextResponse.json({ documents: [] })
    }

    // Build query
    let query = supabase
      .from('documents')
      .select(`
        *,
        property:properties(name, address),
        organisation:organisations(name),
        uploaded_by_user:auth.users!documents_uploaded_by_fkey(email),
        reviewed_by_user:auth.users!documents_reviewed_by_fkey(email)
      `)
      .eq('is_active', true)
      .in('organisation_id', authorisedOrganisationIds)

    // Filter by property if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    // Filter by organisation if specified
    if (organisationId) {
      query = query.eq('organisation_id', organisationId)
    }

    // Filter by category if specified
    if (category) {
      query = query.eq('category', category)
    }

    // Filter by expiring documents
    if (expiringInDays) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + parseInt(expiringInDays))
      query = query
        .not('expiry_date', 'is', null)
        .lte('expiry_date', futureDate.toISOString().split('T')[0])
    }

    const { data: documents, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Documents API error:', error)
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
      organisation_id,
      category,
      document_type,
      title,
      description,
      file_name,
      file_path,
      file_size_bytes,
      mime_type,
      is_confidential,
      expiry_date,
      tags
    } = body

    // Validate required fields
    if (!organisation_id || !category || !title || !file_name || !file_path) {
      return NextResponse.json(
        { error: 'Organisation, category, title, file name, and file path are required' }, 
        { status: 400 }
      )
    }

    // Check user has permission to upload documents
    const { data: permission } = await supabase
      .from('user_permissions')
      .select('can_upload_documents, access_level')
      .eq('user_id', session.user.id)
      .eq('organisation_id', organisation_id)
      .eq('is_active', true)
      .single()

    if (!permission || !permission.can_upload_documents) {
      return NextResponse.json(
        { error: 'Insufficient permissions to upload documents' }, 
        { status: 403 }
      )
    }

    // If property_id is specified, ensure user has access to that property
    if (property_id) {
      const { data: property } = await supabase
        .from('properties')
        .select('organisation_id')
        .eq('id', property_id)
        .eq('organisation_id', organisation_id)
        .eq('is_active', true)
        .single()

      if (!property) {
        return NextResponse.json({ error: 'Property not found or access denied' }, { status: 404 })
      }
    }

    // Create document record
    const { data: document, error } = await supabase
      .from('documents')
      .insert([{
        property_id,
        organisation_id,
        category,
        document_type,
        title,
        description,
        file_name,
        file_path,
        file_size_bytes,
        mime_type,
        is_confidential: is_confidential || false,
        expiry_date,
        uploaded_by: session.user.id,
        tags,
        version_number: 1,
        is_active: true
      }])
      .select(`
        *,
        property:properties(name, address),
        organisation:organisations(name),
        uploaded_by_user:auth.users!documents_uploaded_by_fkey(email)
      `)
      .single()

    if (error) {
      console.error('Error creating document:', error)
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
    }

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    console.error('Create document API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 