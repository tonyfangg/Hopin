-- =====================================================
-- SUPABASE STORAGE SETUP - DOCUMENTS BUCKET
-- Run these commands in Supabase Dashboard → SQL Editor
-- Updated for new document structure: {org-id}/organisation/{category}/{filename}
-- =====================================================

-- Create the documents storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true, -- Public bucket (files can be accessed via public URLs)
  52428800, -- 50MB file size limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed',
    'application/json',
    'application/xml'
  ]
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Updated for new path structure: {org-id}/organisation/{category}/{filename}
-- =====================================================

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view documents for organisations they have access to
-- Updated path structure: {org-id}/organisation/{category}/{filename}
CREATE POLICY "Users can view documents for their organisations" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND (
      -- Check if user has access to the organisation based on file path
      EXISTS (
        SELECT 1 FROM user_permissions up
        WHERE up.user_id = auth.uid()
        AND up.is_active = true
        AND up.organisation_id::text = (
          -- Extract organisation ID from file path: {org-id}/...
          (string_to_array(name, '/'))[1]
        )
      )
    )
  );

-- Policy 2: Users can upload documents to organisations they have upload permissions for
-- Updated path structure: {org-id}/organisation/{category}/{filename}
CREATE POLICY "Users can upload documents to authorised organisations" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND (
      -- Check if user has upload permissions for the organisation
      EXISTS (
        SELECT 1 FROM user_permissions up
        WHERE up.user_id = auth.uid()
        AND up.is_active = true
        AND up.can_upload_documents = true
        AND up.organisation_id::text = (
          -- Extract organisation ID from file path: {org-id}/...
          (string_to_array(name, '/'))[1]
        )
      )
    )
  );

-- Policy 3: Users can update documents they have permission to manage
-- Updated path structure: {org-id}/organisation/{category}/{filename}
CREATE POLICY "Users can update documents they have permission for" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND (
      -- Check if user has upload permissions for the organisation
      EXISTS (
        SELECT 1 FROM user_permissions up
        WHERE up.user_id = auth.uid()
        AND up.is_active = true
        AND up.can_upload_documents = true
        AND up.organisation_id::text = (
          -- Extract organisation ID from file path: {org-id}/...
          (string_to_array(name, '/'))[1]
        )
      )
    )
  );

-- Policy 4: Users can delete documents they have permission to manage
-- Updated path structure: {org-id}/organisation/{category}/{filename}
CREATE POLICY "Users can delete documents they have permission for" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND (
      -- Check if user has upload permissions for the organisation
      EXISTS (
        SELECT 1 FROM user_permissions up
        WHERE up.user_id = auth.uid()
        AND up.is_active = true
        AND up.can_upload_documents = true
        AND up.organisation_id::text = (
          -- Extract organisation ID from file path: {org-id}/...
          (string_to_array(name, '/'))[1]
        )
      )
    )
  );

-- =====================================================
-- OPTIONAL: ADDITIONAL POLICIES FOR ADMIN USERS
-- =====================================================

-- Policy 5: Admin users can view all documents (optional)
CREATE POLICY "Admin users can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND (
      -- Check if user has admin access level
      EXISTS (
        SELECT 1 FROM user_permissions up
        WHERE up.user_id = auth.uid()
        AND up.is_active = true
        AND up.access_level = 'admin'
      )
    )
  );

-- Policy 6: Admin users can manage all documents (optional)
CREATE POLICY "Admin users can manage all documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documents' AND (
      -- Check if user has admin access level
      EXISTS (
        SELECT 1 FROM user_permissions up
        WHERE up.user_id = auth.uid()
        AND up.is_active = true
        AND up.access_level = 'admin'
      )
    )
  );

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if bucket was created successfully
SELECT * FROM storage.buckets WHERE id = 'documents';

-- Check if RLS policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- NOTES
-- =====================================================

/*
IMPORTANT NOTES:

1. Updated File Path Structure:
   - NEW: {organisation_id}/organisation/{category}/{filename}
   - NEW: {organisation_id}/properties/{property_id}/{category}/{filename}
   - OLD: organisations/{organisation_id}/general/{category}/{filename}
   - OLD: organisations/{organisation_id}/properties/{property_id}/{category}/{filename}

2. RLS Policies Updated:
   - Changed from (string_to_array(name, '/'))[2] to (string_to_array(name, '/'))[1]
   - This extracts organisation_id from the first part of the path instead of second
   - Aligns with new structure without "organisations" prefix

3. Security Features:
   - Files are only accessible to users with proper permissions
   - Upload restrictions based on user permissions
   - Organisation-based isolation
   - File type restrictions
   - File size limits

4. To Test:
   - Try uploading a file through your API
   - Verify only authorised users can access files
   - Check that file paths follow the expected structure
   - Test both organisation and property document uploads

5. Migration Notes:
   - If you have existing files with old structure, you'll need to migrate them
   - Update any existing file references in your application
   - Test thoroughly after applying these changes

6. Troubleshooting:
   - If policies don't work, check that user_permissions table exists
   - Verify that auth.uid() returns the correct user ID
   - Ensure file paths follow the new expected structure
   - Check that organisation_id in user_permissions matches the path structure
*/ 