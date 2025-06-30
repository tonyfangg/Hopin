'use client'
import { useElectricalReports } from '@/app/lib/hooks/use-api'
import { ElectricalReport } from '@/app/lib/types/api'

export function ElectricalInspections() {
  const { data, loading, error } = useElectricalReports()
  
  // Extract inspections from the API response
  const inspections = (data as any)?.data || []

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(new Date(dateString))
    } catch {
      return 'Invalid date'
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'compliant':
        return 'bg-emerald-100 text-emerald-800'
      case 'scheduled':
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'overdue':
      case 'non-compliant':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Recent Electrical Inspections</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Recent Electrical Inspections</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading inspections: {error.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-900">Recent Electrical Inspections</h3>
      </div>
      {inspections.length === 0 ? (
        <div className="p-6 text-center text-slate-500">
          <p>No electrical inspections found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Inspection Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Inspector</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Risk Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {inspections.map((inspection: ElectricalReport) => (
                <tr key={inspection.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm font-medium text-slate-900">
                    {inspection.inspection_type || 'General Inspection'}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {inspection.inspector_name || 'Not assigned'}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {formatDate(inspection.inspection_date)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inspection.compliance_status)}`}>
                      {inspection.compliance_status || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {inspection.risk_rating ? `${inspection.risk_rating}/10` : 'Not rated'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 