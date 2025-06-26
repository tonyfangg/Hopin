// =====================================================
// CUSTOMER SUCCESS TRACKING
// File: app/lib/customer-success.ts
// =====================================================

import { ProductionMonitoring } from './production-monitoring'

export class CustomerSuccessTracker {
  // Track key customer milestones
  static async trackMilestone(milestone: string, organisationId: string, metadata?: any) {
    try {
      const response = await fetch('/api/customer-success/milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestone,
          organisation_id: organisationId,
          metadata,
          timestamp: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        ProductionMonitoring.trackBusinessEvent('customer_milestone', {
          milestone,
          organisation_id: organisationId
        })
      }
    } catch (error) {
      console.error('Failed to track milestone:', error)
    }
  }

  // Track customer health score
  static async calculateCustomerHealth(organisationId: string): Promise<number> {
    try {
      const response = await fetch(`/api/customer-success/health/${organisationId}`)
      const data = await response.json()
      return data.health_score || 0
    } catch {
      return 0
    }
  }
}

// Customer success milestones to track:
// - First property added
// - First document uploaded  
// - First inspection completed
// - Risk score improved
// - Insurance renewal preparation
// - Compliance deadline met 