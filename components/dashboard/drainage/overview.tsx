export function DrainageOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">💧</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Overall Status</h3>
            <p className="text-green-600 text-sm font-medium">All Systems Operational</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">98%</div>
        <p className="text-slate-500 text-sm">System Efficiency</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔧</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Maintenance Due</h3>
            <p className="text-yellow-600 text-sm font-medium">2 Properties</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">5</div>
        <p className="text-slate-500 text-sm">Scheduled This Week</p>
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
        <div className="text-2xl font-bold text-green-600">-15%</div>
        <p className="text-slate-500 text-sm">Risk Impact</p>
      </div>
    </div>
  )
} 