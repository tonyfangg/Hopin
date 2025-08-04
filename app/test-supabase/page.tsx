'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')
  const [authTest, setAuthTest] = useState('Not tested')
  const [error, setError] = useState('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      const supabase = createClient()
      
      // Test 1: Basic connection
      console.log('Testing Supabase connection...')
      const { data, error: connError } = await supabase.from('profiles').select('count').limit(1)
      
      if (connError) {
        setConnectionStatus(`Connection Error: ${connError.message}`)
        setError(connError.message)
        return
      }
      
      setConnectionStatus('✅ Connected to Supabase')
      
      // Test 2: Auth endpoint
      console.log('Testing auth...')
      const { data: session } = await supabase.auth.getSession()
      setAuthTest(`✅ Auth endpoint working. Session: ${session.session ? 'Active' : 'None'}`)
      
    } catch (err: any) {
      console.error('Test error:', err)
      setConnectionStatus(`❌ Connection failed: ${err.message}`)
      setError(err.message)
    }
  }

  const testLogin = async () => {
    try {
      const supabase = createClient()
      setAuthTest('Testing login...')
      
      // Try a dummy login to see what happens
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@test.com',
        password: 'testpass'
      })
      
      if (error) {
        setAuthTest(`Login test result: ${error.message}`)
      } else {
        setAuthTest('Login test: Unexpected success')
      }
    } catch (err: any) {
      setAuthTest(`Login test error: ${err.message}`)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Environment Variables</h2>
          <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Connection Status</h2>
          <p>{connectionStatus}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Auth Test</h2>
          <p>{authTest}</p>
          <button 
            onClick={testLogin}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Login Endpoint
          </button>
        </div>

        {error && (
          <div className="p-4 border border-red-300 bg-red-50 rounded">
            <h2 className="font-semibold text-red-800">Error Details</h2>
            <pre className="text-sm text-red-700 mt-2">{error}</pre>
          </div>
        )}

        <div className="mt-6">
          <button 
            onClick={testConnection}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
          >
            Retry Connection Test
          </button>
          <a 
            href="/auth/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}