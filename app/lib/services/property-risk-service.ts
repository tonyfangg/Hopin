// =====================================================
// RISK CALCULATION DATABASE INTEGRATION
// =====================================================

import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { RiskCalculationEngine } from '../risk-calculation-engine'
import { RiskInputData, PropertyRiskAssessment } from '../types/risk-types'
import { RiskDataTransformer } from './risk-data-transformer'
import { RiskAssessmentRepository } from './risk-assessment-repository'

export class PropertyRiskService {
  
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
      const assessments = await Promise.all(
        propertyIds.map(id => this.calculateAndStorePropertyRisk(id))
      )
      
      const comparison = {
        averageRisk: assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length,
        highestRisk: Math.max(...assessments.map(a => a.overallScore)),
        lowestRisk: Math.min(...assessments.map(a => a.overallScore)),
        riskDistribution: {
          LOW: assessments.filter(a => a.riskLevel === 'LOW').length,
          MEDIUM: assessments.filter(a => a.riskLevel === 'MEDIUM').length,
          HIGH: assessments.filter(a => a.riskLevel === 'HIGH').length,
          CRITICAL: assessments.filter(a => a.riskLevel === 'CRITICAL').length
        }
      }
      
      return {
        properties: assessments,
        comparison
      }
    } catch (error) {
      console.error('Property risk comparison failed:', error)
      throw error
    }
  }
} 