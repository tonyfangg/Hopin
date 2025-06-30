'use client'
import { useElectricalReports } from '@/app/lib/hooks/use-api'
import { ElectricalReport } from '@/app/lib/types/api'
import { ErrorState } from '@/components/ui/error-state'

interface ElectricalStats {
  total_reports: number
  pending_inspections: number
  overdue_inspections: number
  average_safety_score: number
  high_risk_items: number
}

export function ElectricalOverview() {
  const { data, loading, error } = useElectricalReports()
  
  // Extract reports and stats from the API response
  const reports = (data as any)?.data || []
  const stats: ElectricalStats = (data as any)?.stats || {
    total_reports: 0,
    pending_inspections: 0,
    overdue_inspections: 0,
    average_safety_score: 0,
    high_risk_items: 0
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100">
            <div className="h-4 bg-slate-200 rounded mb-2"></div>
            <div className="h-8 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Error Loading Electrical Data"
        description="Unable to load electrical system information. Please try again."
        onRetry={() => window.location.reload()}
      />
    )
  }

  const systemStatus = stats.average_safety_score > 90 ? 'All Systems Normal' : 
                      stats.average_safety_score > 70 ? 'Attention Needed' : 'Critical Issues'
  
  const statusColor = stats.average_safety_score > 90 ? 'text-emerald-600' : 
                      stats.average_safety_score > 70 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">System Status</h3>
            <p className={`text-sm font-medium ${statusColor}`}>{systemStatus}</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{stats.average_safety_score}%</div>
        <p className="text-slate-500 text-sm">Safety Score</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Total Reports</h3>
            <p className="text-blue-600 text-sm font-medium">This Month</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{stats.total_reports}</div>
        <p className="text-slate-500 text-sm">Inspections</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">⏰</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Pending</h3>
            <p className="text-amber-600 text-sm font-medium">Needs Action</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{stats.pending_inspections}</div>
        <p className="text-slate-500 text-sm">Inspections</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔴</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">High Risk</h3>
            <p className="text-red-600 text-sm font-medium">Urgent</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{stats.high_risk_items}</div>
        <p className="text-slate-500 text-sm">Items</p>
      </div>
    </div>
  )
} 