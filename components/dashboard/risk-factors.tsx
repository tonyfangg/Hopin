const riskFactors = [
  {
    name: 'Fire Safety Compliance',
    score: 95,
    impact: 'Major reduction',
    color: 'bg-green-500'
  },
  {
    name: 'Security Systems',
    score: 88,
    impact: 'Moderate reduction',
    color: 'bg-yellow-500'
  },
  {
    name: 'Maintenance Records',
    score: 92,
    impact: 'Major reduction',
    color: 'bg-green-500'
  },
  {
    name: 'Claims History',
    score: 98,
    impact: 'Significant reduction',
    color: 'bg-green-500'
  },
  {
    name: 'Location Risk',
    score: 78,
    impact: 'Minor increase',
    color: 'bg-red-500'
  }
]

export function RiskFactors() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Insurance Risk Factors</h3>
      
      <div className="space-y-4">
        {riskFactors.map((factor, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{factor.name}</h4>
              <p className="text-sm text-slate-500">{factor.impact}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-4 w-32">
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${factor.color}`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <span className="text-lg font-bold text-slate-900 w-8">{factor.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 