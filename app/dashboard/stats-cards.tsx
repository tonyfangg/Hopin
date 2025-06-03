interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    subtitle?: string
  }
  
  function StatCard({ title, value, change, changeType = 'neutral', subtitle }: StatCardProps) {
    const changeColors = {
      positive: 'text-green-600',
      negative: 'text-red-600',
      neutral: 'text-slate-600'
    }
  
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-600 mb-2">{title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{value}</span>
              {change && (
                <span className={`text-sm font-medium ${changeColors[changeType]}`}>
                  {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : ''} {change}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  export function StatsCards() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Credit Score</h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">750</span>
            <span className="text-sm font-medium text-green-600">+5pts</span>
          </div>
          <p className="text-sm text-green-600 font-medium">↗ Excellent</p>
        </div>
  
        <StatCard
          title="Performance Metrics"
          value="93"
          change="15%"
          changeType="positive"
          subtitle="Completion Rate"
        />
  
        <StatCard
          title=""
          value="12"
          change="2"
          changeType="positive"
          subtitle="Total Reports"
        />
  
        <StatCard
          title=""
          value="8"
          change="30%"
          changeType="positive"
          subtitle="Active Services"
        />
      </div>
    )
  }
  