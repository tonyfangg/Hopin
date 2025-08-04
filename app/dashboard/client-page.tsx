'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/app/components/dashboard/sidebar'
import { DashboardHeader } from '@/app/components/dashboard/header'

export default function ClientDashboardPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Client dashboard - Auth state change:', event, !!session)
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in, setting session')
        setSession(session)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        console.log('❌ User signed out, redirecting to login')
        setSession(null)
        router.push('/auth/login')
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 Token refreshed, updating session')
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Client dashboard - Session check:', { session: !!session, error })
      
      if (error) {
        console.error('Session error:', error)
        // Don't immediately redirect on error, wait a bit for potential auth state change
        setTimeout(() => {
          if (!session) {
            router.push('/auth/login')
          }
        }, 2000)
        return
      }
      
      if (!session) {
        console.log('No session found, waiting for potential auth state change...')
        // Give the auth state change listener time to fire before redirecting
        setTimeout(() => {
          // Double-check session before redirecting
          supabase.auth.getSession().then(({ data: { session: latestSession } }) => {
            if (!latestSession) {
              console.log('Still no session after delay, redirecting to login')
              router.push('/auth/login')
            }
          })
        }, 2000)
        return
      }
      
      setSession(session)
    } catch (err) {
      console.error('Session check error:', err)
      // Don't immediately redirect on error
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
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 ml-64">
          <DashboardHeader user={session.user} />
          <main className="p-6">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-600">Welcome back, {session.user.email}!</p>
              </div>

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
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Risk Score</h3>
                      <p className="text-green-600 text-sm font-medium">Overall Rating</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <p className="text-slate-500 text-sm">Low Risk</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl">📋</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Reports</h3>
                      <p className="text-yellow-600 text-sm font-medium">Due This Month</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">2</div>
                  <p className="text-slate-500 text-sm">Pending Items</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✅ Login successful! You are now authenticated and can access the dashboard.
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Session Info:</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <div>User ID: {session.user.id}</div>
                  <div>Email: {session.user.email}</div>
                  <div>Expires: {new Date(session.expires_at! * 1000).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
} 