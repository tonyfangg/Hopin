// =====================================================
// SOPHISTICATED RISK CALCULATION ENGINE
// File: app/lib/risk-calculation/engine.ts
// =====================================================

import { 
  RiskCategory, 
  RiskCategoryScore, 
  RiskFactorScore, 
  PropertyRiskAssessment, 
  RiskInputData 
} from '../types/risk-types';
import { RiskCalculationUtils } from '../utils/risk-utils';

export class RiskCalculationEngine {
  
  /**
   * Calculate comprehensive risk score for a property
   */
  static calculatePropertyRisk(
    propertyId: string,
    riskData: RiskInputData
  ): PropertyRiskAssessment {
    
    // 1. Build risk categories with current data
    const categories = this.buildRiskCategories(riskData);
    
    // 2. Calculate scores for each category
    const categoryScores = categories.map(category => 
      this.calculateCategoryScore(category)
    );
    
    // 3. Calculate overall weighted score
    const overallScore = this.calculateOverallScore(categoryScores);
    
    // 4. Determine risk level
    const riskLevel = RiskCalculationUtils.determineRiskLevel(overallScore);
    
    return {
      propertyId,
      assessmentDate: new Date(),
      categories,
      overallScore,
      riskLevel,
      breakdown: categoryScores
    };
  }

  /**
   * Build risk categories based on your specification
   */
  private static buildRiskCategories(data: RiskInputData): RiskCategory[] {
    return [
      {
        id: 'business_specific',
        name: 'Business-Specific Factors',
        weight: 0.10,
        description: 'Industry type, business size, revenue, claims history',
        factors: [
          {
            id: 'industry_risk',
            name: 'Industry Risk Level',
            categoryId: 'business_specific',
            weight: 0.3,
            value: data.industryRiskScore || 50,
            maxValue: 100,
            unit: 'score'
          },
          {
            id: 'business_size',
            name: 'Business Size Risk',
            categoryId: 'business_specific',
            weight: 0.2,
            value: data.businessSizeRisk || 30,
            maxValue: 100,
            unit: 'score'
          },
          {
            id: 'revenue_volatility',
            name: 'Revenue Volatility',
            categoryId: 'business_specific',
            weight: 0.25,
            value: data.revenueVolatility || 40,
            maxValue: 100,
            unit: 'score'
          },
          {
            id: 'claims_history',
            name: 'Historical Claims Frequency',
            categoryId: 'business_specific',
            weight: 0.25,
            value: data.claimsHistory || 20,
            maxValue: 100,
            unit: 'score'
          }
        ]
      },
      
      {
        id: 'location_based',
        name: 'Location-Based Factors',
        weight: 0.08,
        description: 'Crime rate, postcode risk, natural hazard exposure',
        factors: [
          {
            id: 'crime_rate',
            name: 'Local Crime Rate',
            categoryId: 'location_based',
            weight: 0.4,
            value: data.crimeRate || 30,
            maxValue: 100,
            unit: 'incidents/1000'
          },
          {
            id: 'postcode_risk',
            name: 'Postcode Risk Rating',
            categoryId: 'location_based',
            weight: 0.35,
            value: data.postcodeRisk || 25,
            maxValue: 100,
            unit: 'risk_band'
          },
          {
            id: 'natural_hazard',
            name: 'Natural Hazard Exposure',
            categoryId: 'location_based',
            weight: 0.25,
            value: data.naturalHazardExposure || 15,
            maxValue: 100,
            unit: 'exposure_level'
          }
        ]
      },

      {
        id: 'property_asset',
        name: 'Property & Asset Factors',
        weight: 0.20,
        description: 'Building age/condition, stock value, PAT testing, drainage maintenance',
        factors: [
          {
            id: 'building_condition',
            name: 'Building Age & Condition',
            categoryId: 'property_asset',
            weight: 0.3,
            value: RiskCalculationUtils.calculateBuildingConditionScore(data),
            maxValue: 100,
            unit: 'condition_score'
          },
          {
            id: 'stock_value_risk',
            name: 'Stock Value Risk',
            categoryId: 'property_asset',
            weight: 0.25,
            value: data.stockValueRisk || 40,
            maxValue: 100,
            unit: 'value_band'
          },
          {
            id: 'electrical_compliance',
            name: 'PAT Testing Compliance',
            categoryId: 'property_asset',
            weight: 0.25,
            value: RiskCalculationUtils.calculateElectricalComplianceScore(data),
            maxValue: 100,
            unit: 'compliance_%'
          },
          {
            id: 'drainage_maintenance',
            name: 'Drainage Maintenance Status',
            categoryId: 'property_asset',
            weight: 0.2,
            value: RiskCalculationUtils.calculateDrainageMaintenanceScore(data),
            maxValue: 100,
            unit: 'maintenance_score'
          }
        ]
      },

      {
        id: 'security_risk',
        name: 'Security & Risk Management',
        weight: 0.25,
        description: 'Fire alarm/extinguisher checks, CCTV, alarms, compliance timeliness',
        factors: [
          {
            id: 'fire_safety_systems',
            name: 'Fire Safety Systems',
            categoryId: 'security_risk',
            weight: 0.35,
            value: RiskCalculationUtils.calculateFireSafetyScore(data),
            maxValue: 100,
            unit: 'safety_score'
          },
          {
            id: 'security_systems',
            name: 'Security Systems (CCTV/Alarms)',
            categoryId: 'security_risk',
            weight: 0.3,
            value: data.securitySystemsScore || 70,
            maxValue: 100,
            unit: 'security_score'
          },
          {
            id: 'compliance_timeliness',
            name: 'Compliance Timeliness',
            categoryId: 'security_risk',
            weight: 0.2,
            value: RiskCalculationUtils.calculateComplianceTimelinessScore(data),
            maxValue: 100,
            unit: 'timeliness_%'
          },
          {
            id: 'emergency_procedures',
            name: 'Emergency Procedures',
            categoryId: 'security_risk',
            weight: 0.15,
            value: data.emergencyProceduresScore || 80,
            maxValue: 100,
            unit: 'procedure_score'
          }
        ]
      },

      {
        id: 'operational_risk',
        name: 'Operational Risk',
        weight: 0.15,
        description: 'Staff training, procedures, turnover, handbook compliance',
        factors: [
          {
            id: 'staff_training',
            name: 'Staff Training & Certification',
            categoryId: 'operational_risk',
            weight: 0.4,
            value: RiskCalculationUtils.calculateStaffTrainingScore(data),
            maxValue: 100,
            unit: 'training_%'
          },
          {
            id: 'staff_turnover',
            name: 'Staff Turnover Rate',
            categoryId: 'operational_risk',
            weight: 0.25,
            value: data.staffTurnoverRate || 15,
            maxValue: 100,
            unit: 'turnover_%'
          },
          {
            id: 'procedure_compliance',
            name: 'Procedure Compliance',
            categoryId: 'operational_risk',
            weight: 0.2,
            value: data.handbookCompliance || 85,
            maxValue: 100,
            unit: 'compliance_%'
          },
          {
            id: 'contract_management',
            name: 'Contract Management',
            categoryId: 'operational_risk',
            weight: 0.15,
            value: data.contractCompliance || 90,
            maxValue: 100,
            unit: 'contract_%'
          }
        ]
      },

      {
        id: 'financial_administrative',
        name: 'Financial & Administrative',
        weight: 0.08,
        description: 'Credit history, financial stability, admin quality',
        factors: [
          {
            id: 'credit_history',
            name: 'Credit History Score',
            categoryId: 'financial_administrative',
            weight: 0.4,
            value: data.creditHistoryScore || 75,
            maxValue: 100,
            unit: 'credit_score'
          },
          {
            id: 'financial_stability',
            name: 'Financial Stability',
            categoryId: 'financial_administrative',
            weight: 0.35,
            value: data.financialStability || 80,
            maxValue: 100,
            unit: 'stability_score'
          },
          {
            id: 'admin_quality',
            name: 'Administrative Quality',
            categoryId: 'financial_administrative',
            weight: 0.25,
            value: data.adminQuality || 85,
            maxValue: 100,
            unit: 'quality_score'
          }
        ]
      },

      {
        id: 'market_external',
        name: 'Market & External',
        weight: 0.06,
        description: 'Inflation impact, regulatory changes, market conditions',
        factors: [
          {
            id: 'inflation_impact',
            name: 'Inflation Impact',
            categoryId: 'market_external',
            weight: 0.5,
            value: data.inflationImpact || 20,
            maxValue: 100,
            unit: 'impact_score'
          },
          {
            id: 'regulatory_changes',
            name: 'Regulatory Change Risk',
            categoryId: 'market_external',
            weight: 0.5,
            value: data.regulatoryChangeRisk || 15,
            maxValue: 100,
            unit: 'change_risk'
          }
        ]
      },

      {
        id: 'specialised_risk',
        name: 'Specialised Risk',
        weight: 0.08,
        description: 'Cybersecurity, supply chain dependency, specialised equipment',
        factors: [
          {
            id: 'cybersecurity',
            name: 'Cybersecurity Score',
            categoryId: 'specialised_risk',
            weight: 0.6,
            value: data.cybersecurityScore || 60,
            maxValue: 100,
            unit: 'security_score'
          },
          {
            id: 'supply_chain',
            name: 'Supply Chain Dependency',
            categoryId: 'specialised_risk',
            weight: 0.4,
            value: data.supplyChainDependency || 30,
            maxValue: 100,
            unit: 'dependency_%'
          }
        ]
      }
    ];
  }

  /**
   * Calculate score for a single category
   */
  private static calculateCategoryScore(category: RiskCategory): RiskCategoryScore {
    const factorScores: RiskFactorScore[] = category.factors.map(factor => {
      const normalizedScore = RiskCalculationUtils.normalizeScore(factor.value, factor.maxValue);
      const contribution = normalizedScore * factor.weight;
      
      return {
        factorId: factor.id,
        factorName: factor.name,
        rawValue: factor.value,
        normalizedScore,
        weight: factor.weight,
        contribution
      };
    });

    const totalContribution = factorScores.reduce((sum, factor) => sum + factor.contribution, 0);
    const categoryScore = totalContribution * 100; // Convert to 0-100 scale
    const weightedContribution = categoryScore * category.weight;

    return {
      categoryId: category.id,
      categoryName: category.name,
      score: Math.round(categoryScore * 100) / 100,
      weightedContribution: Math.round(weightedContribution * 100) / 100,
      factors: factorScores
    };
  }

  /**
   * Calculate overall weighted score from all categories
   */
  private static calculateOverallScore(categoryScores: RiskCategoryScore[]): number {
    const totalWeightedScore = categoryScores.reduce((sum, category) => sum + category.weightedContribution, 0);
    return Math.round(totalWeightedScore * 100) / 100;
  }
}

/**
 * Example usage function
 */
export function calculatePropertyRiskExample() {
  const sampleData: RiskInputData = {
    industryRiskScore: 65,
    businessSizeRisk: 40,
    revenueVolatility: 55,
    claimsHistory: 25,
    crimeRate: 35,
    postcodeRisk: 30,
    naturalHazardExposure: 20,
    buildingAge: 15,
    stockValueRisk: 45,
    lastElectricalInspection: 8,
    drainageMaintenanceFrequency: 12,
    lastDrainageIssues: 6,
    fireAlarmCompliance: 85,
    extinguisherCompliance: 90,
    emergencyLightingCompliance: 88,
    securitySystemsScore: 75,
    overdueComplianceItems: 3,
    totalComplianceItems: 25,
    trainedStaff: 12,
    totalStaff: 15,
    averageTrainingAge: 8,
    staffTurnoverRate: 12,
    handbookCompliance: 85,
    contractCompliance: 90,
    creditHistoryScore: 78,
    financialStability: 82,
    adminQuality: 88,
    inflationImpact: 25,
    regulatoryChangeRisk: 18,
    cybersecurityScore: 65,
    supplyChainDependency: 35
  };

  return RiskCalculationEngine.calculatePropertyRisk('example-property-id', sampleData);
} 