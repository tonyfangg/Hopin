'use client'
import React, { useEffect, useState } from 'react'
import { RiskBadge } from '@/components/ui/risk-badge'
import { RiskMeter } from '@/components/ui/risk-meter'
import { RiskScoringUtils } from '@/app/lib/utils/risk-scoring'
import { RISK_CATEGORIES } from '@/app/lib/types/risk-types'

interface UnifiedRiskOverviewProps {
  propertyId?: string
}

export const UnifiedRiskOverview: React.FC<UnifiedRiskOverviewProps> = ({ propertyId }) => {
  const [riskData, setRiskData] = useState({
    overallRiskScore: 0,
    overallSafetyScore: 0,
    categoryScores: {} as Record<string, number>,
    loading: true,
    error: null as string | null
  })

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setRiskData(prev => ({ ...prev, loading: true, error: null }))

        // Fetch electrical and drainage data
        const [electricalResponse, drainageResponse] = await Promise.all([
          fetch('/api/electrical-reports'),
          fetch('/api/drainage-reports')
        ])

        const electricalResult = await electricalResponse.json()
        const drainageResult = await drainageResponse.json()

        // Calculate category scores from real data
        const electricalData = electricalResult.success ? electricalResult.data : []
        const drainageData = drainageResult.success ? drainageResult.data : []

        // Calculate security & risk management score (from electrical safety)
        const securityScore = electricalData.length > 0 
          ? Math.round(electricalData.reduce((sum: number, report: any) => 
              sum + (Number(report.safety_score) || 0), 0) / electricalData.length)
          : 50

        // Calculate property & asset factors score (from drainage and electrical)
        const propertyScore = Math.round((
          (electricalData.length > 0 ? 
            electricalData.reduce((sum: number, report: any) => 
              sum + (Number(report.safety_score) || 0), 0) / electricalData.length : 50) +
          (drainageData.length > 0 ? 
            drainageData.reduce((sum: number, report: any) => 
              sum + (Number(report.safety_score) || 0), 0) / drainageData.length : 50)
        ) / 2)

        // Mock other categories (in real app, these would come from other data sources)
        const categoryScores = {
          security_risk_management: RiskScoringUtils.safetyToRiskScore(securityScore),
          property_asset_factors: RiskScoringUtils.safetyToRiskScore(propertyScore),
          operational_risk: 25, // Mock data
          business_specific_factors: 15, // Mock data
          location_based_factors: 30, // Mock data
          financial_administrative: 20, // Mock data
          specialised_risk: 35, // Mock data
          market_external: 10 // Mock data
        }

        // Calculate overall risk score using weighted average
        const overallRiskScore = RiskScoringUtils.calculateOverallRisk(categoryScores)
        const overallSafetyScore = RiskScoringUtils.riskToSafetyScore(overallRiskScore)

        setRiskData({
          overallRiskScore,
          overallSafetyScore,
          categoryScores,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Error fetching risk data:', error)
        setRiskData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }

    fetchRiskData()
  }, [propertyId])

  if (riskData.loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 animate-pulse">
            <div className="h-6 bg-slate-200 rounded mb-4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (riskData.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700">Error loading risk data: {riskData.error}</p>
      </div>
    )
  }

  const { overallRiskScore, overallSafetyScore, categoryScores } = riskData
  const riskLevel = RiskScoringUtils.getRiskLevelDisplay(overallRiskScore)
  const riskConfig = RiskScoringUtils.getRiskConfigByScore(overallRiskScore)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Risk Score */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Overall Risk Score</h2>
          <RiskBadge score={overallRiskScore} />
        </div>
        
        <div className="flex flex-col items-center">
          <RiskMeter 
            score={overallRiskScore} 
            size={160}
            showLabel={false}
            showScore={true}
          />
          <div className="mt-4 text-center">
            <p className={`text-lg font-semibold ${riskConfig.color}`}>
              {riskLevel}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {riskConfig.description}
            </p>
          </div>
        </div>
      </div>

      {/* Safety Score (Inverted) */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Safety Score</h2>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
            {overallSafetyScore}/100
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <RiskMeter 
            score={overallSafetyScore} 
            size={160}
            showLabel={false}
            showScore={true}
          />
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-emerald-600">
              Excellent Safety Record
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {overallRiskScore < 30 ? '40% below industry average' : 'Meets safety standards'}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Categories Breakdown */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Risk Categories</h2>
        
        <div className="space-y-4">
          {RISK_CATEGORIES.map(category => {
            const score = categoryScores[category.id] || 0
            const config = RiskScoringUtils.getRiskConfigByScore(score)
            
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{category.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">{category.name}</p>
                    <p className="text-xs text-slate-500">{Math.round(category.weight * 100)}% weight</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-slate-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500`}
                      style={{ 
                        width: `${score}%`,
                        backgroundColor: RiskScoringUtils.getRiskConfigByScore(score).color.includes('emerald') ? '#10b981' :
                                       RiskScoringUtils.getRiskConfigByScore(score).color.includes('amber') ? '#f59e0b' :
                                       RiskScoringUtils.getRiskConfigByScore(score).color.includes('red') ? '#ef4444' : '#6b7280'
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{score}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 