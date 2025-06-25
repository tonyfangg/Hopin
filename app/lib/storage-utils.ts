// =====================================================
// STORAGE UTILITIES
// File: app/lib/storage-utils.ts
// =====================================================

import { DOCUMENT_OPTIONS } from './constants'

// =====================================================
// STORAGE PATH GENERATION
// =====================================================

/**
 * Generate storage path for document uploads
 * Aligns with expected structure:
 * documents/{organisation-id}/organisation/{category}/{filename}
 * documents/{organisation-id}/properties/{property-id}/{category}/{filename}
 */
export function generateStoragePath(
  organisationId: string,
  category: string,
  filename: string,
  propertyId?: string
): string {
  // Validate organisation ID
  if (!organisationId) {
    throw new Error('Organisation ID is required')
  }

  // Validate category
  if (!category) {
    throw new Error('Category is required')
  }

  // Validate filename
  if (!filename) {
    throw new Error('Filename is required')
  }

  // Check if category is valid for the context
  const isValidOrganisationCategory = DOCUMENT_OPTIONS.ORGANISATION_CATEGORIES.some(
    cat => cat.value === category
  )
  
  const isValidPropertyCategory = DOCUMENT_OPTIONS.PROPERTY_CATEGORIES.some(
    cat => cat.value === category
  )

  // Generate path based on context
  if (propertyId) {
    // Property-level document
    if (!isValidPropertyCategory) {
      throw new Error(`Invalid category '${category}' for property documents. Valid categories: ${DOCUMENT_OPTIONS.PROPERTY_CATEGORIES.map(c => c.value).join(', ')}`)
    }
    
    return `${organisationId}/properties/${propertyId}/${category}/${filename}`
  } else {
    // Organisation-level document
    if (!isValidOrganisationCategory) {
      throw new Error(`Invalid category '${category}' for organisation documents. Valid categories: ${DOCUMENT_OPTIONS.ORGANISATION_CATEGORIES.map(c => c.value).join(', ')}`)
    }
    
    return `${organisationId}/organisation/${category}/${filename}`
  }
}

// =====================================================
// STORAGE PATH VALIDATION
// =====================================================

/**
 * Validate if a storage path follows the expected structure
 */
export function validateStoragePath(path: string): {
  isValid: boolean
  organisationId?: string
  propertyId?: string
  category?: string
  filename?: string
  context?: 'organisation' | 'property'
  error?: string
} {
  try {
    const parts = path.split('/')
    
    // Check minimum parts
    if (parts.length < 4) {
      return {
        isValid: false,
        error: 'Invalid path structure: insufficient parts'
      }
    }

    const [organisationId, context, category, filename] = parts

    // Validate organisation ID
    if (!organisationId || organisationId === 'organisations') {
      return {
        isValid: false,
        error: 'Invalid organisation ID'
      }
    }

    // Validate context
    if (context !== 'organisation' && context !== 'properties') {
      return {
        isValid: false,
        error: 'Invalid context: must be "organisation" or "properties"'
      }
    }

    // Validate category based on context
    if (context === 'organisation') {
      const isValidCategory = DOCUMENT_OPTIONS.ORGANISATION_CATEGORIES.some(
        cat => cat.value === category
      )
      if (!isValidCategory) {
        return {
          isValid: false,
          error: `Invalid organisation category: ${category}`
        }
      }
    } else if (context === 'properties') {
      // For properties, we need property ID and category
      if (parts.length < 5) {
        return {
          isValid: false,
          error: 'Property path must include property ID'
        }
      }
      
      const propertyId = category
      const propertyCategory = parts[3]
      const propertyFilename = parts[4]
      
      const isValidCategory = DOCUMENT_OPTIONS.PROPERTY_CATEGORIES.some(
        cat => cat.value === propertyCategory
      )
      
      if (!isValidCategory) {
        return {
          isValid: false,
          error: `Invalid property category: ${propertyCategory}`
        }
      }
      
      return {
        isValid: true,
        organisationId,
        propertyId,
        category: propertyCategory,
        filename: propertyFilename,
        context: 'property'
      }
    }

    return {
      isValid: true,
      organisationId,
      category,
      filename,
      context: 'organisation'
    }

  } catch (error) {
    return {
      isValid: false,
      error: `Path validation error: ${error}`
    }
  }
}

// =====================================================
// STORAGE PATH PARSING
// =====================================================

/**
 * Parse storage path to extract components
 */
export function parseStoragePath(path: string): {
  organisationId: string
  propertyId?: string
  category: string
  filename: string
  context: 'organisation' | 'property'
} {
  const validation = validateStoragePath(path)
  
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid storage path')
  }

  return {
    organisationId: validation.organisationId!,
    propertyId: validation.propertyId,
    category: validation.category!,
    filename: validation.filename!,
    context: validation.context!
  }
}

// =====================================================
// STORAGE PATH UTILITIES
// =====================================================

/**
 * Get the directory path (without filename)
 */
export function getStorageDirectory(
  organisationId: string,
  category: string,
  propertyId?: string
): string {
  if (propertyId) {
    return `${organisationId}/properties/${propertyId}/${category}`
  } else {
    return `${organisationId}/organisation/${category}`
  }
}

/**
 * Generate a unique filename with timestamp and random string
 */
export function generateUniqueFilename(originalName: string): string {
  const extension = originalName.split('.').pop()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `${timestamp}-${random}.${extension}`
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if file type is allowed
 */
export function isAllowedFileType(filename: string, allowedTypes: readonly string[]): boolean {
  const extension = getFileExtension(filename)
  return allowedTypes.includes(extension)
}

// =====================================================
// STORAGE CONSTANTS
// =====================================================

export const STORAGE_CONFIG = {
  BUCKET_NAME: 'documents',
  MAX_FILE_SIZE: 52428800, // 50MB
  ALLOWED_MIME_TYPES: [
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
  ],
  ALLOWED_EXTENSIONS: [
    'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'txt', 'csv', 'zip', 'json', 'xml'
  ]
} as const 