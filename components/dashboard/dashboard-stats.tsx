'use client'

import { useState, useEffect } from 'react'

interface DashboardStatsData {
  organisations: number
  properties: number
  electrical_reports: number
  drainage_reports: number
  risk_assessments: number
  documents: number
  expiring_documents: number
  overdue_inspections: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()

        if (response.ok) {
          setStats(data)
        } else {
          setError(data.error || 'Failed to fetch statistics')
        }
      } catch (err) {
        setError('Failed to load dashboard statistics')
        console.error('Dashboard stats error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
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
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-600">Error loading dashboard statistics: {error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <p className="text-slate-600">No statistics available</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Organisations',
      value: stats.organisations,
      icon: '🏢',
      color: 'bg-blue-100',
      description: 'Active organisations'
    },
    {
      title: 'Properties',
      value: stats.properties,
      icon: '🏪',
      color: 'bg-green-100',
      description: 'Total properties'
    },
    {
      title: 'Electrical Reports',
      value: stats.electrical_reports,
      icon: '⚡',
      color: 'bg-yellow-100',
      description: 'Last 30 days'
    },
    {
      title: 'Drainage Reports',
      value: stats.drainage_reports,
      icon: '💧',
      color: 'bg-cyan-100',
      description: 'Last 30 days'
    },
    {
      title: 'Risk Assessments',
      value: stats.risk_assessments,
      icon: '🛡️',
      color: 'bg-purple-100',
      description: 'Total assessments'
    },
    {
      title: 'Documents',
      value: stats.documents,
      icon: '📄',
      color: 'bg-indigo-100',
      description: 'Active documents'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiring_documents,
      icon: '⚠️',
      color: 'bg-orange-100',
      description: 'Next 30 days',
      urgent: stats.expiring_documents > 0
    },
    {
      title: 'Overdue Inspections',
      value: stats.overdue_inspections,
      icon: '🔴',
      color: 'bg-red-100',
      description: 'Require attention',
      urgent: stats.overdue_inspections > 0
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow ${
            stat.urgent ? 'ring-2 ring-red-200' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${
                  stat.urgent ? 'text-red-600' : 'text-slate-900'
                }`}>
                  {stat.value}
                </span>
                {stat.urgent && stat.value > 0 && (
                  <span className="text-xs text-red-500 font-medium">!</span>
                )}
              </div>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 