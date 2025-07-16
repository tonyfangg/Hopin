'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import Button from '@/components/ui/button'

export default function TestRedirectPage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState('')
  const supabase = createClient()

  const testDirectRedirect = async () => {
    setTesting(true)
    setResult('Testing direct redirect...')
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setResult('Session found, attempting direct redirect...')
        console.log('🚀 Direct redirect test - session found')
        
        // Try immediate redirect
        window.location.href = '/dashboard'
        
        // Fallback after 1 second
        setTimeout(() => {
          setResult('Fallback redirect...')
          window.location.replace('/dashboard')
        }, 1000)
        
      } else {
        setResult('No session found')
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Test Direct Redirect</h1>
        <p className="text-slate-600 mb-6">
          This page bypasses middleware to test direct redirect functionality.
        </p>
        
        <Button 
          onClick={testDirectRedirect}
          disabled={testing}
          className="w-full mb-4"
        >
          {testing ? 'Testing...' : 'Test Direct Redirect'}
        </Button>
        
        {result && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            {result}
          </div>
        )}
        
        <div className="mt-4 text-sm text-slate-500">
          <p>Current path: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
} 