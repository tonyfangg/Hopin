'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSupabase } from '@/lib/hooks/useSupabase'
import Button from '@/components/ui/button'

interface ComplianceMetric {
  id: string
  category: string
  score: number
  status: 'compliant' | 'needs_attention' | 'non_compliant'
  lastUpdated: string
  nextReview: string
  details: string
}

interface ComplianceReport {
  overallScore: number
  totalProperties: number
  compliantProperties: number
  lastReportDate: string
  metrics: ComplianceMetric[]
}

export default function CompliancePage() {
  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = useSupabase()

  useEffect(() => {
    loadComplianceReport()
  }, [])

  const loadComplianceReport = async () => {
    try {
      setLoading(true)
      
      // Mock data for now - would typically come from database calculations
      const mockReport: ComplianceReport = {
        overallScore: 87,
        totalProperties: 12,
        compliantProperties: 10,
        lastReportDate: new Date().toISOString(),
        metrics: [
          {
            id: '1',
            category: 'PAT Testing',
            score: 92,
            status: 'compliant',
            lastUpdated: '2024-01-05',
            nextReview: '2024-07-05',
            details: 'All portable appliances tested within required timeframes'
          },
          {
            id: '2',
            category: 'Fixed Wire Testing',
            score: 78,
            status: 'needs_attention',
            lastUpdated: '2023-12-15',
            nextReview: '2024-02-15',
            details: '2 properties require updated fixed wire testing certificates'
          },
          {
            id: '3',
            category: 'Emergency Lighting',
            score: 95,
            status: 'compliant',
            lastUpdated: '2024-01-02',
            nextReview: '2024-04-02',
            details: 'All emergency lighting systems tested and functional'
          },
          {
            id: '4',
            category: 'Fire Alarm Systems',
            score: 85,
            status: 'compliant',
            lastUpdated: '2023-12-20',
            nextReview: '2024-03-20',
            details: 'Fire alarm systems meet current BS 5839 standards'
          },
          {
            id: '5',
            category: 'RCD Testing',
            score: 88,
            status: 'compliant',
            lastUpdated: '2024-01-08',
            nextReview: '2024-07-08',
            details: 'Residual Current Device testing completed across all sites'
          }
        ]
      }

      setReport(mockReport)
    } catch (err) {
      console.error('Load compliance report error:', err)
      setError('Failed to load compliance report')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200'
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'non_compliant': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/electrical"
          className="text-slate-600 hover:text-slate-900 text-sm font-medium"
        >
          ← Back to Electrical Systems
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Compliance Report</h1>
          <p className="text-slate-600 mt-1">Electrical safety compliance across all properties</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            📊 Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            🔄 Refresh Data
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {report && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <h3 className="font-semibold text-slate-900">Overall Score</h3>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                {report.overallScore}%
              </div>
              <p className="text-slate-500 text-sm">Compliance Rating</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏢</span>
                </div>
                <h3 className="font-semibold text-slate-900">Properties</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">{report.totalProperties}</div>
              <p className="text-slate-500 text-sm">Total Managed</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
                <h3 className="font-semibold text-slate-900">Compliant</h3>
              </div>
              <div className="text-3xl font-bold text-green-600">{report.compliantProperties}</div>
              <p className="text-slate-500 text-sm">
                {Math.round((report.compliantProperties / report.totalProperties) * 100)}% of Properties
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⚠️</span>
                </div>
                <h3 className="font-semibold text-slate-900">Attention Needed</h3>
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {report.totalProperties - report.compliantProperties}
              </div>
              <p className="text-slate-500 text-sm">Properties</p>
            </div>
          </div>

          {/* Compliance Metrics */}
          <div className="bg-white rounded-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-semibold text-slate-900">Compliance Categories</h2>
              <p className="text-slate-600 text-sm mt-1">
                Last updated: {new Date(report.lastReportDate).toLocaleDateString('en-GB')}
              </p>
            </div>
            
            <div className="divide-y divide-slate-100">
              {report.metrics.map((metric) => (
                <div key={metric.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{metric.category}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(metric.status)}`}>
                          {metric.status.replace('_', ' ').charAt(0).toUpperCase() + metric.status.replace('_', ' ').slice(1)}
                        </span>
                        <span className={`text-lg font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}%
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{metric.details}</p>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>Last Updated: {new Date(metric.lastUpdated).toLocaleDateString('en-GB')}</span>
                        <span>Next Review: {new Date(metric.nextReview).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {metric.status === 'needs_attention' && (
                        <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Actions */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                📄 Download PDF Report
              </Button>
              <Button variant="outline" className="justify-start">
                📧 Email to Stakeholders
              </Button>
              <Button variant="outline" className="justify-start">
                📋 Schedule Review Meeting
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}