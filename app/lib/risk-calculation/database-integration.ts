// =====================================================
// RISK CALCULATION DATABASE INTEGRATION
// File: app/lib/risk-calculation/database-integration.ts
// =====================================================

import { createServerSupabaseClient } from '../supabase-server'
import { RiskCalculationEngine } from './engine'
import { RiskInputData, PropertyRiskAssessment } from '../types/risk-types'
import { RiskDataTransformer } from '../services/risk-data-transformer'
import { RiskAssessmentRepository } from '../services/risk-assessment-repository'

export class RiskCalculationDatabaseIntegration {
  
  /**
   * Calculate and store risk assessment for a property
   */
  static async calculateAndStorePropertyRisk(
    propertyId: string,
    overrideData?: Partial<RiskInputData>
  ): Promise<PropertyRiskAssessment> {
    
    const supabase = await createServerSupabaseClient()
    
    try {
      // 1. Gather data from multiple database tables
      const riskData = await this.gatherPropertyRiskData(propertyId, supabase)
      
      // 2. Apply any manual overrides
      const finalRiskData = { ...riskData, ...overrideData }
      
      // 3. Calculate the risk assessment
      const assessment = RiskCalculationEngine.calculatePropertyRisk(
        propertyId, 
        finalRiskData
      )
      
      // 4. Store the results in the database
      await RiskAssessmentRepository.storeRiskAssessment(assessment, supabase)
      
      return assessment
    } catch (error) {
      console.error('Risk calculation failed for property:', propertyId, error)
      throw new Error(`Failed to calculate risk for property ${propertyId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Gather risk data from existing database tables
   */
  private static async gatherPropertyRiskData(
    propertyId: string, 
    supabase: any
  ): Promise<RiskInputData> {
    
    // Get property basic info
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select(`
        building_age_years,
        floor_area_sqm,
        property_type,
        created_at,
        organisations!properties_organisation_id_fkey (
          name,
          type
        )
      `)
      .eq('id', propertyId)
      .single()

    if (propertyError) {
      throw new Error(`Failed to fetch property data: ${propertyError.message}`)
    }

    // Get electrical reports data
    const { data: electricalReports, error: electricalError } = await supabase
      .from('electrical_reports')
      .select('*')
      .eq('property_id', propertyId)
      .order('inspection_date', { ascending: false })

    if (electricalError) {
      console.warn('Failed to fetch electrical reports:', electricalError.message)
    }

    // Get drainage reports data  
    const { data: drainageReports, error: drainageError } = await supabase
      .from('drainage_reports')
      .select('*')
      .eq('property_id', propertyId)
      .order('inspection_date', { ascending: false })

    if (drainageError) {
      console.warn('Failed to fetch drainage reports:', drainageError.message)
    }

    // Get staff data
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select(`
        *,
        training_records!training_records_staff_id_fkey (
          completion_date,
          expiry_date,
          status
        )
      `)
      .eq('property_id', propertyId)
      .eq('employment_status', 'active')

    if (staffError) {
      console.warn('Failed to fetch staff data:', staffError.message)
    }

    // Get risk assessments history
    const { data: previousAssessments, error: historyError } = await supabase
      .from('risk_assessments')
      .select('*')
      .eq('property_id', propertyId)
      .order('assessment_date', { ascending: false })
      .limit(5)

    if (historyError) {
      console.warn('Failed to fetch risk assessment history:', historyError.message)
    }

    // Transform database data into RiskInputData format
    return RiskDataTransformer.transformDatabaseToRiskData({
      property,
      electricalReports: electricalReports || [],
      drainageReports: drainageReports || [],
      staff: staff || [],
      previousAssessments: previousAssessments || []
    })
  }

  /**
   * Calculate risk for all properties in an organisation
   */
  static async calculateOrganisationRisk(organisationId: string): Promise<PropertyRiskAssessment[]> {
    const supabase = await createServerSupabaseClient()
    
    try {
      // Get all properties for the organisation
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id')
        .eq('organisation_id', organisationId)
        .eq('is_active', true)
      
      if (error) throw error
      
      const assessments: PropertyRiskAssessment[] = []
      
      // Calculate risk for each property
      for (const property of properties) {
        try {
          const assessment = await this.calculateAndStorePropertyRisk(property.id)
          assessments.push(assessment)
        } catch (error) {
          console.error(`Failed to calculate risk for property ${property.id}:`, error)
        }
      }
      
      return assessments
    } catch (error) {
      console.error('Organisation risk calculation failed:', error)
      throw error
    }
  }

  /**
   * Get risk assessment history for a property
   */
  static async getPropertyRiskHistory(propertyId: string): Promise<any[]> {
    const supabase = await createServerSupabaseClient()
    
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('property_id', propertyId)
        .order('assessment_date', { ascending: false })
      
      if (error) throw error
      
      return data || []
    } catch (error) {
      console.error('Failed to fetch risk history:', error)
      throw error
    }
  }

  /**
   * Compare risk across properties
   */
  static async comparePropertyRisks(propertyIds: string[]): Promise<{
    properties: PropertyRiskAssessment[],
    comparison: {
      averageRisk: number,
      highestRisk: number,
      lowestRisk: number,
      riskDistribution: {
        LOW: number,
        MEDIUM: number,
        HIGH: number,
        CRITICAL: number
      }
    }
  }> {
    try {
      const assessments: PropertyRiskAssessment[] = []
      
      // Calculate risk for each property
      for (const propertyId of propertyIds) {
        try {
          const assessment = await this.calculateAndStorePropertyRisk(propertyId)
          assessments.push(assessment)
        } catch (error) {
          console.error(`Failed to calculate risk for property ${propertyId}:`, error)
        }
      }
      
      if (assessments.length === 0) {
        throw new Error('No valid risk assessments could be calculated')
      }
      
      // Calculate comparison metrics
      const scores = assessments.map(a => a.overallScore)
      const averageRisk = scores.reduce((sum, score) => sum + score, 0) / scores.length
      const highestRisk = Math.max(...scores)
      const lowestRisk = Math.min(...scores)
      
      const riskDistribution = {
        LOW: assessments.filter(a => a.riskLevel === 'LOW').length,
        MEDIUM: assessments.filter(a => a.riskLevel === 'MEDIUM').length,
        HIGH: assessments.filter(a => a.riskLevel === 'HIGH').length,
        CRITICAL: assessments.filter(a => a.riskLevel === 'CRITICAL').length
      }
      
      return {
        properties: assessments,
        comparison: {
          averageRisk: Math.round(averageRisk * 100) / 100,
          highestRisk: Math.round(highestRisk * 100) / 100,
          lowestRisk: Math.round(lowestRisk * 100) / 100,
          riskDistribution
        }
      }
    } catch (error) {
      console.error('Property risk comparison failed:', error)
      throw error
    }
  }

  /**
   * Get risk summary for an organisation
   */
  static async getRiskSummary(organisationId: string): Promise<{
    totalProperties: number,
    averageRiskScore: number,
    riskDistribution: {
      LOW: number,
      MEDIUM: number,
      HIGH: number,
      CRITICAL: number
    },
    criticalProperties: number,
    highRiskProperties: number
  }> {
    try {
      const assessments = await this.calculateOrganisationRisk(organisationId)
      
      if (assessments.length === 0) {
        return {
          totalProperties: 0,
          averageRiskScore: 0,
          riskDistribution: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
          criticalProperties: 0,
          highRiskProperties: 0
        }
      }
      
      const scores = assessments.map(a => a.overallScore)
      const averageRiskScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      
      const riskDistribution = {
        LOW: assessments.filter(a => a.riskLevel === 'LOW').length,
        MEDIUM: assessments.filter(a => a.riskLevel === 'MEDIUM').length,
        HIGH: assessments.filter(a => a.riskLevel === 'HIGH').length,
        CRITICAL: assessments.filter(a => a.riskLevel === 'CRITICAL').length
      }
      
      return {
        totalProperties: assessments.length,
        averageRiskScore: Math.round(averageRiskScore * 100) / 100,
        riskDistribution,
        criticalProperties: riskDistribution.CRITICAL,
        highRiskProperties: riskDistribution.HIGH
      }
    } catch (error) {
      console.error('Failed to generate risk summary:', error)
      throw error
    }
  }

  /**
   * Get risk trends for a property
   */
  static async getPropertyRiskTrends(propertyId: string): Promise<{
    propertyId: string,
    trends: {
      date: string,
      riskScore: number,
      riskLevel: string
    }[],
    improvement: number,
    recommendations: string[]
  }> {
    try {
      const history = await this.getPropertyRiskHistory(propertyId)
      
      if (history.length < 2) {
        return {
          propertyId,
          trends: [],
          improvement: 0,
          recommendations: ['Insufficient data for trend analysis']
        }
      }
      
      // Sort by date and get last 10 assessments
      const sortedHistory = history
        .sort((a, b) => new Date(b.assessment_date).getTime() - new Date(a.assessment_date).getTime())
        .slice(0, 10)
        .reverse()
      
      const trends = sortedHistory.map(assessment => ({
        date: assessment.assessment_date,
        riskScore: assessment.overall_score,
        riskLevel: assessment.risk_level
      }))
      
      // Calculate improvement
      const firstScore = trends[0]?.riskScore || 0
      const lastScore = trends[trends.length - 1]?.riskScore || 0
      const improvement = firstScore > 0 ? ((firstScore - lastScore) / firstScore) * 100 : 0
      
      // Generate recommendations based on trends
      const recommendations = this.generateRecommendations(trends)
      
      return {
        propertyId,
        trends,
        improvement: Math.round(improvement * 100) / 100,
        recommendations
      }
    } catch (error) {
      console.error('Failed to analyze risk trends:', error)
      throw error
    }
  }

  /**
   * Generate recommendations based on risk trends
   */
  private static generateRecommendations(trends: any[]): string[] {
    const recommendations: string[] = []
    
    if (trends.length < 2) {
      return ['Insufficient data for recommendations']
    }
    
    const firstScore = trends[0]?.riskScore || 0
    const lastScore = trends[trends.length - 1]?.riskScore || 0
    const improvement = firstScore > 0 ? ((firstScore - lastScore) / firstScore) * 100 : 0
    
    if (improvement > 10) {
      recommendations.push('Excellent risk improvement trend - continue current practices')
    } else if (improvement > 0) {
      recommendations.push('Moderate risk improvement - consider additional safety measures')
    } else if (improvement < -10) {
      recommendations.push('Risk level increasing - immediate action required')
    } else if (improvement < 0) {
      recommendations.push('Risk level slightly increasing - review safety protocols')
    } else {
      recommendations.push('Risk level stable - maintain current safety standards')
    }
    
    // Add specific recommendations based on current risk level
    const currentRiskLevel = trends[trends.length - 1]?.riskLevel
    if (currentRiskLevel === 'CRITICAL') {
      recommendations.push('Critical risk level - immediate intervention required')
    } else if (currentRiskLevel === 'HIGH') {
      recommendations.push('High risk level - enhanced monitoring and safety measures needed')
    }
    
    return recommendations
  }
} 