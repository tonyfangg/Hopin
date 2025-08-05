'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSupabase } from '@/lib/hooks/useSupabase'
import Button from '@/components/ui/button'

interface ScheduledTest {
  id: string
  property_name: string
  property_address: string
  test_type: string
  scheduled_date: string
  status: 'scheduled' | 'overdue' | 'completed'
  inspector: string
  priority: 'low' | 'medium' | 'high'
}

export default function SchedulePage() {
  const [scheduledTests, setScheduledTests] = useState<ScheduledTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = useSupabase()

  useEffect(() => {
    loadScheduledTests()
  }, [])

  const loadScheduledTests = async () => {
    try {
      setLoading(true)
      
      // Mock data for now - would typically come from database
      const mockScheduledTests: ScheduledTest[] = [
        {
          id: '1',
          property_name: 'Main Store',
          property_address: '123 High Street, London',
          test_type: 'PAT Testing',
          scheduled_date: '2024-01-15',
          status: 'scheduled',
          inspector: 'John Smith',
          priority: 'medium'
        },
        {
          id: '2',
          property_name: 'Branch Store',
          property_address: '456 Main Road, Manchester',
          test_type: 'Fixed Wire Testing',
          scheduled_date: '2024-01-10',
          status: 'overdue',
          inspector: 'Sarah Jones',
          priority: 'high'
        },
        {
          id: '3',
          property_name: 'Warehouse',
          property_address: '789 Industrial Estate, Birmingham',
          test_type: 'Emergency Lighting Test',
          scheduled_date: '2024-01-20',
          status: 'scheduled',
          inspector: 'Mike Wilson',
          priority: 'low'
        }
      ]

      setScheduledTests(mockScheduledTests)
    } catch (err) {
      console.error('Load scheduled tests error:', err)
      setError('Failed to load scheduled tests')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/electrical"
            className="text-slate-600 hover:text-slate-900 text-sm font-medium"
          >
            ← Back to Electrical Systems
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Testing Schedule</h1>
          <p className="text-slate-600 mt-1">Manage upcoming electrical safety tests and inspections</p>
        </div>
        <Link href="/dashboard/electrical/new-test">
          <Button className="bg-blue-600 hover:bg-blue-700">
            + Schedule New Test
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Scheduled Tests Grid */}
      <div className="grid gap-6">
        {scheduledTests.map((test) => (
          <div key={test.id} className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">{test.property_name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(test.priority)}`}>
                    {test.priority.charAt(0).toUpperCase() + test.priority.slice(1)} Priority
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-1">{test.property_address}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>🔧 {test.test_type}</span>
                  <span>📅 {new Date(test.scheduled_date).toLocaleDateString('en-GB')}</span>
                  <span>👤 {test.inspector}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Schedule
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700" 
                  size="sm"
                >
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {scheduledTests.length === 0 && !loading && (
        <div className="bg-slate-50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Tests Scheduled</h3>
          <p className="text-slate-600 mb-4">
            Schedule electrical safety tests and inspections for your properties.
          </p>
          <Link href="/dashboard/electrical/new-test">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Schedule First Test
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}