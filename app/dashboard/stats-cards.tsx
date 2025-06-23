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
    <div className="space-y-6 mb-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Performance Metrics</h3>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">📈</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">93</span>
            <span className="text-green-600 font-semibold">↗ 15%</span>
          </div>
          <p className="text-sm text-slate-500">Completion Rate</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Total Reports</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">12</span>
            <span className="text-green-600 font-semibold">↗ 2</span>
          </div>
          <p className="text-sm text-slate-500">This Month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600">Active Services</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">⚙️</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">8</span>
            <span className="text-green-600 font-semibold">↗ 30%</span>
          </div>
          <p className="text-sm text-slate-500">Running</p>
        </div>
      </div>
    </div>
  )
}
  