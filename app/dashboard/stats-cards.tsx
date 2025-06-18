// @ts-expect-error: lucide-react types are missing
import { ArrowUpRight } from 'lucide-react'

function StatCard({ title, value, change, changeType = 'positive', subtitle }: { title?: string, value: string | number, change?: string, changeType?: 'positive' | 'negative' | 'neutral', subtitle: string }) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-slate-600',
  }
  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 flex flex-col items-center justify-center min-h-[160px]">
      {title && <h3 className="text-base font-medium text-slate-700 mb-2 text-center">{title}</h3>}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-4xl font-bold text-slate-900">{value}</span>
        {change && (
          <span className={`text-base font-semibold flex items-center gap-1 ${changeColors[changeType]}`}>
            <ArrowUpRight className="w-4 h-4" /> {change}
          </span>
        )}
      </div>
      <div className="text-slate-500 text-base font-medium text-center">{subtitle}</div>
    </div>
  )
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Credit Score Card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 flex flex-col justify-center min-h-[160px] col-span-1 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Credit Score</h3>
        <div className="flex items-end gap-4 mb-2">
          <span className="text-6xl font-extrabold text-slate-900 leading-none">750</span>
          <span className="text-xl font-bold text-green-600 flex items-center">+5pts</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-green-600 font-medium text-lg">↑ Excellent</span>
        </div>
      </div>
      {/* Performance Metrics */}
      <StatCard
        title="Performance Metrics"
        value="93"
        change="15%"
        changeType="positive"
        subtitle="Completion Rate"
      />
      {/* Total Reports */}
      <StatCard
        value="12"
        change="2"
        changeType="positive"
        subtitle="Total Reports"
      />
      {/* Active Services */}
      <StatCard
        value="8"
        change="30%"
        changeType="positive"
        subtitle="Active Services"
      />
    </div>
  )
}
  