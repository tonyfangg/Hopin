'use client'

export function RiskScoreCard() {
  return (
    <div className="bg-gradient-to-br from-green-400 via-blue-500 to-blue-600 rounded-2xl p-8 text-white">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🛡️</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Insurance Insights Coming Soon!</h3>
          <p className="text-blue-100">Based on your excellent operations data</p>
        </div>
      </div>
      
      <p className="text-blue-100 mb-6">
        Your management score of 620 indicates low-risk operations
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-blue-100 text-sm mb-2">Active Properties</h4>
          <div className="text-3xl font-bold">12</div>
          <p className="text-green-200 text-sm">All properties tracked</p>
        </div>
        <div>
          <h4 className="text-blue-100 text-sm mb-2">Safety Score</h4>
          <div className="text-3xl font-bold">92%</div>
          <p className="text-green-200 text-sm">Excellent for insurance</p>
        </div>
      </div>
    </div>
  )
} 