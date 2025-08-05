'use client'
import { useState, useEffect } from 'react'

interface SafetyData {
  total_inspections: number
  compliance_rate: number
  average_safety_score: number
  pending_inspections: number
  overdue_inspections: number
  recent_issues: Array<{
    id: string
    issue_type: string
    severity: string
    date_reported: string
    status: string
  }>
}

export default function ElectricalSafety() {
  const [safetyData, setSafetyData] = useState<SafetyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSafetyData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/electrical-reports', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch safety data')
        }

        // Calculate safety metrics from the data
        const reports = result.data || []
        const totalInspections = reports.length
        const complianceRate = reports.length > 0 
          ? Math.round((reports.filter((r: any) => r.compliance_status === 'compliant').length / reports.length) * 100)
          : 0
        const averageSafetyScore = reports.length > 0
          ? Math.round(reports.reduce((sum: number, r: any) => sum + (Number(r.safety_score) || 0), 0) / reports.length)
          : 0
        const pendingInspections = reports.filter((r: any) => r.compliance_status === 'pending').length
        const overdueInspections = reports.filter((r: any) => {
          if (!r.next_inspection_date) return false
          return new Date(r.next_inspection_date) < new Date()
        }).length

        // Mock recent issues (in real app, this would come from a separate API)
        const recentIssues = [
          {
            id: '1',
            issue_type: 'Electrical Fault',
            severity: 'High',
            date_reported: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'In Progress'
          },
          {
            id: '2',
            issue_type: 'Safety Compliance',
            severity: 'Medium',
            date_reported: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Resolved'
          }
        ]

        setSafetyData({
          total_inspections: totalInspections,
          compliance_rate: complianceRate,
          average_safety_score: averageSafetyScore,
          pending_inspections: pendingInspections,
          overdue_inspections: overdueInspections,
          recent_issues: recentIssues
        })

      } catch (err) {
        console.error('Error fetching safety data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSafetyData()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700">Error loading safety data: {error}</p>
      </div>
    )
  }

  if (!safetyData) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <p className="text-slate-600">No safety data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Electrical Safety Overview</h2>
      
      {/* Safety Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-emerald-600">{safetyData.compliance_rate}%</div>
          <div className="text-sm text-emerald-700">Compliance Rate</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">{safetyData.average_safety_score}</div>
          <div className="text-sm text-blue-700">Avg Safety Score</div>
        </div>
      </div>

      {/* Inspection Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-900">{safetyData.total_inspections}</div>
          <div className="text-sm text-slate-600">Total Inspections</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-amber-600">{safetyData.pending_inspections}</div>
          <div className="text-sm text-slate-600">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">{safetyData.overdue_inspections}</div>
          <div className="text-sm text-slate-600">Overdue</div>
        </div>
      </div>

      {/* Recent Issues */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Issues</h3>
        <div className="space-y-3">
          {safetyData.recent_issues.map((issue) => (
            <div key={issue.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-900">{issue.issue_type}</div>
                <div className="text-sm text-slate-600">
                  {new Date(issue.date_reported).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  issue.severity === 'High' ? 'bg-red-100 text-red-700' :
                  issue.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {issue.severity}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {issue.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 