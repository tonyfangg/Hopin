export function RiskFactors() {
    const riskAreas = [
      {
        icon: "🔥",
        title: "Fire Safety & Emergency Systems",
        subtitle: "Extinguishers, alarms, exits",
        score: 95,
        type: "excellent"
      },
      {
        icon: "💧",
        title: "Plumbing and Drainage",
        subtitle: "Pipes, drainage, water systems",
        score: 88,
        type: "good"
      },
      {
        icon: "⚙️",
        title: "Maintenance & Infrastructure",
        subtitle: "Electrical, plumbing, HVAC", 
        score: 92,
        type: "excellent"
      },
      {
        icon: "👥",
        title: "Staff Safety & Training",
        subtitle: "Training records, compliance",
        score: 90,
        type: "excellent",
        comingSoon: true
      }
    ]
  
    const getScoreColor = (type: string) => {
      switch(type) {
        case 'excellent': return 'bg-green-500 text-white'
        case 'good': return 'bg-yellow-500 text-white'
        default: return 'bg-red-500 text-white'
      }
    }
  
    return (
      <section className="py-20 bg-white" id="risk-factors">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-4">
              Complete risk coverage
            </h2>
            <p className="text-xl text-slate-600">
              All critical areas monitored for comprehensive protection
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {riskAreas.map((area, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl">{area.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    {area.title}
                    {area.comingSoon && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded-full font-semibold">Coming Soon</span>
                    )}
                  </h3>
                  <p className="text-slate-600 text-sm">{area.subtitle}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(area.type)}`}>
                  {area.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  