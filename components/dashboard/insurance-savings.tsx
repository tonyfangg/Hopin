export function InsuranceSavings() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🏢</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Potential Insurance Savings</h3>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
        <div className="text-4xl font-bold text-green-600 mb-2">25-35%</div>
        <p className="text-slate-600">Based on your risk management data</p>
      </div>

      <div className="bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span>🛡️</span>
          </div>
          <h4 className="text-lg font-semibold">Insurance Insights Coming Soon</h4>
        </div>
        <p className="text-blue-100 mb-4">
          We're analyzing your excellent operations data to provide personalized insurance recommendations
        </p>
        <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors">
          Notify me when available
        </button>
      </div>
    </div>
  )
} 