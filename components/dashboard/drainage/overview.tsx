'use client'

import { useState, useEffect } from 'react'

interface DrainageReport {
  id: string
  property_id: string
  inspection_type: string
  drainage_condition: string
  risk_rating: number
  repairs_required: boolean
  inspection_date: string
  property: {
    name: string
  }
}

export function DrainageOverview() {
  const [reports, setReports] = useState<DrainageReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/drainage-reports')
        const data = await response.json()

        if (response.ok) {
          setReports(data.reports || [])
        } else {
          setError(data.error || 'Failed to fetch drainage reports')
        }
      } catch (err) {
        setError('Failed to load drainage reports')
        console.error('Drainage reports error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Calculate statistics from real data
  const totalReports = reports.length
  const goodConditionCount = reports.filter(r => 
    r.drainage_condition === 'good' || r.drainage_condition === 'fair'
  ).length
  const systemEfficiency = reports.length > 0 
    ? Math.round((goodConditionCount / reports.length) * 100)
    : 0
  const maintenanceDue = reports.filter(r => r.repairs_required).length
  const riskReduction = Math.max(0, 20 - (reports.filter(r => r.risk_rating > 3).length * 3))

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="h-8 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-600">Error loading drainage overview: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">💧</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Overall Status</h3>
            <p className={`text-sm font-medium ${
              systemEfficiency >= 90 ? 'text-green-600' : 
              systemEfficiency >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {systemEfficiency >= 90 ? 'All Systems Operational' : 
               systemEfficiency >= 70 ? 'Some Issues Detected' : 'Attention Required'}
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{systemEfficiency}%</div>
        <p className="text-slate-500 text-sm">System Efficiency</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔧</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Maintenance Due</h3>
            <p className={`text-sm font-medium ${
              maintenanceDue === 0 ? 'text-green-600' : 
              maintenanceDue <= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {maintenanceDue === 0 ? 'All Up to Date' : `${maintenanceDue} Properties`}
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{totalReports}</div>
        <p className="text-slate-500 text-sm">Total Inspections</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">✅</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Risk Reduction</h3>
            <p className="text-green-600 text-sm font-medium">Water Damage Prevention</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-green-600">-{riskReduction}%</div>
        <p className="text-slate-500 text-sm">Risk Impact</p>
      </div>
    </div>
  )
} 