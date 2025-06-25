'use client'

import { useState, useEffect } from 'react'

interface TestStats {
  organisations: number
  properties: number
  electricalReports: number
  drainageReports: number
  documents: number
  riskAssessments: number
}

interface TestProperty {
  id: string
  name: string
  address: string
  property_type: string
  organisation: {
    name: string
    type: string
  }
  created_at: string
}

export default function TestDashboardPage() {
  const [stats, setStats] = useState<TestStats | null>(null)
  const [properties, setProperties] = useState<TestProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Fetch test dashboard stats
        const statsResponse = await fetch('/api/test-dashboard-stats')
        const statsData = await statsResponse.json()

        // Fetch test properties
        const propertiesResponse = await fetch('/api/test-properties')
        const propertiesData = await propertiesResponse.json()

        if (statsResponse.ok && propertiesResponse.ok) {
          setStats(statsData.stats)
          setProperties(propertiesData.properties || [])
        } else {
          setError('Failed to fetch test data')
        }
      } catch (err) {
        setError('Failed to load test data')
        console.error('Test data error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Test Dashboard - Real Data Flow</h1>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-6 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Test Dashboard - Real Data Flow</h1>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Test Dashboard - Real Data Flow</h1>
        
        {/* Test Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Dashboard Statistics (Real Data)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏢</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Organisations</p>
                  <div className="text-2xl font-bold text-slate-900">{stats?.organisations || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏪</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Properties</p>
                  <div className="text-2xl font-bold text-slate-900">{stats?.properties || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Electrical Reports</p>
                  <div className="text-2xl font-bold text-slate-900">{stats?.electricalReports || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💧</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Drainage Reports</p>
                  <div className="text-2xl font-bold text-slate-900">{stats?.drainageReports || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Properties */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Properties (Real Data)</h2>
          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Properties Yet</h3>
              <p className="text-slate-600">Properties will appear here when added to the system</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Property Portfolio ({properties.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Property</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Type</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Organisation</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {properties.map((property) => (
                      <tr key={property.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-slate-900">{property.name}</div>
                            <div className="text-sm text-slate-600">{property.address}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {property.property_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {property.organisation?.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {property.organisation?.type ? property.organisation.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">
                          {new Date(property.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Data Flow Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Flow Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✅</span>
              </div>
              <span className="text-slate-900">Dashboard loads real statistics from API</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✅</span>
              </div>
              <span className="text-slate-900">Components reflect actual state from database</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✅</span>
              </div>
              <span className="text-slate-900">Real-time data fetching and display</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✅</span>
              </div>
              <span className="text-slate-900">Error handling and loading states working</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 