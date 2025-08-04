'use client'

import { RiskScoreCard } from '@/components/dashboard/risk-score-card'

export default function ClientDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome to your property management dashboard</p>
      </div>

      {/* Risk Score - Full Width Feature */}
      <RiskScoreCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Properties</h3>
              <p className="text-blue-600 text-sm font-medium">Manage your locations</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">3</div>
          <p className="text-slate-500 text-sm">Active Properties</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Electrical</h3>
              <p className="text-green-600 text-sm font-medium">Compliance Status</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">Good</div>
          <p className="text-slate-500 text-sm">All inspections current</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💧</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Drainage</h3>
              <p className="text-blue-600 text-sm font-medium">System Status</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">Excellent</div>
          <p className="text-slate-500 text-sm">All systems operational</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm">📊</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Risk assessment updated</p>
              <p className="text-xs text-slate-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm">✅</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Electrical inspection completed</p>
              <p className="text-xs text-slate-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-sm">📋</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">New drainage report submitted</p>
              <p className="text-xs text-slate-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">🏢</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Add Property</h4>
            <p className="text-sm text-slate-500">Register a new location</p>
          </button>
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">📊</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Risk Assessment</h4>
            <p className="text-sm text-slate-500">Run new evaluation</p>
          </button>
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">📋</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">New Report</h4>
            <p className="text-sm text-slate-500">Submit inspection</p>
          </button>
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">📎</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Upload Document</h4>
            <p className="text-sm text-slate-500">Add compliance files</p>
          </button>
        </div>
      </div>
    </div>
  )
} 