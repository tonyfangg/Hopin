export function RiskOverview() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Insurance Risk Profile</h2>
        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          Low Risk
        </span>
      </div>

      {/* Large Risk Score Circle */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-slate-900 mb-2">750</div>
              <div className="text-slate-600 font-medium">Safety Score</div>
              <div className="text-green-600 text-sm font-medium mt-1">↗ +5</div>
            </div>
          </div>
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-48 h-48 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeDasharray={`${(750/1000) * 283} 283`}
              className="transition-all duration-500"
            />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Excellent Safety Record</h3>
        <p className="text-slate-600">
          Your data indicates 40% lower risk than industry average
        </p>
      </div>
    </div>
  )
} 