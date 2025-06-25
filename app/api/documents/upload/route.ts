// =====================================================
// FILE UPLOAD API ENDPOINT
// File: app/api/documents/upload/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { generateStoragePath, generateUniqueFilename, STORAGE_CONFIG, isAllowedFileType } from '@/app/lib/storage-utils'
import { DOCUMENT_OPTIONS } from '@/app/lib/constants'

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

    // Validate required fields
    if (!file || !organisationId || !category) {
      return NextResponse.json(
        { error: 'File, organisation ID, and category are required' }, 
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size must be less than ${STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Validate file type
    if (!isAllowedFileType(file.name, STORAGE_CONFIG.ALLOWED_EXTENSIONS)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${STORAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}` },
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

    // Generate unique filename
    const uniqueFileName = generateUniqueFilename(file.name)
    
    // Generate storage path using new utilities
    let storagePath: string
    try {
      storagePath = generateStoragePath(organisationId, category, uniqueFileName, propertyId || undefined)
    } catch (error) {
      return NextResponse.json(
        { error: `Invalid storage path: ${error}` },
        { status: 400 }
      )
    }

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_CONFIG.BUCKET_NAME)
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
      .from(STORAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(storagePath)

    // Create document record in database
    const documentData = {
      organisation_id: organisationId,
      property_id: propertyId || null,
      file_path: storagePath,
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      category: category,
      uploaded_by: session.user.id,
      public_url: publicUrl
    }

    const { data: documentRecord, error: dbError } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single()

    if (dbError) {
      console.error('Error creating document record:', dbError)
      // Try to delete the uploaded file if database insert fails
      await supabase.storage
        .from(STORAGE_CONFIG.BUCKET_NAME)
        .remove([storagePath])
      
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 })
    }

    return NextResponse.json({
      id: documentRecord.id,
      file_path: storagePath,
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      category: category,
      public_url: publicUrl,
      uploaded_at: documentRecord.created_at
    }, { status: 201 })

  } catch (error) {
    console.error('File upload API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 