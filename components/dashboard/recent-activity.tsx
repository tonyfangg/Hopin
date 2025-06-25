'use client'

import { useState, useEffect } from 'react'

interface ActivityItem {
  id: string
  type: 'electrical_report' | 'drainage_report' | 'property_created' | 'document_uploaded'
  title: string
  description: string
  date: string
  property_name?: string
  status?: string
  icon: string
  color: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Fetch recent electrical reports
        const [electricalResponse, drainageResponse, propertiesResponse] = await Promise.all([
          fetch('/api/electrical-reports'),
          fetch('/api/drainage-reports'),
          fetch('/api/properties')
        ])

        const [electricalData, drainageData, propertiesData] = await Promise.all([
          electricalResponse.json(),
          drainageResponse.json(),
          propertiesResponse.json()
        ])

        const recentActivities: ActivityItem[] = []

        // Add electrical reports
        if (electricalData.reports) {
          electricalData.reports.slice(0, 3).forEach((report: any) => {
            recentActivities.push({
              id: `electrical-${report.id}`,
              type: 'electrical_report',
              title: `${report.inspection_type?.toUpperCase() || 'Electrical'} Inspection`,
              description: `${report.property?.name || 'Property'} - ${report.overall_condition}`,
              date: report.inspection_date || report.created_at,
              property_name: report.property?.name,
              status: report.overall_condition,
              icon: '⚡',
              color: report.overall_condition === 'satisfactory' ? 'text-green-600' : 'text-yellow-600'
            })
          })
        }

        // Add drainage reports
        if (drainageData.reports) {
          drainageData.reports.slice(0, 3).forEach((report: any) => {
            recentActivities.push({
              id: `drainage-${report.id}`,
              type: 'drainage_report',
              title: `Drainage ${report.inspection_type?.replace('_', ' ') || 'Inspection'}`,
              description: `${report.property?.name || 'Property'} - ${report.drainage_condition}`,
              date: report.inspection_date || report.created_at,
              property_name: report.property?.name,
              status: report.drainage_condition,
              icon: '💧',
              color: report.drainage_condition === 'good' ? 'text-blue-600' : 'text-yellow-600'
            })
          })
        }

        // Add recent properties
        if (propertiesData.properties) {
          propertiesData.properties.slice(0, 2).forEach((property: any) => {
            recentActivities.push({
              id: `property-${property.id}`,
              type: 'property_created',
              title: 'New Property Added',
              description: `${property.name} - ${property.organisation?.name}`,
              date: property.created_at,
              property_name: property.name,
              icon: '🏪',
              color: 'text-green-600'
            })
          })
        }

        // Sort by date (most recent first)
        recentActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setActivities(recentActivities.slice(0, 8)) // Show only the 8 most recent
      } catch (err) {
        setError('Failed to load recent activity')
        console.error('Recent activity error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
        <span className="text-sm text-slate-500">{activities.length} items</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h4 className="text-lg font-medium text-slate-900 mb-2">No Recent Activity</h4>
          <p className="text-slate-600">Start by adding properties and conducting inspections</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activity.color === 'text-green-600' ? 'bg-green-100' :
                activity.color === 'text-blue-600' ? 'bg-blue-100' :
                activity.color === 'text-yellow-600' ? 'bg-yellow-100' :
                'bg-slate-100'
              }`}>
                <span className="text-lg">{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-900 truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                    {formatDate(activity.date)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 truncate">
                  {activity.description}
                </p>
                {activity.status && (
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                    activity.status === 'satisfactory' || activity.status === 'good' 
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'unsatisfactory' || activity.status === 'poor'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
