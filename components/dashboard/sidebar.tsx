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
    name: 'Properties',
    href: '/dashboard/properties',
    icon: '🏢',
    color: 'text-orange-600'
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
    name: 'Staff',
    href: '/dashboard/staff',
    icon: '👥',
    color: 'text-cyan-600'
  },
  {
    name: 'Insurance',
    href: '/dashboard/insurance',
    icon: '📄',
    color: 'text-gray-600'
  },
  {
    name: 'Refrigeration',
    href: '/dashboard/refrigeration',
    icon: '❄️',
    color: 'text-blue-400'
  },
  {
    name: 'Building',
    href: '/dashboard/building',
    icon: '🏗️',
    color: 'text-gray-600'
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: '📋',
    color: 'text-gray-600'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
    color: 'text-gray-600'
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-700">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-slate-900 font-bold text-sm">H</span>
        </div>
        <span className="text-xl font-semibold">Hoops</span>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <div className="absolute right-3 top-2.5 text-slate-400">
            🔍
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 