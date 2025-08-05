'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface DrainageReport {
  id: string
  property_id: string
  property_name: string
  inspection_date: string
  drainage_condition: string
  blockages_found: boolean
  structural_issues: boolean
  flow_rate: string
  visual_condition: string
  risk_rating: number
  inspector_name: string
  urgent_action_required: boolean
  recommendations: string
  next_inspection_due: string
  created_at: string
}

interface Property {
  id: string
  name: string
  address: string
}

export default function DrainageHistoryPage() {
  const router = useRouter()
  const [reports, setReports] = useState<DrainageReport[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<DrainageReport | null>(null)
  const [dateRange, setDateRange] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties
        const propertiesResponse = await fetch('/api/properties')
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json()
          setProperties(propertiesData.properties || [])
        }

        // Fetch drainage reports (mock data for now)
        setReports([
          {
            id: '1',
            property_id: 'prop1',
            property_name: 'Main Store London',
            inspection_date: '2024-01-15',
            drainage_condition: 'good',
            blockages_found: false,
            structural_issues: false,
            flow_rate: 'excellent',
            visual_condition: 'good',
            risk_rating: 2,
            inspector_name: 'John Smith',
            urgent_action_required: false,
            recommendations: 'Continue regular maintenance schedule. No immediate actions required.',
            next_inspection_due: '2024-07-15',
            created_at: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            property_id: 'prop1',
            property_name: 'Main Store London',
            inspection_date: '2023-07-10',
            drainage_condition: 'fair',
            blockages_found: true,
            structural_issues: false,
            flow_rate: 'adequate',
            visual_condition: 'fair',
            risk_rating: 3,
            inspector_name: 'Sarah Johnson',
            urgent_action_required: false,
            recommendations: 'Minor blockage cleared during inspection. Schedule deep cleaning in 3 months.',
            next_inspection_due: '2024-01-10',
            created_at: '2023-07-10T14:20:00Z'
          },
          {
            id: '3',
            property_id: 'prop2',
            property_name: 'Branch Store Manchester',
            inspection_date: '2024-01-20',
            drainage_condition: 'excellent',
            blockages_found: false,
            structural_issues: false,
            flow_rate: 'excellent',
            visual_condition: 'excellent',
            risk_rating: 1,
            inspector_name: 'Mike Wilson',
            urgent_action_required: false,
            recommendations: 'Excellent condition. Maintain current cleaning schedule.',
            next_inspection_due: '2024-07-20',
            created_at: '2024-01-20T09:15:00Z'
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'fair': return 'bg-yellow-100 text-yellow-800'
      case 'poor': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (rating: number) => {
    if (rating <= 2) return 'bg-green-100 text-green-800'
    if (rating <= 3) return 'bg-yellow-100 text-yellow-800'
    if (rating <= 4) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const filteredReports = reports.filter(report => {
    if (selectedProperty !== 'all' && report.property_id !== selectedProperty) return false
    
    if (dateRange !== 'all') {
      const reportDate = new Date(report.inspection_date)
      const now = new Date()
      
      switch (dateRange) {
        case '30days':
          return (now.getTime() - reportDate.getTime()) <= (30 * 24 * 60 * 60 * 1000)
        case '90days':
          return (now.getTime() - reportDate.getTime()) <= (90 * 24 * 60 * 60 * 1000)
        case '1year':
          return (now.getTime() - reportDate.getTime()) <= (365 * 24 * 60 * 60 * 1000)
        default:
          return true
      }
    }
    
    return true
  })

  const generateReport = () => {
    // In a real app, this would generate a PDF report
    const reportData = {
      properties: properties.length,
      totalReports: filteredReports.length,
      averageRisk: filteredReports.reduce((acc, r) => acc + r.risk_rating, 0) / filteredReports.length || 0,
      urgentActions: filteredReports.filter(r => r.urgent_action_required).length,
      blockagesFound: filteredReports.filter(r => r.blockages_found).length,
      structuralIssues: filteredReports.filter(r => r.structural_issues).length
    }
    
    console.log('Generated report data:', reportData)
    alert('Report generated! Check console for data (in real app, this would download a PDF)')
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Drainage Inspection History</h1>
          <p className="text-sm sm:text-base text-slate-600">View and analyze drainage inspection reports over time</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={generateReport}
            className="min-h-[44px] touch-manipulation"
          >
            📊 Generate Report
          </Button>
          <Button
            onClick={() => router.push('/dashboard/drainage/new-report')}
            className="bg-blue-600 hover:bg-blue-700 min-h-[44px] touch-manipulation"
          >
            + New Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Property
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Properties</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-slate-600">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-semibold text-slate-900">Total Reports</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900">{filteredReports.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-semibold text-slate-900">Avg Risk Rating</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {filteredReports.length > 0 
              ? (filteredReports.reduce((acc, r) => acc + r.risk_rating, 0) / filteredReports.length).toFixed(1)
              : '0'}/5
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🚫</span>
            <h3 className="font-semibold text-slate-900">Blockages Found</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {filteredReports.filter(r => r.blockages_found).length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔧</span>
            <h3 className="font-semibold text-slate-900">Urgent Actions</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {filteredReports.filter(r => r.urgent_action_required).length}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Inspection Reports</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Issues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Inspector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {report.property_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(report.inspection_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(report.drainage_condition)}`}>
                      {report.drainage_condition.charAt(0).toUpperCase() + report.drainage_condition.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(report.risk_rating)}`}>
                      {report.risk_rating}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex gap-1">
                      {report.blockages_found && <span title="Blockages found">🚫</span>}
                      {report.structural_issues && <span title="Structural issues">🏗️</span>}
                      {report.urgent_action_required && <span title="Urgent action required">⚠️</span>}
                      {!report.blockages_found && !report.structural_issues && !report.urgent_action_required && <span>✅</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {report.inspector_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-slate-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Reports Found</h3>
            <p className="text-slate-600 mb-4">
              No drainage inspection reports match your current filters.
            </p>
            <Button
              onClick={() => router.push('/dashboard/drainage/new-report')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create First Report
            </Button>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Drainage Report Details - {selectedReport.property_name}
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Inspection Date</label>
                  <p className="text-slate-900">{new Date(selectedReport.inspection_date).toLocaleDateString('en-GB')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Inspector</label>
                  <p className="text-slate-900">{selectedReport.inspector_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Overall Condition</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(selectedReport.drainage_condition)}`}>
                    {selectedReport.drainage_condition.charAt(0).toUpperCase() + selectedReport.drainage_condition.slice(1)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Risk Rating</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(selectedReport.risk_rating)}`}>
                    {selectedReport.risk_rating}/5
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Flow Rate</label>
                  <p className="text-slate-900 capitalize">{selectedReport.flow_rate}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Visual Condition</label>
                  <p className="text-slate-900 capitalize">{selectedReport.visual_condition}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Issues Found</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={selectedReport.blockages_found ? 'text-red-600' : 'text-green-600'}>
                        {selectedReport.blockages_found ? '❌' : '✅'}
                      </span>
                      <span>Blockages {selectedReport.blockages_found ? 'found' : 'not found'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={selectedReport.structural_issues ? 'text-red-600' : 'text-green-600'}>
                        {selectedReport.structural_issues ? '❌' : '✅'}
                      </span>
                      <span>Structural issues {selectedReport.structural_issues ? 'found' : 'not found'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={selectedReport.urgent_action_required ? 'text-red-600' : 'text-green-600'}>
                        {selectedReport.urgent_action_required ? '⚠️' : '✅'}
                      </span>
                      <span>Urgent action {selectedReport.urgent_action_required ? 'required' : 'not required'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Next Inspection Due</label>
                  <p className="text-slate-900">{new Date(selectedReport.next_inspection_due).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Recommendations</label>
              <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{selectedReport.recommendations}</p>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedReport(null)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // In real app, this would download the report as PDF
                  console.log('Downloading report:', selectedReport)
                  alert('Report download started (mock)')
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                📄 Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}