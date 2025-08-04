'use client'

import { useState } from 'react'

export default function DebugConnection() {
  const [results, setResults] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnections = async () => {
    setTesting(true)
    setResults([])
    
    addResult('🔍 Starting connection diagnostics...')
    
    // Test 1: Environment variables
    addResult(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING'}`)
    addResult(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}`)
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      addResult(`URL Value: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
    }
    
    // Test 2: Basic fetch to Supabase
    try {
      addResult('🌐 Testing basic HTTPS connection...')
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors'
      })
      addResult('✅ Basic internet connectivity: OK')
    } catch (err: any) {
      addResult(`❌ Basic internet connectivity failed: ${err.message}`)
    }
    
    // Test 3: Supabase URL accessibility
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        addResult('🔗 Testing Supabase URL accessibility...')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const testUrl = `${supabaseUrl}/rest/v1/`
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          addResult('✅ Supabase endpoint accessible')
          addResult(`Response status: ${response.status}`)
        } else {
          addResult(`⚠️ Supabase responded with status: ${response.status}`)
          const text = await response.text()
          addResult(`Response: ${text.substring(0, 200)}`)
        }
      } catch (err: any) {
        addResult(`❌ Supabase connection failed: ${err.message}`)
        addResult(`Error type: ${err.name}`)
        if (err.cause) {
          addResult(`Error cause: ${err.cause}`)
        }
      }
    }
    
    // Test 4: Supabase client creation
    try {
      addResult('📦 Testing Supabase client creation...')
      const { createClient } = await import('@/app/lib/supabase-client')
      const supabase = createClient()
      addResult('✅ Supabase client created successfully')
      
      // Test auth endpoint specifically
      addResult('🔐 Testing auth endpoint...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        addResult(`❌ Auth endpoint error: ${error.message}`)
      } else {
        addResult('✅ Auth endpoint accessible')
        addResult(`Current session: ${session ? 'Active' : 'None'}`)
      }
      
    } catch (err: any) {
      addResult(`❌ Supabase client test failed: ${err.message}`)
    }
    
    // Test 5: Alternative connection method
    try {
      addResult('🔄 Testing alternative connection...')
      // Try using the raw supabase-js client
      const { createClient } = await import('@supabase/supabase-js')
      const altClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data, error } = await altClient.from('profiles').select('count').limit(1)
      
      if (error) {
        addResult(`❌ Alternative connection failed: ${error.message}`)
      } else {
        addResult('✅ Alternative connection successful')
      }
    } catch (err: any) {
      addResult(`❌ Alternative connection error: ${err.message}`)
    }
    
    setTesting(false)
    addResult('🏁 Diagnostics complete')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Connection Diagnostics</h1>
      
      <div className="mb-6">
        <button 
          onClick={testConnections}
          disabled={testing}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'Running Tests...' : 'Run Connection Tests'}
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-500">Click "Run Connection Tests" to start diagnostics</div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="font-semibold text-yellow-800 mb-2">Common Issues & Solutions:</h2>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Failed to fetch:</strong> Usually indicates network/CORS issues or invalid Supabase URL</li>
          <li>• <strong>Invalid API key:</strong> Check if SUPABASE_ANON_KEY is correct and not expired</li>
          <li>• <strong>Project not found:</strong> Supabase project may be paused, deleted, or URL is wrong</li>
          <li>• <strong>DNS issues:</strong> Corporate firewall or network restrictions</li>
        </ul>
      </div>

      <div className="mt-4">
        <a 
          href="/auth/login"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 inline-block"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}