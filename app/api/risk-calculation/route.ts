// =====================================================
// RISK CALCULATION API ENDPOINT
// File: app/api/risk-calculation/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { RiskCalculationDatabaseIntegration } from '@/app/lib/risk-calculation/database-integration'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const { propertyId, organisationId, overrides, action } = body

    console.log('🔍 Risk calculation request:', { propertyId, organisationId, action })

    switch (action) {
      case 'calculate_property':
        if (!propertyId) {
          return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
        }
        
        const assessment = await RiskCalculationDatabaseIntegration.calculateAndStorePropertyRisk(propertyId, overrides)
        return NextResponse.json({ assessment })

      case 'calculate_organisation':
        if (!organisationId) {
          return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 })
        }
        
        const orgAssessments = await RiskCalculationDatabaseIntegration.calculateOrganisationRisk(organisationId)
        return NextResponse.json({ assessments: orgAssessments })

      case 'compare_properties':
        const { propertyIds } = body
        if (!propertyIds || !Array.isArray(propertyIds)) {
          return NextResponse.json({ error: 'Property IDs array required' }, { status: 400 })
        }
        
        const comparison = await RiskCalculationDatabaseIntegration.comparePropertyRisks(propertyIds)
        return NextResponse.json({ comparison })

      case 'get_history':
        if (!propertyId) {
          return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
        }
        
        const history = await RiskCalculationDatabaseIntegration.getPropertyRiskHistory(propertyId)
        return NextResponse.json({ history })

      case 'get_summary':
        if (!organisationId) {
          return NextResponse.json({ error: 'Organisation ID required' }, { status: 400 })
        }
        
        const summary = await RiskCalculationDatabaseIntegration.getRiskSummary(organisationId)
        return NextResponse.json({ summary })

      case 'get_trends':
        if (!propertyId) {
          return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
        }
        
        const trends = await RiskCalculationDatabaseIntegration.getPropertyRiskTrends(propertyId)
        return NextResponse.json({ trends })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Risk calculation API error:', error)
    return NextResponse.json({ 
      error: 'Risk calculation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 