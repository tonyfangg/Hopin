'use client'

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
    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-sm transition-shadow">
      <h3 className="text-sm font-medium text-slate-500 mb-3">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {change && (
          <span className={`text-sm font-medium ${changeColors[changeType]}`}>
            {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{change}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  )
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value="$24,780"
        change="12.5% from last month"
        changeType="positive"
      />
      <StatCard
        title="Active Users"
        value="1,234"
        change="8.2% from last month"
        changeType="positive"
      />
      <StatCard
        title="Total Orders"
        value="456"
        change="2.4% from last month"
        changeType="negative"
      />
      <StatCard
        title="Conversion Rate"
        value="3.2%"
        change="0.8% from last month"
        changeType="positive"
      />
    </div>
  )
}
