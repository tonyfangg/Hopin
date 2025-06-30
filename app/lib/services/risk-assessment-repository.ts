// =====================================================
// RISK ASSESSMENT REPOSITORY
// =====================================================

import { PropertyRiskAssessment } from '../types/risk-types'

export class RiskAssessmentRepository {
  
  /**
   * Store risk assessment results in database
   */
  static async storeRiskAssessment(
    assessment: PropertyRiskAssessment,
    supabase: any
  ): Promise<void> {
    
    try {
      // Store main risk assessment record
      const { data: storedAssessment, error } = await supabase
        .from('risk_assessments')
        .insert({
          property_id: assessment.propertyId,
          assessment_date: assessment.assessmentDate,
          overall_score: assessment.overallScore,
          risk_level: assessment.riskLevel,
          risk_factors: JSON.stringify(assessment.breakdown),
          assessment_type: 'comprehensive',
          status: 'completed'
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to store risk assessment: ${error.message}`)
      }

      // Update property risk score
      await this.updatePropertyRiskScores(assessment, supabase)
      
      console.log('✅ Risk assessment stored successfully for property:', assessment.propertyId)
      
    } catch (error) {
      console.error('❌ Failed to store risk assessment:', error)
      throw error
    }
  }

  /**
   * Update property risk and safety scores
   */
  private static async updatePropertyRiskScores(
    assessment: PropertyRiskAssessment,
    supabase: any
  ): Promise<void> {
    
    try {
      const safetyScore = this.calculateSafetyScore(assessment)
      
      const { error } = await supabase
        .from('properties')
        .update({
          risk_score: Math.round(assessment.overallScore * 10), // Convert to 0-1000 scale
          safety_score: safetyScore,
          last_risk_assessment: assessment.assessmentDate
        })
        .eq('id', assessment.propertyId)

      if (error) {
        throw new Error(`Failed to update property risk scores: ${error.message}`)
      }
      
    } catch (error) {
      console.error('❌ Failed to update property risk scores:', error)
      throw error
    }
  }

  /**
   * Calculate safety score from risk assessment
   */
  private static calculateSafetyScore(assessment: PropertyRiskAssessment): number {
    // Calculate safety score from security and property factors
    const securityCategory = assessment.breakdown.find(cat => cat.categoryId === 'security_risk')
    const propertyCategory = assessment.breakdown.find(cat => cat.categoryId === 'property_asset')
    
    if (!securityCategory || !propertyCategory) return 75
    
    // Higher security and property scores = higher safety score
    const averageScore = (securityCategory.score + propertyCategory.score) / 2
    return Math.round(100 - averageScore) // Invert so higher is better
  }

  /**
   * Get risk assessment history for a property
   */
  static async getRiskAssessmentHistory(
    propertyId: string,
    supabase: any
  ): Promise<any[]> {
    
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('property_id', propertyId)
        .order('assessment_date', { ascending: false })
      
      if (error) {
        throw new Error(`Failed to fetch risk assessment history: ${error.message}`)
      }
      
      return data || []
      
    } catch (error) {
      console.error('❌ Failed to fetch risk assessment history:', error)
      throw error
    }
  }

  /**
   * Get latest risk assessment for a property
   */
  static async getLatestRiskAssessment(
    propertyId: string,
    supabase: any
  ): Promise<any | null> {
    
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select('*')
        .eq('property_id', propertyId)
        .order('assessment_date', { ascending: false })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Failed to fetch latest risk assessment: ${error.message}`)
      }
      
      return data
      
    } catch (error) {
      console.error('❌ Failed to fetch latest risk assessment:', error)
      throw error
    }
  }

  /**
   * Delete risk assessment
   */
  static async deleteRiskAssessment(
    assessmentId: string,
    supabase: any
  ): Promise<void> {
    
    try {
      const { error } = await supabase
        .from('risk_assessments')
        .delete()
        .eq('id', assessmentId)
      
      if (error) {
        throw new Error(`Failed to delete risk assessment: ${error.message}`)
      }
      
    } catch (error) {
      console.error('❌ Failed to delete risk assessment:', error)
      throw error
    }
  }

  /**
   * Get risk assessments by organisation
   */
  static async getOrganisationRiskAssessments(
    organisationId: string,
    supabase: any
  ): Promise<any[]> {
    
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`
          *,
          properties!risk_assessments_property_id_fkey (
            name,
            address,
            organisation_id
          )
        `)
        .eq('properties.organisation_id', organisationId)
        .order('assessment_date', { ascending: false })
      
      if (error) {
        throw new Error(`Failed to fetch organisation risk assessments: ${error.message}`)
      }
      
      return data || []
      
    } catch (error) {
      console.error('❌ Failed to fetch organisation risk assessments:', error)
      throw error
    }
  }
} 