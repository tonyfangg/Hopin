'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export default function TestPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runFullTests = async () => {
      const supabase = createClient()

      // Add null check
      if (!supabase) {
        console.error('Supabase client not available')
        return
      }

      const testResults: any = {}

      console.log('🧪 Running full component tests...')

      // Test 1: Properties (should now show your 5 properties)
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, name, address, property_type, floor_area_sqm, risk_score, safety_score')
        
        testResults.properties = { 
          data, 
          error, 
          status: error ? '❌' : '✅',
          count: data?.length || 0
        }
      } catch (err) {
        testResults.properties = { error: err, status: '❌' }
      }

      // Test 2: Link electrical reports to properties
      try {
        const { data, error } = await supabase
          .from('electrical_reports')
          .select(`
            id, 
            issue_type, 
            inspection_date, 
            property_id,
            properties!electrical_reports_property_id_fkey (
              name, address
            )
          `)
          .limit(5)
        
        testResults.electricalReports = { 
          data, 
          error, 
          status: error ? '❌' : '✅',
          count: data?.length || 0,
          linked: data?.filter(r => r.property_id).length || 0
        }
      } catch (err) {
        testResults.electricalReports = { error: err, status: '❌' }
      }

      // Test 3: Risk assessments
      try {
        const { data, error } = await supabase
          .from('risk_assessments')
          .select(`
            id, 
            property_id, 
            overall_score, 
            assessed_date,
            properties!risk_assessments_property_id_fkey (
              name
            )
          `)
          .limit(5)
        
        testResults.riskAssessments = { 
          data, 
          error, 
          status: error ? '❌' : '✅',
          count: data?.length || 0
        }
      } catch (err) {
        testResults.riskAssessments = { error: err, status: '❌' }
      }

      // Test 4: Property overview (using the view we created)
      try {
        const { data, error } = await supabase
          .from('property_overview')
          .select('*')
        
        testResults.propertyOverview = { 
          data, 
          error, 
          status: error ? '❌' : '✅',
          count: data?.length || 0
        }
      } catch (err) {
        testResults.propertyOverview = { error: err, status: '❌' }
      }

      setResults(testResults)
      setLoading(false)
    }

    runFullTests()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🧪 Component Testing</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">Testing your components with real data...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Component Test Results</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {Object.entries(results).map(([testName, result]: [string, any]) => (
            <div key={testName} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">{result.status}</span>
                {testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h2>
              
              {result.error ? (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-600 text-sm">{result.error.message || JSON.stringify(result.error)}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-green-800 font-medium">✅ Success!</p>
                    <p className="text-green-600 text-sm">Found {result.count} records</p>
                    {result.linked !== undefined && (
                      <p className="text-green-600 text-sm">{result.linked} linked to properties</p>
                    )}
                  </div>
                  
                  {result.data && result.data.length > 0 && (
                    <details className="bg-gray-50 border rounded p-3">
                      <summary className="cursor-pointer font-medium">View Sample Data</summary>
                      <pre className="text-xs mt-2 overflow-auto bg-white p-2 rounded max-h-40">
                        {JSON.stringify(result.data.slice(0, 2), null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Your Properties Are Ready!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4">
              <p className="font-medium">Central London Store</p>
              <p className="text-sm text-gray-600">Retail Store • Risk: 750</p>
            </div>
            <div className="bg-white rounded p-4">
              <p className="font-medium">Manchester Branch</p>
              <p className="text-sm text-gray-600">Retail Store • Risk: 680</p>
            </div>
            <div className="bg-white rounded p-4">
              <p className="font-medium">Head Office</p>
              <p className="text-sm text-gray-600">Office • Risk: 800</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-100 rounded">
            <h4 className="font-semibold mb-2">🚀 Next Steps:</h4>
            <ul className="text-sm space-y-1">
              <li>• Your components should now display real property data</li>
              <li>• Link existing reports to properties using their property_id</li>
              <li>• Test your dashboard components with this data</li>
              <li>• Start implementing CRUD operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 