'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export function SessionChecker() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkSession()
    
    // Also listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, !!session)
      setSessionInfo({
        event,
        hasSession: !!session,
        email: session?.user?.email,
        userId: session?.user?.id,
        timestamp: new Date().toLocaleTimeString()
      })
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      setSessionInfo({
        hasSession: !!session,
        email: session?.user?.email,
        userId: session?.user?.id,
        error: error?.message,
        timestamp: new Date().toLocaleTimeString()
      })
    } catch (err) {
      setSessionInfo({
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toLocaleTimeString()
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-4 p-3 bg-slate-100 rounded text-sm">
        Checking session status...
      </div>
    )
  }

  return (
    <div className={`mt-4 p-3 rounded text-sm ${
      sessionInfo?.hasSession 
        ? 'bg-green-50 border border-green-200 text-green-700' 
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      <div className="font-semibold mb-2">
        {sessionInfo?.hasSession ? '✅ Session Active' : '❌ No Session'}
      </div>
      
      {sessionInfo?.hasSession && (
        <div className="space-y-1 text-xs">
          <div>Email: {sessionInfo.email}</div>
          <div>User ID: {sessionInfo.userId?.substring(0, 8)}...</div>
        </div>
      )}
      
      {sessionInfo?.error && (
        <div className="text-xs text-red-600">Error: {sessionInfo.error}</div>
      )}
      
      <div className="text-xs text-slate-500 mt-2">
        Last checked: {sessionInfo?.timestamp}
      </div>
      
      <button 
        onClick={checkSession}
        className="text-xs underline mt-1"
      >
        Refresh Status
      </button>
    </div>
  )
} 