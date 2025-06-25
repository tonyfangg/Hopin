// =====================================================
// DOCUMENT UPLOAD FORM COMPONENT
// File: components/forms/document-upload-form.tsx
// Enhanced with British business categories
// =====================================================

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DOCUMENT_OPTIONS } from '@/app/lib/constants'
import { STORAGE_CONFIG } from '@/app/lib/storage-utils'

interface DocumentUploadFormProps {
  organisationId: string
  propertyId?: string
  onSuccess?: (document: any) => void
  onCancel?: () => void
}

interface Organisation {
  id: string
  name: string
  type: string
}

interface Property {
  id: string
  name: string
  address: string
  organisation_id: string
}

export function DocumentUploadForm({ 
  organisationId, 
  propertyId, 
  onSuccess, 
  onCancel 
}: DocumentUploadFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    category: '',
    description: ''
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingOrganisations, setLoadingOrganisations] = useState(true)
  const [loadingProperties, setLoadingProperties] = useState(false)
  const [error, setError] = useState('')

  // Get appropriate categories based on context
  const getCategories = () => {
    if (propertyId) {
      return DOCUMENT_OPTIONS.PROPERTY_CATEGORIES
    } else {
      return DOCUMENT_OPTIONS.ORGANISATION_CATEGORIES
    }
  }

  // Fetch organisations on component mount
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const response = await fetch('/api/organisations')
        const data = await response.json()
        
        if (data.error) {
          console.error('Failed to fetch organisations:', data.error)
          return
        }
        
        setOrganisations(data.organisations || [])
      } catch (error) {
        console.error('Error fetching organisations:', error)
      } finally {
        setLoadingOrganisations(false)
      }
    }

    fetchOrganisations()
  }, [])

  // Fetch properties when organisation changes
  const fetchProperties = async (orgId: string) => {
    setLoadingProperties(true)
    try {
      const response = await fetch(`/api/properties?organisation_id=${orgId}`)
      const data = await response.json()
      
      if (data.error) {
        console.error('Failed to fetch properties:', data.error)
        return
      }
      
      setProperties(data.properties || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoadingProperties(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
      setError(`File size must be less than ${STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`)
      return
    }

    // Validate file type
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!STORAGE_CONFIG.ALLOWED_EXTENSIONS.includes(extension as any)) {
      setError(`File type not allowed. Allowed types: ${STORAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`)
      return
    }

    setSelectedFile(file)
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!selectedFile || !formData.category) {
      setError('Please select a file and category')
      return
    }

    setLoading(true)
    setError('')

    try {
      const uploadData = new FormData()
      uploadData.append('file', selectedFile)
      uploadData.append('organisation_id', organisationId)
      uploadData.append('category', formData.category)
      
      if (propertyId) {
        uploadData.append('property_id', propertyId)
      }
      
      if (formData.description) {
        uploadData.append('description', formData.description)
      }

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: uploadData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document')
      }

      // Success
      onSuccess?.(data)
      
      // Reset form
      setFormData({ category: '', description: '' })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Show success message
      alert('Document uploaded successfully!')

    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload document')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const categories = getCategories()

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Upload Document</h2>
        <p className="text-slate-600 mt-2">
          {propertyId ? 'Upload property-specific document' : 'Upload organisation document'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Selection */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-slate-700 mb-2">
            Select File *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            accept={STORAGE_CONFIG.ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
          {selectedFile && (
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700">
                <strong>Selected:</strong> {selectedFile.name}
              </p>
              <p className="text-sm text-slate-600">
                Size: {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Allowed types: {STORAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')} (Max: {STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB)
          </p>
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
            Document Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Select a category...</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            {propertyId ? 'Property-specific document categories' : 'Organisation-level document categories'}
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Add a description for this document..."
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || !selectedFile || !formData.category}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 