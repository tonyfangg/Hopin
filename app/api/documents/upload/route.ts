// =====================================================
// FILE UPLOAD API ENDPOINT
// File: app/api/documents/upload/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const organisationId = formData.get('organisation_id') as string
    const propertyId = formData.get('property_id') as string | null
    const category = formData.get('category') as string

    if (!file || !organisationId || !category) {
      return NextResponse.json(
        { error: 'File, organisation ID, and category are required' }, 
        { status: 400 }
      )
    }

    // Check user has permission to upload documents
    const { data: permission } = await supabase
      .from('user_permissions')
      .select('can_upload_documents')
      .eq('user_id', session.user.id)
      .eq('organisation_id', organisationId)
      .eq('is_active', true)
      .single()

    if (!permission || !permission.can_upload_documents) {
      return NextResponse.json(
        { error: 'Insufficient permissions to upload documents' }, 
        { status: 403 }
      )
    }

    // Generate unique file name
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`
    
    // Create storage path using British naming convention
    const storagePath = propertyId 
      ? `organisations/${organisationId}/properties/${propertyId}/${category}/${uniqueFileName}`
      : `organisations/${organisationId}/general/${category}/${uniqueFileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(storagePath)

    return NextResponse.json({
      file_path: storagePath,
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      public_url: publicUrl
    }, { status: 201 })

  } catch (error) {
    console.error('File upload API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 