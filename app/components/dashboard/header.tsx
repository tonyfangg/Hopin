'use client'

import { User } from '@supabase/supabase-js'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { useRouter } from 'next/navigation'
import { memo, useCallback } from 'react'

interface DashboardHeaderProps {
  user?: User
  onMenuClick?: () => void
}

function DashboardHeaderComponent({ user, onMenuClick }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = useSupabase()

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }, [supabase.auth, router])

  return (
    <header className="h-16 border-b border-slate-200 bg-white">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm text-slate-600 truncate max-w-32 sm:max-w-none">
            {user?.email || 'Guest'}
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 rounded-md min-h-[44px] sm:min-h-auto flex items-center"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

// Export memoized component
export const DashboardHeader = memo(DashboardHeaderComponent) 