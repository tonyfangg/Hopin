'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export default function TestLoginPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Test page - Auth state change:', event, !!session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Test page - Session check:', { session: !!session, error })
      setSession(session)
    } catch (err) {
      console.error('Test page - Session check error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testRedirect = () => {
    console.log('Testing redirect to dashboard...')
    window.location.href = '/dashboard'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">Login Test Page</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded">
            <h3 className="font-semibold mb-2">Session Status:</h3>
            <p>Has Session: {session ? '✅ Yes' : '❌ No'}</p>
            {session && (
              <>
                <p>User ID: {session.user.id}</p>
                <p>Email: {session.user.email}</p>
                <p>Expires: {new Date(session.expires_at! * 1000).toLocaleString()}</p>
              </>
            )}
          </div>
          
          <button
            onClick={testRedirect}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Test Redirect to Dashboard
          </button>
          
          <a
            href="/auth/login"
            className="block w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 text-center"
          >
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  )
} 