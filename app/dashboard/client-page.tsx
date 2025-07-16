'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function ClientDashboardPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Client dashboard - Auth state change:', event, !!session)
      setSession(session)
      
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
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
        router.push('/auth/login')
        return
      }
      
      if (!session) {
        console.log('No session found, redirecting to login')
        router.push('/auth/login')
        return
      }
      
      setSession(session)
    } catch (err) {
      console.error('Session check error:', err)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
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
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-600">Welcome back, {session.user.email}!</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-50 rounded-xl p-6">
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

              <div className="bg-slate-50 rounded-xl p-6">
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

              <div className="bg-slate-50 rounded-xl p-6">
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

            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Session Info:</h3>
              <div className="text-sm text-slate-600 space-y-1">
                <div>User ID: {session.user.id}</div>
                <div>Email: {session.user.email}</div>
                <div>Expires: {new Date(session.expires_at! * 1000).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 