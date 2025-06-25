'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api-client'
import { Organisation, Property, ElectricalReport, DrainageReport, Document, RiskAssessment } from '../types'

// =====================================================
// REACT HOOKS FOR API CALLS
// File: app/lib/hooks/use-api.ts
// =====================================================

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
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    const response = await apiClient.getProperties(organisationId)
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setProperties(response.data.properties)
    }
    
    setLoading(false)
  }, [organisationId])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return { properties, loading, error, refetch: fetchProperties }
}

export function useElectricalReports(propertyId?: string) {
  const [reports, setReports] = useState<ElectricalReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    const response = await apiClient.getElectricalReports(
      propertyId ? { property_id: propertyId } : undefined
    )
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setReports(response.data.reports)
    }
    
    setLoading(false)
  }, [propertyId])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
}

export function useDrainageReports(propertyId?: string) {
  const [reports, setReports] = useState<DrainageReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    const response = await apiClient.getDrainageReports(
      propertyId ? { property_id: propertyId } : undefined
    )
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setReports(response.data.reports)
    }
    
    setLoading(false)
  }, [propertyId])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
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

export function useRiskAssessments(params?: {
  property_id?: string
  assessment_type?: string
}) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssessments = useCallback(async () => {
    setLoading(true)
    const response = await apiClient.getRiskAssessments(params)
    
    if (response.error) {
      setError(response.error)
    } else if (response.data) {
      setAssessments(response.data.assessments)
    }
    
    setLoading(false)
  }, [params?.property_id, params?.assessment_type])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  return { assessments, loading, error, refetch: fetchAssessments }
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