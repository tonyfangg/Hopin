// =====================================================
// DOCUMENT LIST COMPONENT
// File: components/dashboard/documents/document-list.tsx
// Shows documents with proper British business categories
// =====================================================

'use client'

import { useState, useEffect } from 'react'
import { ErrorState } from '@/components/ui/error-state'
import { DOCUMENT_OPTIONS } from '@/app/lib/constants'

interface Document {
  id: string
  file_name: string
  file_path: string
  file_size_bytes: number
  mime_type: string
  category: string
  description?: string
  public_url: string
  uploaded_at: string
  organisation_id: string
  property_id?: string
  organisation?: {
    name: string
    type: string
  }
  property?: {
    name: string
    address: string
  }
}

interface DocumentListProps {
  organisationId?: string
  propertyId?: string
  onDocumentSelect?: (document: Document) => void
}

export function DocumentList({ 
  organisationId, 
  propertyId, 
  onDocumentSelect 
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [organisationId, propertyId])

  const fetchDocuments = async () => {
    setLoading(true)
    setError('')

    try {
      let url = '/api/documents'
      const params = new URLSearchParams()
      
      if (organisationId) {
        params.append('organisation_id', organisationId)
      }
      
      if (propertyId) {
        params.append('property_id', propertyId)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      setError('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    const allCategories = [
      ...DOCUMENT_OPTIONS.ORGANISATION_CATEGORIES,
      ...DOCUMENT_OPTIONS.PROPERTY_CATEGORIES
    ]
    
    const found = allCategories.find(cat => cat.value === category)
    return found ? found.label : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electrical_certificates':
        return '⚡'
      case 'insurance_policies':
        return '📄'
      case 'compliance_documents':
        return '✅'
      case 'drainage_reports':
        return '💧'
      case 'safety_assessments':
        return '🛡️'
      default:
        return '📋'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('word')) return '📝'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📈'
    if (mimeType.includes('zip')) return '📦'
    return '📄'
  }

  const filteredDocuments = documents.filter(doc => 
    !filterCategory || doc.category === filterCategory
  )

  const getCategories = () => {
    if (propertyId) {
      return DOCUMENT_OPTIONS.PROPERTY_CATEGORIES
    } else {
      return DOCUMENT_OPTIONS.ORGANISATION_CATEGORIES
    }
  }

  const categories = getCategories()

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <ErrorState
          error={error}
          title="Error Loading Documents"
          description="Unable to load the document list. Please try again."
          onRetry={fetchDocuments}
          showRetryButton={true}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Documents</h2>
            <p className="text-slate-600 mt-1">
              {propertyId ? 'Property documents' : 'Organisation documents'}
            </p>
          </div>
          <div className="text-sm text-slate-500">
            {filteredDocuments.length} of {documents.length} documents
          </div>
        </div>

        {/* Filter */}
        <div className="mt-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document List */}
      <div className="divide-y divide-slate-200">
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Documents Found</h3>
            <p className="text-slate-600">
              {filterCategory 
                ? `No documents in the "${getCategoryLabel(filterCategory)}" category`
                : 'No documents uploaded yet'
              }
            </p>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onDocumentSelect?.(document)}
            >
              <div className="flex items-start gap-4">
                {/* File Icon */}
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{getFileIcon(document.mime_type)}</span>
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900 truncate">
                      {document.file_name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {getCategoryIcon(document.category)} {getCategoryLabel(document.category)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{formatFileSize(document.file_size_bytes)}</span>
                    <span>•</span>
                    <span>{formatDate(document.uploaded_at)}</span>
                    {document.organisation && (
                      <>
                        <span>•</span>
                        <span>{document.organisation.name}</span>
                      </>
                    )}
                    {document.property && (
                      <>
                        <span>•</span>
                        <span>{document.property.name}</span>
                      </>
                    )}
                  </div>

                  {document.description && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      {document.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={document.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-lg">🔗</span>
                  </a>
                  <button
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle download
                      window.open(document.public_url, '_blank')
                    }}
                  >
                    <span className="text-lg">⬇️</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 