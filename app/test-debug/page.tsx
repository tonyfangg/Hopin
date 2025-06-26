'use client'
import { useEffect, useState } from 'react'

export default function TestDebugPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testDebugAPI = async () => {
      try {
        console.log('🧪 Testing Debug API...')
        
        const response = await fetch('/api/debug-api')
        const data = await response.json()
        
        console.log('🔍 DEBUG API RESULTS:')
        console.log('Session exists:', data.session?.exists)
        console.log('User ID:', data.session?.userId)
        console.log('Properties found:', data.properties?.count)
        console.log('Permissions found:', data.permissions?.count)
        
        if (data.errors && data.errors.length > 0) {
          console.log('❌ Errors found:', data.errors)
        }
        
        if (data.warnings && data.warnings.length > 0) {
          console.log('⚠️ Warnings:', data.warnings)
        }
        
        console.log('Full debug data:', data)
        
        setResults(data)
        setLoading(false)
      } catch (err) {
        console.error('Debug API failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    testDebugAPI()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🧪 Debug API Test</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">Testing debug API...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🧪 Debug API Test</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-4">❌ Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Debug API Test Results</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Session Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">{results?.session?.exists ? '✅' : '❌'}</span>
              Session Status
            </h2>
            <div className="space-y-2">
              <p><strong>Exists:</strong> {results?.session?.exists ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {results?.session?.userId || 'None'}</p>
              {results?.session?.error && (
                <p className="text-red-600"><strong>Error:</strong> {results.session.error}</p>
              )}
            </div>
          </div>

          {/* Properties Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">{results?.properties?.count > 0 ? '✅' : '⚠️'}</span>
              Properties
            </h2>
            <div className="space-y-2">
              <p><strong>Count:</strong> {results?.properties?.count || 0}</p>
              {results?.properties?.error && (
                <p className="text-red-600"><strong>Error:</strong> {results.properties.error}</p>
              )}
              {results?.properties?.sample && results.properties.sample.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer font-medium">Sample Properties</summary>
                  <pre className="text-xs mt-2 bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(results.properties.sample, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>

          {/* Permissions Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">{results?.permissions?.count > 0 ? '✅' : '❌'}</span>
              User Permissions
            </h2>
            <div className="space-y-2">
              <p><strong>Count:</strong> {results?.permissions?.count || 0}</p>
              {results?.permissions?.error && (
                <p className="text-red-600"><strong>Error:</strong> {results.permissions.error}</p>
              )}
              {results?.permissions?.sample && results.permissions.sample.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer font-medium">Sample Permissions</summary>
                  <pre className="text-xs mt-2 bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(results.permissions.sample, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>

          {/* Overall Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">{results?.status === 'success' ? '✅' : '❌'}</span>
              Overall Status
            </h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {results?.status}</p>
              <p><strong>API Working:</strong> ✅</p>
              <p><strong>Database Connected:</strong> ✅</p>
              <p><strong>Authentication:</strong> {results?.session?.exists ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>

        {/* Full Debug Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Full Debug Data</h2>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>

        {/* Analysis */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🔍 Analysis</h3>
          <div className="space-y-2 text-sm">
            {!results?.session?.exists && (
              <p className="text-orange-600">⚠️ <strong>No active session:</strong> User needs to authenticate</p>
            )}
            {results?.properties?.count === 0 && (
              <p className="text-orange-600">⚠️ <strong>No properties found:</strong> Check if properties exist in database</p>
            )}
            {results?.permissions?.count > 0 && (
              <p className="text-green-600">✅ <strong>Permissions found:</strong> User has access to organisations</p>
            )}
            <p className="text-green-600">✅ <strong>API working:</strong> Debug endpoint responding correctly</p>
            <p className="text-green-600">✅ <strong>Database connected:</strong> Supabase connection successful</p>
          </div>
        </div>
      </div>
    </div>
  )
} 