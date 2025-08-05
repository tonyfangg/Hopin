'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api-client'
import { Organisation, Property, ElectricalReport, DrainageReport, Document, RiskAssessment } from '../types'
import { handleApiError, ApiError } from '@/app/lib/utils/error-handling'

// =====================================================
// REACT HOOKS FOR API CALLS
// File: app/lib/hooks/use-api.ts
// =====================================================

interface UseApiOptions {
  immediate?: boolean
  retry?: number
  retryDelay?: number
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
  reset: () => void
}

export function useApi<T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiState<T> {
  const { immediate = true, retry = 1, retryDelay = 1000 } = options
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchData = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success === false) {
        throw new Error(result.error || 'API request failed')
      }

      setData(result.data || result)
    } catch (err) {
      const apiError = handleApiError(err)
      
      if (retryCount < retry) {
        setTimeout(() => {
          fetchData(retryCount + 1)
        }, retryDelay * (retryCount + 1))
        return
      }
      
      setError(apiError)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [url, retry, retryDelay])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [fetchData, immediate])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    reset
  }
}

export function useOrganisations() {
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganisations = useCallback(async () => {
    setLoading(true)
    const response = await apiClient.getOrganisations()
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setOrganisations(response.data.organisations)
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrganisations()
  }, [fetchOrganisations])

  return { organisations, loading, error, refetch: fetchOrganisations }
}

export function useProperties(organisationId?: string) {
  const url = organisationId 
    ? `/api/properties?organisation_id=${organisationId}` 
    : '/api/properties'
  
  return useApi(url, { retry: 2 })
}

export function useElectricalReports(propertyId?: string) {
  const url = propertyId 
    ? `/api/electrical-reports?property_id=${propertyId}` 
    : '/api/electrical-reports'
  
  return useApi(url, { retry: 2 })
}

export function useDrainageReports(propertyId?: string) {
  const url = propertyId 
    ? `/api/drainage-reports?property_id=${propertyId}` 
    : '/api/drainage-reports'
  
  return useApi(url, { retry: 2 })
}

export function useDocuments(params?: {
  property_id?: string
  organisation_id?: string
  category?: string
  expiring_in_days?: number
}) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    const response = await apiClient.getDocuments(params)
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setDocuments(response.data.documents)
    }
    
    setLoading(false)
  }, [params?.property_id, params?.organisation_id, params?.category, params?.expiring_in_days])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return { documents, loading, error, refetch: fetchDocuments }
}

export function useRiskAssessments(propertyId?: string) {
  const url = propertyId 
    ? `/api/risk-assessments?property_id=${propertyId}` 
    : '/api/risk-assessments'
  
  return useApi(url, { retry: 2 })
}

export function useDashboardStats() {
  const [stats, setStats] = useState<{
    organisations: number
    properties: number
    electrical_reports: number
    drainage_reports: number
    risk_assessments: number
    documents: number
    expiring_documents: number
    overdue_inspections: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    const response = await apiClient.getDashboardStats()
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setStats(response.data)
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
} 