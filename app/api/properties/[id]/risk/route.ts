// =====================================================
// PROPERTY RISK DASHBOARD API
// File: app/api/properties/[id]/risk/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { RiskCalculationDatabaseIntegration } from '@/app/lib/risk-calculation/database-integration'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const propertyId = params.id

    // Get current risk assessment
    const currentAssessment = await RiskCalculationDatabaseIntegration.calculateAndStorePropertyRisk(propertyId)
    
    // Get risk history
    const history = await RiskCalculationDatabaseIntegration.getPropertyRiskHistory(propertyId)
    
    // Get property details for context
    const { data: property } = await supabase
      .from('properties')
      .select(`
        id,
        name,
        address,
        property_type,
        floor_area_sqm,
        building_age_years,
        risk_score,
        safety_score,
        organisations!properties_organisation_id_fkey (name)
      `)
      .eq('id', propertyId)
      .single()

    return NextResponse.json({
      property,
      currentAssessment,
      history: history.slice(0, 10), // Last 10 assessments
      riskTrend: calculateRiskTrend(history),
      recommendations: generateRiskRecommendations(currentAssessment)
    })

  } catch (error) {
    console.error('Property risk dashboard error:', error)
    return NextResponse.json({ 
      error: 'Failed to load risk dashboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function calculateRiskTrend(history: any[]): {
  direction: 'improving' | 'stable' | 'deteriorating',
  change: number,
  period: string
} {
  if (!history || history.length < 2) {
    return { direction: 'stable', change: 0, period: 'insufficient_data' }
  }

  const recent = history[0]?.overall_score || 0
  const previous = history[1]?.overall_score || 0
  const change = recent - previous

  let direction: 'improving' | 'stable' | 'deteriorating' = 'stable'
  if (Math.abs(change) > 5) {
    direction = change < 0 ? 'improving' : 'deteriorating'
  }

  return {
    direction,
    change: Math.round(change * 100) / 100,
    period: '30_days'
  }
}

function generateRiskRecommendations(assessment: any): Array<{
  category: string,
  priority: 'HIGH' | 'MEDIUM' | 'LOW',
  title: string,
  description: string,
  estimatedImpact: number
}> {
  const recommendations: Array<{
    category: string,
    priority: 'HIGH' | 'MEDIUM' | 'LOW',
    title: string,
    description: string,
    estimatedImpact: number
  }> = []

  // Analyse each category for improvement opportunities
  assessment.breakdown?.forEach((category: any) => {
    if (category.score > 70) {
      // High risk category - needs attention
      const worstFactor = category.factors
        .sort((a: any, b: any) => b.normalizedScore - a.normalizedScore)[0]

      recommendations.push({
        category: category.categoryName,
        priority: 'HIGH' as const,
        title: `Address ${worstFactor.factorName}`,
        description: `This factor is contributing ${Math.round(worstFactor.contribution)}% to the ${category.categoryName} risk. Consider immediate action.`,
        estimatedImpact: worstFactor.contribution * category.weightedContribution / 100
      })
    } else if (category.score > 50) {
      // Medium risk - monitor and improve
      recommendations.push({
        category: category.categoryName,
        priority: 'MEDIUM' as const,
        title: `Monitor ${category.categoryName}`,
        description: `This category shows moderate risk levels. Regular monitoring and preventive measures recommended.`,
        estimatedImpact: category.weightedContribution * 0.3
      })
    }
  })

  // Sort by estimated impact
  return recommendations
    .sort((a, b) => b.estimatedImpact - a.estimatedImpact)
    .slice(0, 5) // Top 5 recommendations
} 