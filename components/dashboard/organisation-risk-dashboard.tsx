// =====================================================
// ORGANISATION RISK DASHBOARD COMPONENT
// File: components/dashboard/organisation-risk-dashboard.tsx
// =====================================================

'use client'
import { useState, useEffect } from 'react'

interface OrganisationRiskData {
  organisation: {
    id: string
    name: string
    type: string
    address: string
  }
  riskOverview: {
    averageScore: number
    highestRisk: string
    lowestRisk: string
    riskDistribution: {
      LOW: number
      MEDIUM: number
      HIGH: number
      CRITICAL: number
    }
  }
  properties: Array<{
    propertyId: string
    propertyName: string
    overallScore: number
    riskLevel: string
    breakdown: any[]
  }>
  riskMatrix: {
    categories: string[]
    properties: Array<{
      propertyId: string
      propertyName: string
      categoryScores: number[]
    }>
  }
  actionItems: Array<{
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM'
    propertyCount: number
    title: string
    description: string
    affectedProperties: string[]
  }>
}

export function OrganisationRiskDashboard({ organisationId }: { organisationId: string }) {
  const [riskData, setRiskData] = useState<OrganisationRiskData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  useEffect(() => {
    loadOrganisationRiskData()
  }, [organisationId])

  const loadOrganisationRiskData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/organisations/${organisationId}/risk`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load organisation risk data')
      }
      
      setRiskData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organisation risk data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-red-200">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Error</div>
          <p className="text-red-800 mb-4">{error}</p>
          <button 
            onClick={loadOrganisationRiskData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!riskData) return null

  const { organisation, riskOverview, properties, riskMatrix, actionItems } = riskData

  return (
    <div className="space-y-6">
      {/* Organisation Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{organisation.name}</h2>
            <p className="text-slate-600">{organisation.address}</p>
            <p className="text-sm text-slate-500">Type: {organisation.type}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(riskOverview.averageScore)}
            </div>
            <div className="text-sm text-slate-600">Portfolio Risk Score</div>
          </div>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RiskOverviewCard
            title="Total Properties"
            value={properties.length}
            icon="🏢"
            color="blue"
          />
          <RiskOverviewCard
            title="Critical Risk"
            value={riskOverview.riskDistribution.CRITICAL || 0}
            icon="🔴"
            color="red"
          />
          <RiskOverviewCard
            title="High Risk"
            value={riskOverview.riskDistribution.HIGH || 0}
            icon="🟠"
            color="orange"
          />
          <RiskOverviewCard
            title="Low Risk"
            value={riskOverview.riskDistribution.LOW || 0}
            icon="🟢"
            color="green"
          />
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Risk Distribution</h3>
        <RiskDistributionChart distribution={riskOverview.riskDistribution} />
      </div>

      {/* Properties Risk Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Properties Risk Overview</h3>
        <PropertiesRiskTable 
          properties={properties}
          onPropertySelect={setSelectedProperty}
          selectedProperty={selectedProperty}
        />
      </div>

      {/* Risk Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Risk Matrix by Category</h3>
        <RiskMatrix riskMatrix={riskMatrix} />
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Priority Action Items</h3>
        <div className="space-y-4">
          {actionItems.map((item, index) => (
            <ActionItemCard key={index} actionItem={item} />
          ))}
        </div>
      </div>

      {/* Portfolio Insights */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Portfolio Insights</h3>
        <PortfolioInsights 
          properties={properties}
          riskOverview={riskOverview}
        />
      </div>
    </div>
  )
}

// Risk Overview Card Component
function RiskOverviewCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string
  value: number
  icon: string
  color: string 
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50',
    green: 'text-green-600 bg-green-50'
  }

  return (
    <div className="text-center p-4 border border-slate-200 rounded-lg">
      <div className={`text-2xl mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-600">{title}</div>
    </div>
  )
}

// Risk Distribution Chart Component
function RiskDistributionChart({ distribution }: { distribution: any }) {
  const total = Object.values(distribution).reduce((sum: number, count: any) => sum + count, 0)
  
  if (total === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No risk data available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {Object.entries(distribution).map(([level, count]) => {
          const percentage = total > 0 ? ((count as number) / total) * 100 : 0
          return (
            <div key={level} className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">{level}</span>
                <span className="text-slate-600">{count}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${getRiskLevelBarColor(level)}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Properties Risk Table Component
function PropertiesRiskTable({ 
  properties, 
  onPropertySelect, 
  selectedProperty 
}: { 
  properties: any[]
  onPropertySelect: (propertyId: string) => void
  selectedProperty: string | null
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Property</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Risk Score</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Risk Level</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr 
              key={property.propertyId} 
              className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                selectedProperty === property.propertyId ? 'bg-blue-50' : ''
              }`}
              onClick={() => onPropertySelect(property.propertyId)}
            >
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium text-slate-900">{property.propertyName}</div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className={`text-lg font-bold ${getRiskLevelColor(property.riskLevel)}`}>
                  {Math.round(property.overallScore)}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className={`px-2 py-1 rounded text-sm font-medium ${getRiskLevelBadgeColor(property.riskLevel)}`}>
                  {property.riskLevel}
                </div>
              </td>
              <td className="py-3 px-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Risk Matrix Component
function RiskMatrix({ riskMatrix }: { riskMatrix: any }) {
  if (!riskMatrix.categories?.length || !riskMatrix.properties?.length) {
    return (
      <div className="text-center py-8 text-slate-500">
        No risk matrix data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-slate-200">
        <thead>
          <tr className="bg-slate-50">
            <th className="border border-slate-200 p-3 text-left font-semibold text-slate-900">
              Property
            </th>
            {riskMatrix.categories.map((category: string) => (
              <th key={category} className="border border-slate-200 p-3 text-center font-semibold text-slate-900">
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {riskMatrix.properties.map((property: any) => (
            <tr key={property.propertyId}>
              <td className="border border-slate-200 p-3 font-medium text-slate-900">
                {property.propertyName}
              </td>
              {property.categoryScores.map((score: number, index: number) => (
                <td key={index} className="border border-slate-200 p-3 text-center">
                  <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${getScoreColor(score)}`}>
                    {Math.round(score)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Action Item Card Component
function ActionItemCard({ actionItem }: { actionItem: any }) {
  const priorityColors = {
    CRITICAL: 'border-red-300 bg-red-50',
    HIGH: 'border-orange-300 bg-orange-50',
    MEDIUM: 'border-yellow-300 bg-yellow-50'
  }

  const priorityIcons = {
    CRITICAL: '🔴',
    HIGH: '🟠',
    MEDIUM: '🟡'
  }

  return (
    <div className={`p-4 rounded-lg border ${priorityColors[actionItem.priority]}`}>
      <div className="flex items-start space-x-3">
        <div className="text-xl">{priorityIcons[actionItem.priority]}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900">{actionItem.title}</h4>
            <div className="text-sm text-slate-600">
              {actionItem.propertyCount} properties affected
            </div>
          </div>
          <p className="text-sm text-slate-700 mb-3">{actionItem.description}</p>
          <div className="text-xs text-slate-500">
            Affected Properties: {actionItem.affectedProperties.slice(0, 3).join(', ')}
            {actionItem.affectedProperties.length > 3 && '...'}
          </div>
        </div>
      </div>
    </div>
  )
}

// Portfolio Insights Component
function PortfolioInsights({ properties, riskOverview }: { properties: any[], riskOverview: any }) {
  const highestRiskProperty = properties.find(p => p.propertyId === riskOverview.highestRisk)
  const lowestRiskProperty = properties.find(p => p.propertyId === riskOverview.lowestRisk)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-3">Highest Risk Property</h4>
        {highestRiskProperty ? (
          <div>
            <div className="text-lg font-bold text-red-600 mb-1">
              {highestRiskProperty.propertyName}
            </div>
            <div className="text-sm text-slate-600">
              Risk Score: {Math.round(highestRiskProperty.overallScore)} ({highestRiskProperty.riskLevel})
            </div>
          </div>
        ) : (
          <div className="text-slate-500">No data available</div>
        )}
      </div>

      <div className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-3">Lowest Risk Property</h4>
        {lowestRiskProperty ? (
          <div>
            <div className="text-lg font-bold text-green-600 mb-1">
              {lowestRiskProperty.propertyName}
            </div>
            <div className="text-sm text-slate-600">
              Risk Score: {Math.round(lowestRiskProperty.overallScore)} ({lowestRiskProperty.riskLevel})
            </div>
          </div>
        ) : (
          <div className="text-slate-500">No data available</div>
        )}
      </div>
    </div>
  )
}

// Helper Functions
function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'LOW': return 'text-green-600'
    case 'MEDIUM': return 'text-yellow-600'
    case 'HIGH': return 'text-orange-600'
    case 'CRITICAL': return 'text-red-600'
    default: return 'text-slate-600'
  }
}

function getRiskLevelBadgeColor(level: string): string {
  switch (level) {
    case 'LOW': return 'bg-green-100 text-green-800'
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
    case 'HIGH': return 'bg-orange-100 text-orange-800'
    case 'CRITICAL': return 'bg-red-100 text-red-800'
    default: return 'bg-slate-100 text-slate-800'
  }
}

function getRiskLevelBarColor(level: string): string {
  switch (level) {
    case 'LOW': return 'bg-green-500'
    case 'MEDIUM': return 'bg-yellow-500'
    case 'HIGH': return 'bg-orange-500'
    case 'CRITICAL': return 'bg-red-500'
    default: return 'bg-slate-500'
  }
}

function getScoreColor(score: number): string {
  if (score <= 25) return 'bg-green-100 text-green-800'
  if (score <= 50) return 'bg-yellow-100 text-yellow-800'
  if (score <= 75) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
} 