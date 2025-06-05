export function DashboardPreview() {
    return (
      <section className="py-20 bg-slate-50" id="dashboard">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Your risk management command center
            </h2>
            <p className="text-xl text-slate-600">
              Real-time insights that insurance companies trust and value
            </p>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="bg-white rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-slate-900">Risk Overview</h3>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                Low Risk Profile
              </div>
            </div>
            
            {/* Risk Score Circle */}
            <div className="text-center mb-8">
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex flex-col items-center justify-center text-white shadow-lg">
                <div className="text-5xl font-bold">750</div>
                <div className="text-lg opacity-90">Safety Score</div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-slate-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">1</div>
                <div className="text-slate-600 font-medium">Active Property</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
                <div className="text-slate-600 font-medium">Safety Rating</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">£2,400</div>
                <div className="text-slate-600 font-medium">Annual Savings</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                <div className="text-slate-600 font-medium">Below Industry Risk</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  