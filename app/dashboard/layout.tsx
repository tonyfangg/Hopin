'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/app/components/dashboard/sidebar'
import { DashboardHeader } from '@/app/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        router.push('/auth/login')
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setTimeout(() => {
          if (!session) {
            router.push('/auth/login')
          }
        }, 2000)
        return
      }
      
      if (!session) {
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: latestSession } }) => {
            if (!latestSession) {
              router.push('/auth/login')
            }
          })
        }, 2000)
        return
      }
      
      setSession(session)
    } catch (err) {
      setTimeout(() => {
        if (!session) {
          router.push('/auth/login')
        }
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p>No session found. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:ml-64">
          <DashboardHeader 
            user={session.user} 
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
