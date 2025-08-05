// =====================================================
// API CLIENT HELPER - BRITISH ENGLISH
// File: app/lib/api-client.ts
// =====================================================

import { Organisation, Property, ElectricalReport, DrainageReport, Document, RiskAssessment } from './types'

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl = '/api'

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'An error occurred' }
      }

      return { data }
    } catch (error) {
      console.error('API request failed:', error)
      return { error: 'Network error occurred' }
    }
  }

  // =====================================================
  // ORGANISATIONS API
  // =====================================================

  async getOrganisations(): Promise<ApiResponse<{ organisations: Organisation[] }>> {
    return this.request('/organisations')
  }

  async createOrganisation(organisation: Partial<Organisation>): Promise<ApiResponse<{ organisation: Organisation }>> {
    return this.request('/organisations', {
      method: 'POST',
      body: JSON.stringify(organisation),
    })
  }

  async updateOrganisation(id: string, organisation: Partial<Organisation>): Promise<ApiResponse<{ organisation: Organisation }>> {
    return this.request(`/organisations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(organisation),
    })
  }

  // =====================================================
  // PROPERTIES API
  // =====================================================

  async getProperties(organisationId?: string): Promise<ApiResponse<{ properties: Property[] }>> {
    const params = organisationId ? `?organisation_id=${organisationId}` : ''
    return this.request(`/properties${params}`)
  }

  async getProperty(id: string): Promise<ApiResponse<{ property: Property }>> {
    return this.request(`/properties/${id}`)
  }

  async createProperty(property: Partial<Property>): Promise<ApiResponse<{ property: Property }>> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    })
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<ApiResponse<{ property: Property }>> {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    })
  }

  async deleteProperty(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    })
  }

  // =====================================================
  // ELECTRICAL REPORTS API
  // =====================================================

  async getElectricalReports(params?: {
    property_id?: string
    inspection_type?: string
  }): Promise<ApiResponse<{ reports: ElectricalReport[] }>> {
    const searchParams = new URLSearchParams()
    if (params?.property_id) searchParams.set('property_id', params.property_id)
    if (params?.inspection_type) searchParams.set('inspection_type', params.inspection_type)
    
    const queryString = searchParams.toString()
    return this.request(`/electrical-reports${queryString ? `?${queryString}` : ''}`)
  }

  async createElectricalReport(report: Partial<ElectricalReport>): Promise<ApiResponse<{ report: ElectricalReport }>> {
    return this.request('/electrical-reports', {
      method: 'POST',
      body: JSON.stringify(report),
    })
  }

  async updateElectricalReport(id: string, report: Partial<ElectricalReport>): Promise<ApiResponse<{ report: ElectricalReport }>> {
    return this.request(`/electrical-reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(report),
    })
  }

  // =====================================================
  // DRAINAGE REPORTS API
  // =====================================================

  async getDrainageReports(params?: {
    property_id?: string
    inspection_type?: string
  }): Promise<ApiResponse<{ reports: DrainageReport[] }>> {
    const searchParams = new URLSearchParams()
    if (params?.property_id) searchParams.set('property_id', params.property_id)
    if (params?.inspection_type) searchParams.set('inspection_type', params.inspection_type)
    
    const queryString = searchParams.toString()
    return this.request(`/drainage-reports${queryString ? `?${queryString}` : ''}`)
  }

  async createDrainageReport(report: Partial<DrainageReport>): Promise<ApiResponse<{ report: DrainageReport }>> {
    return this.request('/drainage-reports', {
      method: 'POST',
      body: JSON.stringify(report),
    })
  }

  async updateDrainageReport(id: string, report: Partial<DrainageReport>): Promise<ApiResponse<{ report: DrainageReport }>> {
    return this.request(`/drainage-reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(report),
    })
  }

  // =====================================================
  // DOCUMENTS API
  // =====================================================

  async getDocuments(params?: {
    property_id?: string
    organisation_id?: string
    category?: string
    expiring_in_days?: number
  }): Promise<ApiResponse<{ documents: Document[] }>> {
    const searchParams = new URLSearchParams()
    if (params?.property_id) searchParams.set('property_id', params.property_id)
    if (params?.organisation_id) searchParams.set('organisation_id', params.organisation_id)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.expiring_in_days) searchParams.set('expiring_in_days', params.expiring_in_days.toString())
    
    const queryString = searchParams.toString()
    return this.request(`/documents${queryString ? `?${queryString}` : ''}`)
  }

  async createDocument(document: Partial<Document>): Promise<ApiResponse<{ document: Document }>> {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(document),
    })
  }

  async uploadFile(
    file: File,
    organisationId: string,
    category: string,
    propertyId?: string
  ): Promise<ApiResponse<{
    file_path: string
    file_name: string
    file_size_bytes: number
    mime_type: string
    public_url: string
  }>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('organisation_id', organisationId)
    formData.append('category', category)
    if (propertyId) formData.append('property_id', propertyId)

    try {
      const response = await fetch(`${this.baseUrl}/documents/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Upload failed' }
      }

      return { data }
    } catch (error) {
      console.error('File upload failed:', error)
      return { error: 'Upload failed' }
    }
  }

  // =====================================================
  // RISK ASSESSMENTS API
  // =====================================================

  async getRiskAssessments(params?: {
    property_id?: string
    assessment_type?: string
  }): Promise<ApiResponse<{ assessments: RiskAssessment[] }>> {
    const searchParams = new URLSearchParams()
    if (params?.property_id) searchParams.set('property_id', params.property_id)
    if (params?.assessment_type) searchParams.set('assessment_type', params.assessment_type)
    
    const queryString = searchParams.toString()
    return this.request(`/risk-assessments${queryString ? `?${queryString}` : ''}`)
  }

  async createRiskAssessment(assessment: Partial<RiskAssessment>): Promise<ApiResponse<{ assessment: RiskAssessment }>> {
    return this.request('/risk-assessments', {
      method: 'POST',
      body: JSON.stringify(assessment),
    })
  }

  async updateRiskAssessment(id: string, assessment: Partial<RiskAssessment>): Promise<ApiResponse<{ assessment: RiskAssessment }>> {
    return this.request(`/risk-assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assessment),
    })
  }

  // =====================================================
  // DASHBOARD STATISTICS API
  // =====================================================

  async getDashboardStats(): Promise<ApiResponse<{
    organisations: number
    properties: number
    electrical_reports: number
    drainage_reports: number
    risk_assessments: number
    documents: number
    expiring_documents: number
    overdue_inspections: number
  }>> {
    return this.request('/dashboard/stats')
  }
}

// Export singleton instance
export const apiClient = new ApiClient() 