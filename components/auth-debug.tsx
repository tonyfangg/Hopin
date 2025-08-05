'use client'
import { useState, useEffect } from 'react'

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testAuth = async () => {
      try {
        // Test auth debug endpoint
        const response = await fetch('/api/auth-debug', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        setDebugInfo(data)
      } catch (error) {
        setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' })
      } finally {
        setLoading(false)
      }
    }

    testAuth()
  }, [])

  if (loading) {
    return <div className="bg-blue-50 p-4 rounded-lg">Loading auth debug...</div>
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-semibold mb-2">🔍 Authentication Debug</h3>
      <pre className="text-xs bg-white p-2 rounded overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}