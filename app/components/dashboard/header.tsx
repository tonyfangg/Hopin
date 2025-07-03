'use client'

import { User } from '@supabase/supabase-js'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  user?: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = useSupabase()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="h-16 border-b border-slate-200 bg-white">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user?.email || 'Guest'}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
} 