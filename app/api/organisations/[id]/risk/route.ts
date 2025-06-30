// =====================================================
// ORGANISATION RISK DASHBOARD API  
// File: app/api/organisations/[id]/risk/route.ts
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

    const organisationId = params.id

    // Get all properties for the organisation
    const { data: properties } = await supabase
      .from('properties')
      .select('id, name, address, property_type, risk_score, safety_score')
      .eq('organisation_id', organisationId)
      .eq('is_active', true)

    if (!properties?.length) {
      return NextResponse.json({ 
        error: 'No properties found for this organisation' 
      }, { status: 404 })
    }

    // Calculate risk for all properties
    const propertyIds = properties.map(p => p.id)
    const comparison = await RiskCalculationDatabaseIntegration.comparePropertyRisks(propertyIds)

    // Get organisation details
    const { data: organisation } = await supabase
      .from('organisations')
      .select('id, name, type, address')
      .eq('id', organisationId)
      .single()

    return NextResponse.json({
      organisation,
      riskOverview: comparison.comparison,
      properties: comparison.properties,
      riskMatrix: generateRiskMatrix(comparison.properties),
      actionItems: generateOrganisationActionItems(comparison.properties)
    })

  } catch (error) {
    console.error('Organisation risk dashboard error:', error)
    return NextResponse.json({ 
      error: 'Failed to load organisation risk dashboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function generateRiskMatrix(assessments: any[]): {
  categories: string[],
  properties: Array<{
    propertyId: string,
    propertyName: string,
    categoryScores: number[]
  }>
} {
  if (!assessments?.length) {
    return { categories: [], properties: [] }
  }

  // Get all unique categories
  const categories = assessments[0]?.breakdown?.map((cat: any) => cat.categoryName) || []

  const properties = assessments.map(assessment => ({
    propertyId: assessment.propertyId,
    propertyName: assessment.propertyName || `Property ${assessment.propertyId.slice(0, 8)}`,
    categoryScores: categories.map((categoryName: string) => {
      const category = assessment.breakdown?.find((cat: any) => cat.categoryName === categoryName)
      return category?.score || 0
    })
  }))

  return { categories, properties }
}

function generateOrganisationActionItems(assessments: any[]): Array<{
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM',
  propertyCount: number,
  title: string,
  description: string,
  affectedProperties: string[]
}> {
  const actionItems: Array<{
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM',
    propertyCount: number,
    title: string,
    description: string,
    affectedProperties: string[]
  }> = []

  // Find properties with critical risk levels
  const criticalProperties = assessments.filter(a => a.riskLevel === 'CRITICAL')
  if (criticalProperties.length > 0) {
    actionItems.push({
      priority: 'CRITICAL' as const,
      propertyCount: criticalProperties.length,
      title: 'Critical Risk Properties Require Immediate Attention',
      description: `${criticalProperties.length} properties have critical risk levels requiring immediate intervention.`,
      affectedProperties: criticalProperties.map(p => p.propertyId)
    })
  }

  // Find common high-risk categories across properties
  const categoryRisks: { [key: string]: number[] } = {}
  assessments.forEach(assessment => {
    assessment.breakdown?.forEach((category: any) => {
      if (!categoryRisks[category.categoryName]) {
        categoryRisks[category.categoryName] = []
      }
      categoryRisks[category.categoryName].push(category.score)
    })
  })

  Object.entries(categoryRisks).forEach(([categoryName, scores]) => {
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const highRiskCount = scores.filter(score => score > 70).length

    if (highRiskCount >= assessments.length * 0.5) { // 50% or more properties affected
      actionItems.push({
        priority: averageScore > 80 ? 'HIGH' : 'MEDIUM' as const,
        propertyCount: highRiskCount,
        title: `Organisation-wide ${categoryName} Risk`,
        description: `${highRiskCount} properties show elevated risk in ${categoryName}. Consider organisation-wide policy review.`,
        affectedProperties: assessments
          .filter((_, index) => scores[index] > 70)
          .map(a => a.propertyId)
      })
    }
  })

  return actionItems
    .sort((a, b) => {
      const priorityOrder = { CRITICAL: 3, HIGH: 2, MEDIUM: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    .slice(0, 10) // Top 10 action items
} 