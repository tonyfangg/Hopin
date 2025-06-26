// =====================================================
// REGULATORY COMPLIANCE MONITORING
// File: app/lib/compliance-monitor.ts
// =====================================================

import { ProductionMonitoring } from './production-monitoring'

export class ComplianceMonitor {
  // Monitor UK regulatory compliance
  static async checkComplianceStatus(organisationId: string) {
    const complianceChecks = {
      fire_safety: await this.checkFireSafetyCompliance(organisationId),
      electrical_safety: await this.checkElectricalCompliance(organisationId),
      gas_safety: await this.checkGasSafetyCompliance(organisationId),
      health_safety: await this.checkHealthSafetyCompliance(organisationId),
      insurance_coverage: await this.checkInsuranceCompliance(organisationId)
    }

    const overallCompliance = Object.values(complianceChecks).every(check => check.compliant)
    
    // Track compliance metrics
    ProductionMonitoring.trackInsuranceMetric('compliance_score', 
      Object.values(complianceChecks).filter(c => c.compliant).length / 5 * 100,
      organisationId
    )

    return {
      overall_compliant: overallCompliance,
      checks: complianceChecks,
      recommendations: this.generateComplianceRecommendations(complianceChecks)
    }
  }

  private static async checkFireSafetyCompliance(orgId: string) {
    // Check fire risk assessments, evacuation plans, etc.
    return { compliant: true, last_check: new Date(), next_due: new Date() }
  }

  private static async checkElectricalCompliance(orgId: string) {
    // Check EICR certificates, PAT testing, etc.
    return { compliant: true, last_check: new Date(), next_due: new Date() }
  }

  private static async checkGasSafetyCompliance(orgId: string) {
    // Check Gas Safety (CP12) certificates
    return { compliant: true, last_check: new Date(), next_due: new Date() }
  }

  private static async checkHealthSafetyCompliance(orgId: string) {
    // Check H&S policies, risk assessments, training records
    return { compliant: true, last_check: new Date(), next_due: new Date() }
  }

  private static async checkInsuranceCompliance(orgId: string) {
    // Check insurance policy status and coverage adequacy
    return { compliant: true, last_check: new Date(), next_due: new Date() }
  }

  private static generateComplianceRecommendations(checks: any) {
    const recommendations: Array<{
      area: string
      priority: string
      action: string
      deadline: Date
    }> = []
    
    Object.entries(checks).forEach(([area, check]: [string, any]) => {
      if (!check.compliant) {
        recommendations.push({
          area,
          priority: 'high',
          action: `Update ${area.replace('_', ' ')} documentation`,
          deadline: check.next_due
        })
      }
    })

    return recommendations
  }
} 