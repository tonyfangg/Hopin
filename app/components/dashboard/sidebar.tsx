'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-white">★</span>
          </div>
          <span className="font-semibold text-slate-900">Hoops Store</span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive('/dashboard')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">📊</span> Dashboard
          </Link>
          <Link
            href="/dashboard/risk-score"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive('/dashboard/risk-score')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">🛡️</span> Risk Score
          </Link>
          <Link
            href="/dashboard/drainage"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive('/dashboard/drainage')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">💧</span> Drainage
          </Link>
          <Link
            href="/dashboard/electrical"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive('/dashboard/electrical')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">⚡</span> Electrical
          </Link>
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive('/dashboard/settings')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">⚙️</span> Settings
          </Link>
        </nav>
        <div className="mt-8">
          <div className="text-xs text-slate-500 uppercase mb-2">Coming Soon</div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60">
            <span className="text-lg">👥</span> Staff
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60">
            <span className="text-lg">📄</span> Insurance
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60">
            <span className="text-lg">🏢</span> Facility
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60">
            <span className="text-lg">🏗️</span> Building
          </div>
        </div>
      </div>
    </aside>
  )
} 