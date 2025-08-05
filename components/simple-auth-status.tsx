'use client'
import { useState } from 'react'

export function SimpleAuthStatus() {
  const [testResult, setTestResult] = useState<string>('')
  const [testing, setTesting] = useState(false)

  const testAuth = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/auth-debug', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestResult(`✅ Auth OK - Session: ${data.hasSession ? 'YES' : 'NO'} - User: ${data.sessionUser || 'None'}`)
      } else {
        setTestResult(`❌ Auth Failed - Status: ${response.status}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">🔍 Auth Status Test</span>
        <button 
          onClick={testAuth}
          disabled={testing}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Auth'}
        </button>
      </div>
      {testResult && (
        <div className="mt-2 text-sm font-mono bg-white p-2 rounded">
          {testResult}
        </div>
      )}
    </div>
  )
}