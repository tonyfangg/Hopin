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
    name: 'Safety Scores',
    href: '/dashboard/safety-scores',
    icon: '🛡️',
    color: 'text-green-600'
  },
  {
    name: 'Electrical',
    href: '/dashboard/electrical',
    icon: '⚡',
    color: 'text-yellow-600'
  },
  {
    name: 'Plumbing',
    href: '/dashboard/plumbing',
    icon: '💧',
    color: 'text-blue-500'
  },
  {
    name: 'Fire Safety',
    href: '/dashboard/fire-safety',
    icon: '🔥',
    color: 'text-red-600'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
    color: 'text-gray-600'
  }
]

const comingSoonItems = [
  {
    name: 'Property',
    icon: '🏠',
    description: 'Property condition risk'
  },
  {
    name: 'Facilities',
    icon: '🏢',
    description: 'Including refrigeration, HVAC'
  },
  {
    name: 'Staff',
    icon: '👥',
    description: 'Comp, health and safety'
  },
  {
    name: 'Insurance',
    icon: '📄',
    description: ''
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
        <div className="mt-8">
          <div className="text-xs text-slate-500 uppercase mb-2">Coming Soon</div>
          {comingSoonItems.map((item) => (
            <div key={item.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed opacity-60">
              <span className="text-lg">{item.icon}</span>
              {item.name}
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded-full font-semibold">Coming Soon</span>
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
} 