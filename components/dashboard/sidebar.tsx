'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    color: 'text-blue-600'
  },
  {
    name: 'Risk Score',
    href: '/dashboard/risk-score',
    icon: '🛡️',
    color: 'text-red-600'
  },
  {
    name: 'Drainage',
    href: '/dashboard/drainage',
    icon: '💧',
    color: 'text-blue-500'
  },
  {
    name: 'Electrical',
    href: '/dashboard/electrical',
    icon: '⚡',
    color: 'text-yellow-600'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
    color: 'text-gray-600'
  }
]

const comingSoonItems = [
  { name: 'Staff', icon: '👥', color: 'text-cyan-600' },
  { name: 'Insurance', icon: '📄', color: 'text-gray-600' },
  { name: 'Facility', icon: '🏗️', color: 'text-gray-600' },
  { name: 'Building', icon: '🏢', color: 'text-gray-600' }
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-200">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold">⭐</span>
        </div>
        <span className="text-xl font-bold text-slate-900">Hoops Store</span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <span className={cn("text-lg", isActive ? item.color : 'text-slate-400')}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}

        {/* Coming Soon Section */}
        <div className="pt-6">
          <div className="px-3 py-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              COMING SOON
            </span>
          </div>
          {comingSoonItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              <span className="text-lg opacity-50">{item.icon}</span>
              {item.name}
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
} 