'use client'

import { useState, useEffect } from 'react'

interface RiskData {
  properties: number
  electrical_reports: number
  drainage_reports: number
  electrical_satisfactory: number
  drainage_good: number
  overdue_inspections: number
  high_risk_items: number
}

export function RiskScoreCard() {
  const [riskData, setRiskData] = useState<RiskData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        // Fetch data from multiple endpoints to calculate risk
        const [statsResponse, electricalResponse, drainageResponse] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/electrical-reports'),
          fetch('/api/drainage-reports')
        ])

        const [statsData, electricalData, drainageData] = await Promise.all([
          statsResponse.json(),
          electricalResponse.json(),
          drainageResponse.json()
        ])

        // Calculate risk factors
        const electricalReports = electricalData.reports || []
        const drainageReports = drainageData.reports || []

        const electricalSatisfactory = electricalReports.filter(
          (r: any) => r.overall_condition === 'satisfactory'
        ).length

        const drainageGood = drainageReports.filter(
          (r: any) => r.drainage_condition === 'good' || r.drainage_condition === 'fair'
        ).length

        const highRiskElectrical = electricalReports.filter(
          (r: any) => r.risk_rating > 3 || r.overall_condition === 'unsatisfactory'
        ).length

        const highRiskDrainage = drainageReports.filter(
          (r: any) => r.risk_rating > 3 || r.drainage_condition === 'poor'
        ).length

        setRiskData({
          properties: statsData.properties || 0,
          electrical_reports: electricalReports.length,
          drainage_reports: drainageReports.length,
          electrical_satisfactory: electricalSatisfactory,
          drainage_good: drainageGood,
          overdue_inspections: statsData.overdue_inspections || 0,
          high_risk_items: highRiskElectrical + highRiskDrainage
        })

      } catch (err) {
        setError('Failed to calculate risk score')
        console.error('Risk calculation error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRiskData()
  }, [])

  // Calculate management score based on real data
  const calculateManagementScore = (data: RiskData): number => {
    if (data.properties === 0) return 500 // Base score for no properties

    let score = 600 // Base score

    // Electrical compliance bonus (up to +100 points)
    if (data.electrical_reports > 0) {
      const electricalRate = data.electrical_satisfactory / data.electrical_reports
      score += electricalRate * 100
    }

    // Drainage compliance bonus (up to +80 points)
    if (data.drainage_reports > 0) {
      const drainageRate = data.drainage_good / data.drainage_reports
      score += drainageRate * 80
    }

    // Property coverage bonus (up to +50 points)
    const totalReports = data.electrical_reports + data.drainage_reports
    if (data.properties > 0) {
      const coverageRate = Math.min(totalReports / (data.properties * 2), 1) // Expect 2 reports per property
      score += coverageRate * 50
    }

    // Penalties
    score -= data.overdue_inspections * 20 // -20 per overdue inspection
    score -= data.high_risk_items * 15 // -15 per high risk item

    // Cap between 300-850 (like credit scores)
    return Math.max(300, Math.min(850, Math.round(score)))
  }

  const getScoreGrade = (score: number): { grade: string; color: string; description: string } => {
    if (score >= 750) return { 
      grade: 'Excellent', 
      color: 'text-green-600', 
      description: 'Outstanding risk management' 
    }
    if (score >= 650) return { 
      grade: 'Good', 
      color: 'text-blue-600', 
      description: 'Good risk management practices' 
    }
    if (score >= 550) return { 
      grade: 'Fair', 
      color: 'text-yellow-600', 
      description: 'Adequate risk management' 
    }
    if (score >= 450) return { 
      grade: 'Poor', 
      color: 'text-orange-600', 
      description: 'Needs improvement' 
    }
    return { 
      grade: 'Very Poor', 
      color: 'text-red-600', 
      description: 'Immediate attention required' 
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-6 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
        <div className="h-4 bg-white/20 rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-8 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/20 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-8 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !riskData) {
    return (
      <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Risk Score Unavailable</h3>
            <p className="text-slate-200">Unable to calculate risk assessment</p>
          </div>
        </div>
        <p className="text-slate-200">
          {error || 'No data available for risk calculation'}
        </p>
      </div>
    )
  }

  const managementScore = calculateManagementScore(riskData)
  const scoreGrade = getScoreGrade(managementScore)

  // Calculate insurance impact estimate
  const baselineRisk = 100
  const riskReduction = Math.max(0, Math.min(40, (managementScore - 500) / 10))
  const insuranceImpact = Math.round(baselineRisk - riskReduction)

  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-base">🛡️</span>
        </div>
        <div>
          <h3 className="text-base font-semibold">Risk Management Score</h3>
          <p className="text-blue-100 text-xs">{scoreGrade.description}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold">{managementScore}</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/20 ${scoreGrade.color}`}>
            {scoreGrade.grade}
          </span>
        </div>
        <p className="text-blue-100 text-xs">
          Based on {riskData.electrical_reports + riskData.drainage_reports} inspections across {riskData.properties} properties
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <h4 className="text-blue-100 text-xs mb-1">Active Properties</h4>
          <div className="text-lg font-bold">{riskData.properties}</div>
          <p className="text-blue-200 text-xs">
            {riskData.properties > 0 ? 'Properties managed' : 'Add properties to start'}
          </p>
        </div>
        <div>
          <h4 className="text-blue-100 text-xs mb-1">Compliance Rate</h4>
          <div className="text-lg font-bold">
            {riskData.electrical_reports + riskData.drainage_reports > 0
              ? Math.round(((riskData.electrical_satisfactory + riskData.drainage_good) / 
                  (riskData.electrical_reports + riskData.drainage_reports)) * 100)
              : 0}%
          </div>
          <p className="text-blue-200 text-xs">
            {managementScore >= 650 ? 'Excellent for insurance' : 'Room for improvement'}
          </p>
        </div>
      </div>

      {riskData.overdue_inspections > 0 && (
        <div className="mt-3 p-2 bg-red-500/20 rounded-lg border border-red-400/30">
          <div className="flex items-center gap-1">
            <span className="text-red-300 text-xs">⚠️</span>
            <span className="text-red-100 font-medium text-xs">
              {riskData.overdue_inspections} overdue inspection{riskData.overdue_inspections > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {riskData.high_risk_items > 0 && (
        <div className="mt-2 p-2 bg-orange-500/20 rounded-lg border border-orange-400/30">
          <div className="flex items-center gap-1">
            <span className="text-orange-300 text-xs">🔥</span>
            <span className="text-orange-100 font-medium text-xs">
              {riskData.high_risk_items} high-risk item{riskData.high_risk_items > 1 ? 's' : ''} identified
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-blue-400/30">
        <p className="text-blue-100 text-xs">
          💡 <strong>Insurance Impact:</strong> May reduce risk by up to {Math.round(riskReduction)}%
        </p>
      </div>
    </div>
  )
} 