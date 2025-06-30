'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export function ElectricalMaintenance() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Add null check
    if (!supabase) {
      console.error('Supabase client not available')
      setError('Supabase client not available')
      setLoading(false)
      return
    }

    supabase
      .from('electrical_reports')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setTasks(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  // Example: filter tasks by status/type if your schema supports it
  const upcoming = tasks.filter(t => t.status === 'scheduled' || t.status === 'in_progress')
  const completed = tasks.filter(t => t.status === 'completed')

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Maintenance Schedule</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Upcoming Tasks</h4>
          <div className="space-y-3">
            {upcoming.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{task.type}</p>
                    <p className="text-sm text-slate-500">{task.property}</p>
                  </div>
                </div>
                <span className="text-sm text-yellow-600 font-medium">{task.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Completed This Month</h4>
          <div className="space-y-3">
            {completed.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">✅</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{task.type}</p>
                    <p className="text-sm text-slate-500">{task.property}</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Completed</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 