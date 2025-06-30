// =====================================================
// RISK CALCULATION SYSTEM TYPES
// =====================================================

export interface RiskFactor {
  id: string;
  name: string;
  categoryId: string;
  weight: number; // 0-1 within category
  value: number; // Actual measured/assessed value
  maxValue: number; // Maximum possible value for normalization
  unit?: string;
  description?: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  weight: number; // Percentage weight (e.g., 0.25 for 25%)
  factors: RiskFactor[];
  description?: string;
}

export interface PropertyRiskAssessment {
  propertyId: string;
  assessmentDate: Date;
  categories: RiskCategory[];
  overallScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: RiskCategoryScore[];
}

export interface RiskCategoryScore {
  categoryId: string;
  categoryName: string;
  score: number; // 0-100
  weightedContribution: number; // Contribution to overall score
  factors: RiskFactorScore[];
}

export interface RiskFactorScore {
  factorId: string;
  factorName: string;
  rawValue: number;
  normalizedScore: number; // 0-100
  weight: number;
  contribution: number; // Contribution to category score
}

export interface RiskInputData {
  // Business-Specific
  industryRiskScore?: number;
  businessSizeRisk?: number;
  revenueVolatility?: number;
  claimsHistory?: number;

  // Location-Based
  crimeRate?: number;
  postcodeRisk?: number;
  naturalHazardExposure?: number;

  // Property & Asset
  buildingAge?: number;
  buildingCondition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  stockValueRisk?: number;
  electricalCompliance?: number;
  lastElectricalInspection?: number; // months ago
  drainageMaintenanceFrequency?: number; // months between maintenance
  lastDrainageIssues?: number; // months since last issue

  // Security & Risk Management
  fireAlarmCompliance?: number;
  extinguisherCompliance?: number;
  emergencyLightingCompliance?: number;
  securitySystemsScore?: number;
  overdueComplianceItems?: number;
  totalComplianceItems?: number;

  // Operational Risk
  trainedStaff?: number;
  totalStaff?: number;
  averageTrainingAge?: number; // months
  staffTurnoverRate?: number;
  handbookCompliance?: number;
  contractCompliance?: number;

  // Financial & Administrative
  creditHistoryScore?: number;
  financialStability?: number;
  adminQuality?: number;

  // Market & External
  inflationImpact?: number;
  regulatoryChangeRisk?: number;

  // Specialised Risk
  cybersecurityScore?: number;
  supplyChainDependency?: number;
} 