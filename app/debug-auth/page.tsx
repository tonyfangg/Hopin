'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export default function DebugAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const supabase = createClient()

  useEffect(() => {
    const gatherDebugInfo = async () => {
      const info: any = {
        currentUrl: window.location.href,
        pathname: window.location.pathname,
        hash: window.location.hash,
        search: window.location.search,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        timestamp: new Date().toISOString()
      }

      // Parse hash parameters
      if (window.location.hash) {
        try {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          info.hashParams = {
            access_token: hashParams.get('access_token') ? 'PRESENT' : 'MISSING',
            refresh_token: hashParams.get('refresh_token') ? 'PRESENT' : 'MISSING',
            type: hashParams.get('type'),
            expires_at: hashParams.get('expires_at'),
            error: hashParams.get('error'),
            error_description: hashParams.get('error_description')
          }
        } catch (e) {
          info.hashParseError = e instanceof Error ? e.message : 'Unknown error'
        }
      }

      // Parse search parameters
      if (window.location.search) {
        try {
          const searchParams = new URLSearchParams(window.location.search)
          info.searchParams = {
            error: searchParams.get('error'),
            message: searchParams.get('message'),
            type: searchParams.get('type'),
            token_hash: searchParams.get('token_hash') ? 'PRESENT' : 'MISSING'
          }
        } catch (e) {
          info.searchParseError = e instanceof Error ? e.message : 'Unknown error'
        }
      }

      // Check Supabase session
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        info.session = {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          error: error?.message
        }
      } catch (e) {
        info.sessionError = e instanceof Error ? e.message : 'Unknown error'
      }

      setDebugInfo(info)
    }

    gatherDebugInfo()
  }, [supabase.auth])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug Info</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">URL Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/auth/reset-password'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Reset Password Page
            </button>
            
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
            >
              Go to Login Page
            </button>

            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 