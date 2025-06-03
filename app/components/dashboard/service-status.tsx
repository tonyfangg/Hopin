'use client'

export function ServiceStatus() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Service Status</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-900">API Service</h3>
            <p className="text-sm text-slate-600">Main API endpoint</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Operational
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-900">Database</h3>
            <p className="text-sm text-slate-600">Primary database</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            Operational
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-900">Cache Service</h3>
            <p className="text-sm text-slate-600">Redis cache</p>
          </div>
          <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
            Degraded
          </span>
        </div>
      </div>
    </div>
  )
} 