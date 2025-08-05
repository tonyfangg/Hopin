'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface Property {
  id: string
  name: string
  address: string
}

interface DocumentData {
  property_id: string
  document_type: string
  document_name: string
  description: string
  issue_date: string
  expiry_date: string
  file: File | null
}

const documentTypes = [
  'EICR Certificate',
  'PAT Testing Certificate',
  'Fire Safety Certificate',
  'Gas Safety Certificate',
  'Drainage Survey Report',
  'Building Insurance Policy',
  'Employers Liability Insurance',
  'Public Liability Insurance',
  'Health & Safety Policy',
  'Risk Assessment',
  'Maintenance Contract',
  'Other Certificate'
]

export default function DocumentUploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const [formData, setFormData] = useState<DocumentData>({
    property_id: '',
    document_type: 'EICR Certificate',
    document_name: '',
    description: '',
    issue_date: '',
    expiry_date: '',
    file: null
  })

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        if (response.ok) {
          const data = await response.json()
          setProperties(data.properties || [])
        } else {
          console.error('Failed to fetch properties')
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoadingProperties(false)
      }
    }

    fetchProperties()
  }, [])

  const handleInputChange = (field: keyof DocumentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      file,
      document_name: file ? file.name : ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setUploadProgress(0)

    try {
      if (!formData.file) {
        throw new Error('Please select a file to upload')
      }

      // Create FormData for file upload
      const uploadFormData = new FormData()
      uploadFormData.append('file', formData.file)
      uploadFormData.append('property_id', formData.property_id)
      uploadFormData.append('document_type', formData.document_type)
      uploadFormData.append('document_name', formData.document_name)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('issue_date', formData.issue_date)
      uploadFormData.append('expiry_date', formData.expiry_date)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        setTimeout(() => {
          router.push('/dashboard/documents?success=document-uploaded')
        }, 500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to upload document')
        setUploadProgress(0)
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while uploading the document')
      setUploadProgress(0)
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/documents')
  }

  const getDocumentTypeDescription = (type: string) => {
    const descriptions: { [key: string]: string } = {
      'EICR Certificate': 'Electrical Installation Condition Report - Required every 5 years',
      'PAT Testing Certificate': 'Portable Appliance Testing - Usually required annually',
      'Fire Safety Certificate': 'Fire alarm and emergency lighting testing certificates',
      'Gas Safety Certificate': 'Annual gas safety inspection certificate',
      'Drainage Survey Report': 'CCTV drainage survey or inspection report',
      'Building Insurance Policy': 'Current building and contents insurance policy',
      'Employers Liability Insurance': 'Required if you have employees - minimum £5M coverage',
      'Public Liability Insurance': 'Protects against customer injury claims',
      'Health & Safety Policy': 'Company health and safety documentation',
      'Risk Assessment': 'Property-specific risk assessment documents',
      'Maintenance Contract': 'Service agreements for equipment or systems',
      'Other Certificate': 'Any other compliance or certification document'
    }
    return descriptions[type] || 'Compliance document'
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Upload Document</h1>
          <p className="text-sm sm:text-base text-slate-600">Add compliance certificates and important documents to your property records</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-h-[44px] touch-manipulation"
          >
            Cancel
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="space-y-6">
          {/* Property and Document Type */}
          <div className="space-y-4">
            <div>
              <label htmlFor="property_id" className="block text-sm font-medium text-slate-700 mb-2">
                Property *
              </label>
              {loadingProperties ? (
                <div className="animate-pulse bg-slate-200 h-12 rounded-lg"></div>
              ) : (
                <select
                  id="property_id"
                  value={formData.property_id}
                  onChange={(e) => handleInputChange('property_id', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label htmlFor="document_type" className="block text-sm font-medium text-slate-700 mb-2">
                Document Type *
              </label>
              <select
                id="document_type"
                value={formData.document_type}
                onChange={(e) => handleInputChange('document_type', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-slate-600">
                {getDocumentTypeDescription(formData.document_type)}
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-slate-700 mb-2">
                Document File *
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  required
                />
                <label
                  htmlFor="file"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {formData.file ? (
                    <div>
                      <span className="text-sm font-medium text-slate-900">{formData.file.name}</span>
                      <p className="text-xs text-slate-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm font-medium text-slate-900">Click to upload file</span>
                      <p className="text-xs text-slate-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Document Details */}
          <div className="space-y-4">
            <div>
              <label htmlFor="document_name" className="block text-sm font-medium text-slate-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                id="document_name"
                value={formData.document_name}
                onChange={(e) => handleInputChange('document_name', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descriptive name for the document"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about this document..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="issue_date" className="block text-sm font-medium text-slate-700 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  id="issue_date"
                  value={formData.issue_date}
                  onChange={(e) => handleInputChange('issue_date', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="expiry_date" className="block text-sm font-medium text-slate-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiry_date"
                  value={formData.expiry_date}
                  onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5">🔒</span>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Document Security</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All documents are stored securely and encrypted</li>
                  <li>• Only authorized users can access your documents</li>
                  <li>• Expiry dates will trigger automatic reminders</li>
                  <li>• Documents are included in compliance reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 min-h-[44px] touch-manipulation"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 min-h-[44px] touch-manipulation"
            disabled={loading || !formData.file}
          >
            {loading ? `Uploading... ${uploadProgress}%` : 'Upload Document'}
          </Button>
        </div>
      </form>
    </div>
  )
}