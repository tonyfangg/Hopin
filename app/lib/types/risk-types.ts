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
  icon: string;
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

export interface RiskScore {
  value: number // 0-100 scale
  level: RiskLevel
  category: string
  description: string
}

export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH', 
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export interface RiskLevelConfig {
  level: RiskLevel
  range: { min: number; max: number }
  color: string
  bgColor: string
  description: string
  action: string
}

export const RISK_LEVEL_CONFIG: Record<RiskLevel, RiskLevelConfig> = {
  [RiskLevel.LOW]: {
    level: RiskLevel.LOW,
    range: { min: 0, max: 30 },
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Minimal risk, standard monitoring',
    action: 'Continue current practices'
  },
  [RiskLevel.MEDIUM]: {
    level: RiskLevel.MEDIUM,
    range: { min: 31, max: 60 },
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Moderate risk, enhanced monitoring',
    action: 'Review and improve'
  },
  [RiskLevel.HIGH]: {
    level: RiskLevel.HIGH,
    range: { min: 61, max: 80 },
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Elevated risk, immediate attention required',
    action: 'Take immediate action'
  },
  [RiskLevel.CRITICAL]: {
    level: RiskLevel.CRITICAL,
    range: { min: 81, max: 100 },
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    description: 'Critical risk, urgent intervention needed',
    action: 'Emergency response required'
  }
}

export interface UnifiedRiskCategory {
  id: string
  name: string
  weight: number // 0-1 (percentage as decimal)
  description: string
  icon: string
}

export const RISK_CATEGORIES: UnifiedRiskCategory[] = [
  {
    id: 'security_risk_management',
    name: 'Security & Risk Management',
    weight: 0.25, // 25%
    description: 'Fire safety, CCTV, compliance',
    icon: '🛡️'
  },
  {
    id: 'property_asset_factors',
    name: 'Property & Asset Factors', 
    weight: 0.20, // 20%
    description: 'Building condition, electrical, drainage',
    icon: '🏢'
  },
  {
    id: 'operational_risk',
    name: 'Operational Risk',
    weight: 0.15, // 15%
    description: 'Staff training, procedures, turnover',
    icon: '⚙️'
  },
  {
    id: 'business_specific_factors',
    name: 'Business-Specific Factors',
    weight: 0.10, // 10%
    description: 'Industry type, size, claims history',
    icon: '📊'
  },
  {
    id: 'location_based_factors',
    name: 'Location-Based Factors',
    weight: 0.08, // 8%
    description: 'Crime rate, postcode risk, hazards',
    icon: '📍'
  },
  {
    id: 'financial_administrative',
    name: 'Financial & Administrative',
    weight: 0.08, // 8%
    description: 'Credit history, stability',
    icon: '💰'
  },
  {
    id: 'specialised_risk',
    name: 'Specialised Risk',
    weight: 0.08, // 8%
    description: 'Cybersecurity, supply chain',
    icon: '🔒'
  },
  {
    id: 'market_external',
    name: 'Market & External',
    weight: 0.06, // 6%
    description: 'Inflation, regulatory changes',
    icon: '📈'
  }
] 