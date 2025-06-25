'use client'

import { useState, useEffect } from 'react'

interface ElectricalReport {
  id: string
  property_id: string
  inspection_type: string
  overall_condition: string
  risk_rating: number
  compliance_status: string
  inspection_date: string
  property: {
    name: string
  }
}

export function ElectricalOverview() {
  const [reports, setReports] = useState<ElectricalReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/electrical-reports')
        const data = await response.json()

        if (response.ok) {
          setReports(data.reports || [])
        } else {
          setError(data.error || 'Failed to fetch electrical reports')
        }
      } catch (err) {
        setError('Failed to load electrical reports')
        console.error('Electrical reports error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Calculate statistics from real data
  const totalInspections = reports.length
  const satisfactoryCount = reports.filter(r => r.overall_condition === 'satisfactory').length
  const avgSafetyScore = reports.length > 0 
    ? Math.round((satisfactoryCount / reports.length) * 100)
    : 0
  const riskImpact = Math.max(0, 25 - (reports.filter(r => r.risk_rating > 3).length * 5))

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
        <p className="text-red-600">Error loading electrical overview: {error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">✅</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Safety Rating</h3>
            <p className={`text-sm font-medium ${
              avgSafetyScore >= 80 ? 'text-green-600' : 
              avgSafetyScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {avgSafetyScore >= 80 ? 'Excellent' : 
               avgSafetyScore >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-green-600">{avgSafetyScore}%</div>
        <p className="text-slate-500 text-sm">Safety Rating</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Inspections</h3>
            <p className="text-blue-600 text-sm font-medium">
              {totalInspections > 0 ? 'Up to Date' : 'None Recorded'}
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{totalInspections}</div>
        <p className="text-slate-500 text-sm">Total Reports</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Risk Impact</h3>
            <p className="text-green-600 text-sm font-medium">
              {riskImpact > 15 ? 'Reduced' : 'Monitor'}
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-green-600">-{riskImpact}%</div>
        <p className="text-slate-500 text-sm">Insurance Risk</p>
      </div>
    </div>
  )
} 