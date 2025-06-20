'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export function ElectricalSafety() {
  const [safetyChecks, setSafetyChecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('electrical_reports')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setSafetyChecks(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Electrical Safety Assessment</h3>
        <span className="text-sm text-slate-500">All categories monitored</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safetyChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">{check.icon || '🔌'}</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{check.category || check.type}</h4>
                <p className="text-sm text-slate-500">Last check: {check.lastCheck || check.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{check.score || check.safety_score}</div>
                <div className={`text-sm font-medium ${check.status === 'Excellent' ? 'text-green-500' : 'text-yellow-500'}`}>{check.status || check.status_text}</div>
              </div>
              <div className="w-2 h-8 rounded-full bg-slate-200">
                <div 
                  className={`w-2 rounded-full ${check.status === 'Excellent' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ height: `${check.score || check.safety_score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 