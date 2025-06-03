'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  user: {
    email?: string
    user_metadata?: {
      company_name?: string
    }
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Overview</h1>
          <div className="flex items-center gap-2 mt-1">
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              ← Back
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Date Range */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Last 7 Days (Mar 6 - Mar 12)</span>
            <span className="text-red-500">📈</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span>{user.user_metadata?.company_name || user.email}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-lg py-2 w-48 z-50">
                <div className="px-4 py-2 text-sm text-slate-600 border-b border-slate-100">
                  {user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* More Options */}
          <button className="text-slate-400 hover:text-slate-600">
            ⋯
          </button>
        </div>
      </div>
    </header>
  )
}
