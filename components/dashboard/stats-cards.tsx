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
    <div className="space-y-6 mb-8">
      {/* Top Row - Credit Score Highlight */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 rounded-3xl p-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium text-blue-200 mb-2">Credit Score</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-bold">750</span>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-2xl font-bold">↗</span>
                <span className="text-green-400 text-xl font-bold">+5pts</span>
              </div>
            </div>
            <p className="text-green-400 font-semibold text-lg mt-2">↗ Excellent</p>
          </div>
          
          <div className="text-center lg:text-right">
            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 backdrop-blur-sm">
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Other Metrics */}
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
