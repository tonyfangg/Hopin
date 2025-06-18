export function ElectricalOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">System Status</h3>
            <p className="text-green-600 text-sm font-medium">All Systems Normal</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900">100%</div>
        <p className="text-slate-500 text-sm">Operational</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔒</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Safety Score</h3>
            <p className="text-green-600 text-sm font-medium">Excellent</p>
          </div>
        </div>
        <div className="text-2xl font-bold text-green-600">95</div>
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
        <div className="text-2xl font-bold text-slate-900">12</div>
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
        <div className="text-2xl font-bold text-green-600">-20%</div>
        <p className="text-slate-500 text-sm">Insurance Risk</p>
      </div>
    </div>
  )
} 