// =====================================================
// RISK CALCULATION API LAYER
// =====================================================

import { PropertyRiskService } from '../services/property-risk-service'
import { RiskInputData, PropertyRiskAssessment } from '../types/risk-types'

export class RiskCalculationAPI {
  
  /**
   * Calculate risk for a specific property
   */
  static async calculatePropertyRisk(
    propertyId: string,
    overrides?: Partial<RiskInputData>
  ): Promise<PropertyRiskAssessment> {
    try {
      console.log('🔍 Calculating risk for property:', propertyId)
      return await PropertyRiskService.calculateAndStorePropertyRisk(propertyId, overrides)
    } catch (error) {
      console.error('❌ Risk calculation failed:', error)
      throw error
    }
  }

  /**
   * Calculate risk for all properties in an organisation
   */
  static async calculateOrganisationRisk(organisationId: string): Promise<PropertyRiskAssessment[]> {
    try {
      console.log('🔍 Calculating risk for organisation:', organisationId)
      return await PropertyRiskService.calculateOrganisationRisk(organisationId)
    } catch (error) {
      console.error('❌ Organisation risk calculation failed:', error)
      throw error
    }
  }

  /**
   * Get risk assessment history for a property
   */
  static async getPropertyRiskHistory(propertyId: string): Promise<any[]> {
    try {
      console.log('🔍 Fetching risk history for property:', propertyId)
      return await PropertyRiskService.getPropertyRiskHistory(propertyId)
    } catch (error) {
      console.error('❌ Failed to fetch risk history:', error)
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
      console.log('🔍 Comparing risks for properties:', propertyIds)
      return await PropertyRiskService.comparePropertyRisks(propertyIds)
    } catch (error) {
      console.error('❌ Property risk comparison failed:', error)
      throw error
    }
  }

  /**
   * Get risk summary for dashboard
   */
  static async getRiskSummary(organisationId: string): Promise<{
    totalProperties: number,
    averageRisk: number,
    riskDistribution: {
      LOW: number,
      MEDIUM: number,
      HIGH: number,
      CRITICAL: number
    },
    recentAssessments: number,
    overdueAssessments: number
  }> {
    try {
      console.log('🔍 Generating risk summary for organisation:', organisationId)
      
      const assessments = await this.calculateOrganisationRisk(organisationId)
      
      const riskDistribution = {
        LOW: assessments.filter(a => a.riskLevel === 'LOW').length,
        MEDIUM: assessments.filter(a => a.riskLevel === 'MEDIUM').length,
        HIGH: assessments.filter(a => a.riskLevel === 'HIGH').length,
        CRITICAL: assessments.filter(a => a.riskLevel === 'CRITICAL').length
      }
      
      const averageRisk = assessments.length > 0 
        ? assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length 
        : 0
      
      // Calculate recent and overdue assessments (last 30 days vs overdue)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const recentAssessments = assessments.filter(a => 
        new Date(a.assessmentDate) > thirtyDaysAgo
      ).length
      
      // Placeholder for overdue calculation - would need assessment schedule data
      const overdueAssessments = 0
      
      return {
        totalProperties: assessments.length,
        averageRisk: Math.round(averageRisk * 100) / 100,
        riskDistribution,
        recentAssessments,
        overdueAssessments
      }
      
    } catch (error) {
      console.error('❌ Failed to generate risk summary:', error)
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
    improvement: number, // Percentage improvement over time
    recommendations: string[]
  }> {
    try {
      console.log('🔍 Analyzing risk trends for property:', propertyId)
      
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
      console.error('❌ Failed to analyze risk trends:', error)
      throw error
    }
  }

  /**
   * Generate recommendations based on risk trends
   */
  private static generateRecommendations(trends: any[]): string[] {
    const recommendations: string[] = []
    
    if (trends.length < 2) {
      return ['More assessment data needed for recommendations']
    }
    
    const recentTrend = trends.slice(-3) // Last 3 assessments
    const averageRisk = recentTrend.reduce((sum, t) => sum + t.riskScore, 0) / recentTrend.length
    
    if (averageRisk > 75) {
      recommendations.push('Critical risk level detected - immediate action required')
      recommendations.push('Consider emergency safety measures')
    } else if (averageRisk > 50) {
      recommendations.push('High risk level - review safety protocols')
      recommendations.push('Schedule additional inspections')
    } else if (averageRisk > 25) {
      recommendations.push('Moderate risk - maintain current safety standards')
    } else {
      recommendations.push('Low risk - continue monitoring')
    }
    
    // Check for improving or deteriorating trends
    const firstScore = trends[0]?.riskScore || 0
    const lastScore = trends[trends.length - 1]?.riskScore || 0
    
    if (lastScore > firstScore + 10) {
      recommendations.push('Risk level increasing - investigate recent changes')
    } else if (lastScore < firstScore - 10) {
      recommendations.push('Risk level improving - maintain current practices')
    }
    
    return recommendations
  }
}

// =====================================================
// USAGE EXAMPLES
// =====================================================

/* 
// Calculate risk for a single property
const assessment = await RiskCalculationAPI.calculatePropertyRisk('property-123')

// Calculate with manual overrides
const assessmentWithOverrides = await RiskCalculationAPI.calculatePropertyRisk('property-123', {
  cybersecurityScore: 90,
  fireAlarmCompliance: 100
})

// Calculate for entire organisation
const orgAssessments = await RiskCalculationAPI.calculateOrganisationRisk('org-456')

// Compare multiple properties
const comparison = await RiskCalculationAPI.comparePropertyRisks(['prop-1', 'prop-2', 'prop-3'])

// Get risk summary for dashboard
const summary = await RiskCalculationAPI.getRiskSummary('org-456')

// Get risk trends
const trends = await RiskCalculationAPI.getPropertyRiskTrends('property-123')
*/ 