// =====================================================
// RISK CALCULATION SYSTEM EXPORTS
// File: app/lib/risk-calculation/index.ts
// =====================================================

// Export the main engine
export { RiskCalculationEngine } from './engine'

// Export the database integration layer
export { RiskCalculationDatabaseIntegration } from './database-integration'

// Re-export types for convenience
export type {
  RiskCategory,
  RiskCategoryScore,
  RiskFactorScore,
  PropertyRiskAssessment,
  RiskInputData
} from '../types/risk-types'

// Export utility functions
export { calculatePropertyRiskExample } from './engine' 