'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export function ElectricalOverview() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('electrical_reports')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setReports(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  // Example calculations (adjust as needed for your schema)
  const totalInspections = reports.length
  const avgSafetyScore = reports.length ? Math.round(reports.reduce((sum, r) => sum + (r.safety_score || 0), 0) / reports.length) : 0
  const systemStatus = avgSafetyScore > 90 ? 'All Systems Normal' : 'Attention Needed'
  const riskImpact = reports.length ? Math.round(reports.reduce((sum, r) => sum + (r.risk_impact || 0), 0) / reports.length) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">System Status</h3>
            <p className="text-green-600 text-sm font-medium">{systemStatus}</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{avgSafetyScore}%</div>
        <p className="text-slate-500 text-sm">Operational</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔒</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Safety Score</h3>
            <p className="text-green-600 text-sm font-medium">{avgSafetyScore > 90 ? 'Excellent' : 'Needs Improvement'}</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-green-600">{avgSafetyScore}</div>
        <p className="text-slate-500 text-sm">Safety Rating</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Inspections</h3>
            <p className="text-blue-600 text-sm font-medium">Up to Date</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{totalInspections}</div>
        <p className="text-slate-500 text-sm">This Quarter</p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">💰</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Risk Impact</h3>
            <p className="text-green-600 text-sm font-medium">Reduced</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-green-600">{riskImpact}%</div>
        <p className="text-slate-500 text-sm">Insurance Risk</p>
      </div>
    </div>
  )
} 