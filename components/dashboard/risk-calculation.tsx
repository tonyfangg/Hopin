// =====================================================
// RISK CALCULATION DASHBOARD COMPONENT
// File: components/dashboard/risk-calculation.tsx
// =====================================================

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'

interface RiskAssessment {
  propertyId: string
  overallScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  breakdown: RiskCategoryScore[]
  assessmentDate: string
}

interface RiskCategoryScore {
  categoryId: string
  categoryName: string
  score: number
  weightedContribution: number
  factors: RiskFactorScore[]
}

interface RiskFactorScore {
  factorId: string
  factorName: string
  normalizedScore: number
  weight: number
  contribution: number
}

export function RiskCalculationDashboard({ propertyId }: { propertyId: string }) {
  const [riskData, setRiskData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRiskData()
  }, [propertyId])

  const loadRiskData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/properties/${propertyId}/risk`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load risk data')
      }
      
      setRiskData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load risk data')
    } finally {
      setLoading(false)
    }
  }

  const recalculateRisk = async (overrides?: any) => {
    try {
      setCalculating(true)
      setError(null)
      
      const response = await fetch('/api/risk-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate_property',
          propertyId,
          overrides
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Risk calculation failed')
      }
      
      // Reload the full dashboard data
      await loadRiskData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Risk calculation failed')
    } finally {
      setCalculating(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
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
            onClick={loadRiskData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { property, currentAssessment, history, riskTrend, recommendations } = riskData

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{property?.name}</h2>
            <p className="text-slate-600">{property?.address}</p>
          </div>
          <button
            onClick={() => recalculateRisk()}
            disabled={calculating}
            className={`px-4 py-2 rounded-lg font-medium ${
              calculating 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {calculating ? '🔄 Calculating...' : '🔄 Recalculate Risk'}
          </button>
        </div>

        {/* Overall Risk Score */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getRiskLevelColor(currentAssessment?.riskLevel)}`}>
              {Math.round(currentAssessment?.overallScore || 0)}
            </div>
            <div className="text-sm text-slate-600">Overall Risk Score</div>
            <div className={`text-sm font-medium ${getRiskLevelColor(currentAssessment?.riskLevel)}`}>
              {currentAssessment?.riskLevel}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {property?.safety_score || 0}
            </div>
            <div className="text-sm text-slate-600">Safety Score</div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${getTrendColor(riskTrend?.direction)}`}>
              {riskTrend?.direction === 'improving' ? '📈' : 
               riskTrend?.direction === 'deteriorating' ? '📉' : '➡️'}
            </div>
            <div className="text-sm text-slate-600">30-Day Trend</div>
            <div className={`text-sm font-medium ${getTrendColor(riskTrend?.direction)}`}>
              {riskTrend?.direction}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-slate-700 mb-2">
              {recommendations?.length || 0}
            </div>
            <div className="text-sm text-slate-600">Action Items</div>
          </div>
        </div>
      </div>

      {/* Risk Category Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Risk Category Breakdown</h3>
        <div className="space-y-4">
          {currentAssessment?.breakdown?.map((category: RiskCategoryScore) => (
            <RiskCategoryCard key={category.categoryId} category={category} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Priority Recommendations</h3>
        <div className="space-y-4">
          {recommendations?.map((rec: any, index: number) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Risk History Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Risk History</h3>
        <RiskHistoryChart history={history} />
      </div>

      {/* Advanced Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Advanced Risk Analysis</h3>
        <AdvancedRiskControls 
          propertyId={propertyId} 
          onRecalculate={recalculateRisk}
          currentAssessment={currentAssessment}
        />
      </div>
    </div>
  )
}

// Risk Category Card Component
function RiskCategoryCard({ category }: { category: RiskCategoryScore }) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className="border border-slate-200 rounded-lg">
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-slate-900">
              {category.categoryName}
            </div>
            <div className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(category.score)}`}>
              {Math.round(category.score)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-slate-600">
              Weight: {Math.round(category.weightedContribution * 100) / 100}%
            </div>
            <div className="text-slate-400">
              {expanded ? '▼' : '▶'}
            </div>
          </div>
        </div>
        
        {/* Risk Score Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(category.score)}`}
              style={{ width: `${category.score}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expanded Factor Details */}
      {expanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="space-y-3">
            {category.factors?.map((factor: RiskFactorScore) => (
              <div key={factor.factorId} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700">
                    {factor.factorName}
                  </div>
                  <div className="text-xs text-slate-500">
                    Weight: {Math.round(factor.weight * 100)}% | 
                    Contribution: {Math.round(factor.contribution * 100) / 100}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(factor.normalizedScore)}`}>
                  {Math.round(factor.normalizedScore)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Recommendation Card Component
function RecommendationCard({ recommendation }: { recommendation: any }) {
  const priorityColors = {
    HIGH: 'border-red-200 bg-red-50',
    MEDIUM: 'border-yellow-200 bg-yellow-50',
    LOW: 'border-green-200 bg-green-50'
  }

  const priorityTextColors = {
    HIGH: 'text-red-800',
    MEDIUM: 'text-yellow-800',
    LOW: 'text-green-800'
  }

  return (
    <div className={`p-4 rounded-lg border ${priorityColors[recommendation.priority]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-semibold text-slate-900">{recommendation.title}</div>
          <div className="text-sm text-slate-600 mt-1">{recommendation.description}</div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${priorityTextColors[recommendation.priority]}`}>
          {recommendation.priority}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Category: {recommendation.category}</span>
        <span>Est. Impact: -{Math.round(recommendation.estimatedImpact * 100) / 100} points</span>
      </div>
    </div>
  )
}

// Risk History Chart Component
function RiskHistoryChart({ history }: { history: any[] }) {
  if (!history?.length) {
    return (
      <div className="text-center py-8 text-slate-500">
        No historical data available
      </div>
    )
  }

  const maxScore = Math.max(...history.map(h => h.overall_score || 0))
  const minScore = Math.min(...history.map(h => h.overall_score || 0))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Risk Score Over Time</span>
        <span>Range: {Math.round(minScore)} - {Math.round(maxScore)}</span>
      </div>
      
      <div className="relative h-48 border border-slate-200 rounded bg-slate-50">
        <svg className="w-full h-full p-4">
          {/* Simple line chart representation */}
          {history.slice(0, 10).reverse().map((item, index, arr) => {
            const x = (index / (arr.length - 1)) * 100
            const y = 100 - ((item.overall_score || 0) / 100) * 100
            
            return (
              <g key={index}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="#3b82f6"
                  className="hover:r-4"
                />
                {index > 0 && (
                  <line
                    x1={`${((index - 1) / (arr.length - 1)) * 100}%`}
                    y1={`${100 - ((arr[index - 1].overall_score || 0) / 100) * 100}%`}
                    x2={`${x}%`}
                    y2={`${y}%`}
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// Advanced Risk Controls Component
function AdvancedRiskControls({ 
  propertyId, 
  onRecalculate, 
  currentAssessment 
}: { 
  propertyId: string
  onRecalculate: (overrides?: any) => Promise<void>
  currentAssessment: any 
}) {
  const [overrides, setOverrides] = useState<any>({})
  const [showOverrides, setShowOverrides] = useState(false)

  const handleOverrideChange = (key: string, value: number) => {
    setOverrides(prev => ({ ...prev, [key]: value }))
  }

  const applyOverrides = () => {
    onRecalculate(overrides)
  }

  const resetOverrides = () => {
    setOverrides({})
    onRecalculate()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowOverrides(!showOverrides)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {showOverrides ? 'Hide' : 'Show'} Manual Overrides
        </button>
        
        {Object.keys(overrides).length > 0 && (
          <div className="space-x-2">
            <button
              onClick={applyOverrides}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Apply Overrides
            </button>
            <button
              onClick={resetOverrides}
              className="px-3 py-1 bg-slate-600 text-white rounded text-sm hover:bg-slate-700"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {showOverrides && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OverrideControl
              label="Fire Alarm Compliance"
              value={overrides.fireAlarmCompliance || 90}
              onChange={(value) => handleOverrideChange('fireAlarmCompliance', value)}
            />
            <OverrideControl
              label="Staff Training Score"
              value={overrides.trainedStaff || 15}
              onChange={(value) => handleOverrideChange('trainedStaff', value)}
            />
            <OverrideControl
              label="Cybersecurity Score"
              value={overrides.cybersecurityScore || 60}
              onChange={(value) => handleOverrideChange('cybersecurityScore', value)}
            />
            <OverrideControl
              label="Building Condition"
              value={overrides.buildingAge || 15}
              onChange={(value) => handleOverrideChange('buildingAge', value)}
            />
          </div>
        </div>
      )}

      {/* Risk Simulation */}
      <div className="border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-3">Risk Simulation</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-green-600 font-bold">Best Case</div>
            <div>Risk Score: {Math.round((currentAssessment?.overallScore || 0) * 0.7)}</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-bold">Current</div>
            <div>Risk Score: {Math.round(currentAssessment?.overallScore || 0)}</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-bold">Worst Case</div>
            <div>Risk Score: {Math.round((currentAssessment?.overallScore || 0) * 1.3)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Override Control Component
function OverrideControl({ 
  label, 
  value, 
  onChange 
}: { 
  label: string
  value: number
  onChange: (value: number) => void 
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>0</span>
        <span className="font-medium">{value}</span>
        <span>100</span>
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

function getTrendColor(direction: string): string {
  switch (direction) {
    case 'improving': return 'text-green-600'
    case 'deteriorating': return 'text-red-600'
    default: return 'text-slate-600'
  }
}

function getScoreColor(score: number): string {
  if (score <= 25) return 'bg-green-100 text-green-800'
  if (score <= 50) return 'bg-yellow-100 text-yellow-800'
  if (score <= 75) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

function getScoreBarColor(score: number): string {
  if (score <= 25) return 'bg-green-500'
  if (score <= 50) return 'bg-yellow-500'
  if (score <= 75) return 'bg-orange-500'
  return 'bg-red-500'
} 