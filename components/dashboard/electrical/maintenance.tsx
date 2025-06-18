export function ElectricalMaintenance() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Maintenance Schedule</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Upcoming Tasks</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Circuit Breaker Test</p>
                  <p className="text-sm text-slate-500">Store #2 - Mall</p>
                </div>
              </div>
              <span className="text-sm text-yellow-600 font-medium">Due Tomorrow</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🔧</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Panel Cleaning</p>
                  <p className="text-sm text-slate-500">Store #4 - Downtown</p>
                </div>
              </div>
              <span className="text-sm text-blue-600 font-medium">This Week</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Completed This Month</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">✅</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">GFCI Testing</p>
                  <p className="text-sm text-slate-500">All Locations</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Completed</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">✅</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Emergency Lighting</p>
                  <p className="text-sm text-slate-500">Store #1, #3, #5</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 