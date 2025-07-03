'use client'

import { createClient } from '@/app/lib/supabase-client'
import Button from '@/components/ui/button'
import { useState } from 'react'

export function TestRedirectButton() {
  const [testing, setTesting] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const supabase = createClient()

  const addDebugInfo = (message: string) => {
    console.log(message)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testRedirect = async () => {
    setTesting(true)
    setDebugInfo([])
    
    try {
      addDebugInfo('🔍 Starting redirect test...')
      
      // Check current session
      const { data: { session }, error } = await supabase.auth.getSession()
      addDebugInfo(`Session check: ${session ? '✅ Found' : '❌ Not found'}`)
      
      if (error) {
        addDebugInfo(`Session error: ${error.message}`)
      }
      
      if (session) {
        addDebugInfo(`User ID: ${session.user.id}`)
        addDebugInfo(`Email: ${session.user.email}`)
        addDebugInfo(`Expires: ${new Date(session.expires_at! * 1000).toLocaleString()}`)
        
        // Test different redirect methods
        addDebugInfo('🚀 Attempting redirect methods...')
        
        // Method 1: window.location.href
        addDebugInfo('Method 1: window.location.href')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
        
        // Method 2: window.location.replace (if method 1 fails)
        setTimeout(() => {
          addDebugInfo('Method 2: window.location.replace (backup)')
          window.location.replace('/dashboard')
        }, 3000)
        
      } else {
        addDebugInfo('❌ No session found - cannot redirect')
        alert('No active session found. Please login first.')
      }
      
    } catch (err) {
      addDebugInfo(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setTesting(false)
    }
  }

  const clearLogs = () => {
    setDebugInfo([])
  }

  return (
    <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">🔧 Debug Tools</h3>
      
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={testRedirect} 
          disabled={testing}
          className="bg-green-600 hover:bg-green-700 text-sm"
        >
          {testing ? 'Testing...' : '🧪 Test Dashboard Redirect'}
        </Button>
        
        <Button 
          onClick={clearLogs}
          variant="outline" 
          className="text-sm"
        >
          Clear Logs
        </Button>
      </div>

      {debugInfo.length > 0 && (
        <div className="bg-white border rounded p-3 max-h-40 overflow-y-auto">
          <div className="text-xs font-mono space-y-1">
            {debugInfo.map((info, i) => (
              <div key={i} className="text-slate-600">{info}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 