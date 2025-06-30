// =====================================================
// RISK DATA TRANSFORMATION
// =====================================================

import { RiskInputData } from '../types/risk-types'

export class RiskDataTransformer {
  
  /**
   * Transform database data into risk calculation input format
   */
  static transformDatabaseToRiskData(dbData: any): RiskInputData {
    const { property, electricalReports, drainageReports, staff, previousAssessments } = dbData
    
    return {
      // Property & Asset Factors
      buildingAge: property?.building_age_years || 0,
      buildingCondition: this.assessBuildingCondition(property, electricalReports, drainageReports),
      electricalCompliance: this.calculateElectricalCompliance(electricalReports),
      lastElectricalInspection: this.getMonthsSinceLastInspection(electricalReports, 'inspection_date'),
      drainageMaintenanceFrequency: this.calculateMaintenanceFrequency(drainageReports),
      lastDrainageIssues: this.getMonthsSinceLastIssue(drainageReports),
      
      // Security & Risk Management
      fireAlarmCompliance: this.calculateFireSafetyCompliance(electricalReports, 'fire_alarm'),
      extinguisherCompliance: this.calculateFireSafetyCompliance(electricalReports, 'extinguisher'),
      emergencyLightingCompliance: this.calculateFireSafetyCompliance(electricalReports, 'emergency_lighting'),
      overdueComplianceItems: this.countOverdueItems(electricalReports, drainageReports),
      totalComplianceItems: this.countTotalComplianceItems(electricalReports, drainageReports),
      
      // Operational Risk
      trainedStaff: this.countTrainedStaff(staff),
      totalStaff: staff?.length || 0,
      averageTrainingAge: this.calculateAverageTrainingAge(staff),
      staffTurnoverRate: this.calculateStaffTurnoverRate(staff, previousAssessments),
      handbookCompliance: this.calculateHandbookCompliance(staff),
      contractCompliance: this.calculateContractCompliance(staff),
      
      // Business-Specific Factors
      industryRiskScore: this.getIndustryRiskScore(property?.organisations?.type),
      businessSizeRisk: this.getBusinessSizeRisk(property?.floor_area_sqm),
      claimsHistory: this.calculateClaimsHistory(previousAssessments),
      
      // Location-Based Factors (placeholder - integrate with external APIs later)
      crimeRate: 40, // TODO: Integrate with crime data API
      postcodeRisk: 35, // TODO: Integrate with postcode risk API
      naturalHazardExposure: 25, // TODO: Integrate with environmental data
      
      // Financial & Administrative (placeholder - integrate with credit APIs)
      creditHistoryScore: 75,
      financialStability: 80,
      adminQuality: 70,
      
      // Market & External Factors (placeholder - integrate with economic APIs)
      inflationImpact: 40,
      regulatoryChangeRisk: 30,
      
      // Specialised Risk Factors (placeholder - integrate with security assessments)
      cybersecurityScore: 60,
      supplyChainDependency: 50
    }
  }

  // =====================================================
  // DATA TRANSFORMATION HELPER METHODS
  // =====================================================

  private static assessBuildingCondition(property: any, electricalReports: any[], drainageReports: any[]): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    // Base condition on building age
    const age = property?.building_age_years || 0
    let baseCondition = 'good'
    
    if (age > 50) baseCondition = 'fair'
    if (age > 80) baseCondition = 'poor'
    if (age < 10) baseCondition = 'excellent'
    
    // Adjust based on recent maintenance issues
    const recentIssues = [
      ...electricalReports?.filter(r => r.remedial_work_required) || [],
      ...drainageReports?.filter(r => r.damage_found) || []
    ]
    
    if (recentIssues.length > 5) return 'poor'
    if (recentIssues.length > 2) return 'fair'
    if (recentIssues.length === 0 && baseCondition === 'good') return 'excellent'
    
    return baseCondition as any
  }

  private static calculateElectricalCompliance(electricalReports: any[]): number {
    if (!electricalReports?.length) return 50 // Default if no data
    
    const recentReports = electricalReports.slice(0, 3) // Last 3 reports
    const compliantReports = recentReports.filter(r => r.compliance_status === 'compliant')
    
    return (compliantReports.length / recentReports.length) * 100
  }

  private static getMonthsSinceLastInspection(reports: any[], dateField: string): number {
    if (!reports?.length) return 24 // Default to 24 months if no data
    
    const lastReport = reports[0]
    if (!lastReport?.[dateField]) return 24
    
    const lastDate = new Date(lastReport[dateField])
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - lastDate.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    
    return diffMonths
  }

  private static calculateMaintenanceFrequency(drainageReports: any[]): number {
    if (!drainageReports?.length) return 12 // Default to 12 months if no data
    
    // Calculate average time between maintenance visits
    const sortedReports = drainageReports
      .filter(r => r.service_date)
      .sort((a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime())
    
    if (sortedReports.length < 2) return 12
    
    let totalDaysBetween = 0
    for (let i = 0; i < sortedReports.length - 1; i++) {
      const date1 = new Date(sortedReports[i].service_date)
      const date2 = new Date(sortedReports[i + 1].service_date)
      const daysDiff = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
      totalDaysBetween += daysDiff
    }
    
    const avgDaysBetween = totalDaysBetween / (sortedReports.length - 1)
    return Math.round(avgDaysBetween / 30) // Convert to months
  }

  private static getMonthsSinceLastIssue(drainageReports: any[]): number {
    if (!drainageReports?.length) return 12 // Default if no data
    
    const issueReports = drainageReports.filter(r => 
      r.damage_found || r.blockages_found || r.repairs_required
    )
    
    if (!issueReports.length) return 24 // No issues found
    
    const lastIssue = issueReports[0]
    const issueDate = new Date(lastIssue.service_date || lastIssue.inspection_date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - issueDate.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    
    return diffMonths
  }

  private static calculateFireSafetyCompliance(electricalReports: any[], system: string): number {
    if (!electricalReports?.length) return 70 // Default score
    
    // Filter reports related to specific fire safety system
    const relevantReports = electricalReports.filter(r => 
      r.inspection_type?.toLowerCase().includes(system) ||
      r.test_results?.[system] !== undefined
    )
    
    if (!relevantReports.length) return 70
    
    const recentReports = relevantReports.slice(0, 3)
    const passedTests = recentReports.filter(r => 
      r.compliance_status === 'compliant' && 
      !r.remedial_work_required
    )
    
    return (passedTests.length / recentReports.length) * 100
  }

  private static countOverdueItems(electricalReports: any[], drainageReports: any[]): number {
    const now = new Date()
    let overdueCount = 0
    
    // Count overdue electrical inspections
    electricalReports?.forEach(report => {
      if (report.next_inspection_due) {
        const dueDate = new Date(report.next_inspection_due)
        if (dueDate < now) overdueCount++
      }
    })
    
    // Count overdue drainage maintenance
    drainageReports?.forEach(report => {
      if (report.next_service_due) {
        const dueDate = new Date(report.next_service_due)
        if (dueDate < now) overdueCount++
      }
    })
    
    return overdueCount
  }

  private static countTotalComplianceItems(electricalReports: any[], drainageReports: any[]): number {
    return (electricalReports?.length || 0) + (drainageReports?.length || 0)
  }

  private static countTrainedStaff(staff: any[]): number {
    if (!staff?.length) return 0
    
    return staff.filter(member => {
      const hasValidTraining = member.training_records?.some((training: any) => 
        training.status === 'valid' && 
        (!training.expiry_date || new Date(training.expiry_date) > new Date())
      )
      return hasValidTraining || member.training_status === 'up_to_date'
    }).length
  }

  private static calculateAverageTrainingAge(staff: any[]): number {
    if (!staff?.length) return 12 // Default 12 months
    
    const trainingAges: number[] = []
    const now = new Date()
    
    staff.forEach(member => {
      member.training_records?.forEach((training: any) => {
        if (training.completion_date) {
          const completionDate = new Date(training.completion_date)
          const ageInMonths = (now.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
          trainingAges.push(ageInMonths)
        }
      })
    })
    
    if (!trainingAges.length) return 12
    
    const average = trainingAges.reduce((sum, age) => sum + age, 0) / trainingAges.length
    return Math.round(average)
  }

  private static calculateStaffTurnoverRate(staff: any[], previousAssessments: any[]): number {
    // This would require historical staff data - placeholder implementation
    if (!staff?.length) return 50
    
    // Calculate based on employment status and hire dates
    const recentHires = staff.filter(member => {
      if (!member.hire_date) return false
      const hireDate = new Date(member.hire_date)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return hireDate > sixMonthsAgo
    })
    
    // Higher percentage of recent hires suggests higher turnover
    const turnoverIndicator = (recentHires.length / staff.length) * 100
    return Math.min(100, turnoverIndicator * 1.5) // Adjust multiplier as needed
  }

  private static calculateHandbookCompliance(staff: any[]): number {
    if (!staff?.length) return 80 // Default score
    
    // Placeholder - would need handbook consent tracking
    return 85
  }

  private static calculateContractCompliance(staff: any[]): number {
    if (!staff?.length) return 90 // Default score
    
    const activeStaff = staff.filter(member => member.employment_status === 'active')
    // Placeholder - would need contract status tracking
    return (activeStaff.length / staff.length) * 100
  }

  private static getIndustryRiskScore(organisationType: string): number {
    const riskScores = {
      'retail_chain': 45,
      'franchise': 35,
      'independent_store': 55,
      'warehouse': 40,
      'office': 25
    }
    
    return riskScores[organisationType as keyof typeof riskScores] || 50
  }

  private static getBusinessSizeRisk(floorArea: number): number {
    if (!floorArea) return 50
    
    // Larger premises generally have higher risk
    if (floorArea < 100) return 30
    if (floorArea < 300) return 40
    if (floorArea < 500) return 50
    if (floorArea < 1000) return 60
    return 70
  }

  private static calculateClaimsHistory(previousAssessments: any[]): number {
    if (!previousAssessments?.length) return 20 // Low claims history if no data
    
    // Look for claims-related data in previous assessments
    const assessmentsWithClaims = previousAssessments.filter(assessment => 
      assessment.risk_factors && 
      JSON.stringify(assessment.risk_factors).includes('claim')
    )
    
    // More previous issues = higher claims risk
    return Math.min(100, assessmentsWithClaims.length * 15)
  }
} 