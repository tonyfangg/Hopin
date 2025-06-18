const safetyChecks = [
  {
    category: 'Circuit Protection',
    status: 'Excellent',
    score: 98,
    color: 'bg-green-500',
    icon: '🔌',
    lastCheck: '2 days ago'
  },
  {
    category: 'Ground Fault Protection',
    status: 'Good',
    score: 92,
    color: 'bg-green-500',
    icon: '⚡',
    lastCheck: '1 week ago'
  },
  {
    category: 'Electrical Panel',
    status: 'Good',
    score: 88,
    color: 'bg-yellow-500',
    icon: '📟',
    lastCheck: '3 days ago'
  },
  {
    category: 'Emergency Lighting',
    status: 'Excellent',
    score: 96,
    color: 'bg-green-500',
    icon: '💡',
    lastCheck: '1 day ago'
  }
]

export function ElectricalSafety() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Electrical Safety Assessment</h3>
        <span className="text-sm text-slate-500">All categories monitored</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safetyChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">{check.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{check.category}</h4>
                <p className="text-sm text-slate-500">Last check: {check.lastCheck}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{check.score}</div>
                <div className={`text-sm font-medium ${check.color.replace('bg-', 'text-')}`}>{check.status}</div>
              </div>
              <div className="w-2 h-8 rounded-full bg-slate-200">
                <div 
                  className={`w-2 rounded-full ${check.color}`}
                  style={{ height: `${check.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 