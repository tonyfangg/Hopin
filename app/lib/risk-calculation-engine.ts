// =====================================================
// SOPHISTICATED RISK CALCULATION ENGINE
// =====================================================

import { 
  RiskCategory, 
  RiskCategoryScore, 
  RiskFactorScore, 
  PropertyRiskAssessment, 
  RiskInputData 
} from './types/risk-types';
import { RiskCalculationUtils } from './utils/risk-utils';

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
            unit: 'coverage_%'
          },
          {
            id: 'compliance_timeliness',
            name: 'Compliance Timeliness',
            categoryId: 'security_risk',
            weight: 0.35,
            value: RiskCalculationUtils.calculateComplianceTimeliness(data),
            maxValue: 100,
            unit: 'timeliness_score'
          }
        ]
      },

      {
        id: 'operational_risk',
        name: 'Operational Risk',
        weight: 0.15,
        description: 'Staff contracts, handbook consent, training, turnover',
        factors: [
          {
            id: 'staff_training',
            name: 'Staff Training Compliance',
            categoryId: 'operational_risk',
            weight: 0.35,
            value: RiskCalculationUtils.calculateStaffTrainingScore(data),
            maxValue: 100,
            unit: 'training_%'
          },
          {
            id: 'staff_turnover',
            name: 'Staff Turnover Rate',
            categoryId: 'operational_risk',
            weight: 0.25,
            value: data.staffTurnoverRate || 30,
            maxValue: 100,
            unit: 'turnover_%'
          },
          {
            id: 'handbook_compliance',
            name: 'Handbook Compliance',
            categoryId: 'operational_risk',
            weight: 0.2,
            value: data.handbookCompliance || 85,
            maxValue: 100,
            unit: 'compliance_%'
          },
          {
            id: 'contract_compliance',
            name: 'Contract Compliance',
            categoryId: 'operational_risk',
            weight: 0.2,
            value: data.contractCompliance || 90,
            maxValue: 100,
            unit: 'compliance_%'
          }
        ]
      },

      {
        id: 'financial_admin',
        name: 'Financial & Administrative',
        weight: 0.12,
        description: 'Credit history, financial stability, admin quality',
        factors: [
          {
            id: 'credit_history',
            name: 'Credit History Rating',
            categoryId: 'financial_admin',
            weight: 0.4,
            value: data.creditHistoryScore || 75,
            maxValue: 100,
            unit: 'credit_score'
          },
          {
            id: 'financial_stability',
            name: 'Financial Stability',
            categoryId: 'financial_admin',
            weight: 0.35,
            value: data.financialStability || 80,
            maxValue: 100,
            unit: 'stability_score'
          },
          {
            id: 'admin_quality',
            name: 'Administrative Quality',
            categoryId: 'financial_admin',
            weight: 0.25,
            value: data.adminQuality || 70,
            maxValue: 100,
            unit: 'quality_score'
          }
        ]
      },

      {
        id: 'market_external',
        name: 'Market & External Factors',
        weight: 0.02,
        description: 'Inflation, regulatory changes',
        factors: [
          {
            id: 'inflation_impact',
            name: 'Inflation Impact',
            categoryId: 'market_external',
            weight: 0.6,
            value: data.inflationImpact || 40,
            maxValue: 100,
            unit: 'impact_score'
          },
          {
            id: 'regulatory_changes',
            name: 'Regulatory Change Risk',
            categoryId: 'market_external',
            weight: 0.4,
            value: data.regulatoryChangeRisk || 30,
            maxValue: 100,
            unit: 'change_risk'
          }
        ]
      },

      {
        id: 'specialized_risk',
        name: 'Specialised Risk Factors',
        weight: 0.08,
        description: 'Cybersecurity, supply chain dependency',
        factors: [
          {
            id: 'cybersecurity',
            name: 'Cybersecurity Posture',
            categoryId: 'specialized_risk',
            weight: 0.6,
            value: data.cybersecurityScore || 60,
            maxValue: 100,
            unit: 'security_score'
          },
          {
            id: 'supply_chain',
            name: 'Supply Chain Dependency',
            categoryId: 'specialized_risk',
            weight: 0.4,
            value: data.supplyChainDependency || 50,
            maxValue: 100,
            unit: 'dependency_score'
          }
        ]
      }
    ];
  }

  /**
   * Calculate score for a risk category
   */
  private static calculateCategoryScore(category: RiskCategory): RiskCategoryScore {
    const factorScores: RiskFactorScore[] = category.factors.map(factor => {
      // Normalize the factor value (0-100 scale)
      const normalizedScore = RiskCalculationUtils.normalizeValue(factor.value, factor.maxValue);
      
      return {
        factorId: factor.id,
        factorName: factor.name,
        rawValue: factor.value,
        normalizedScore,
        weight: factor.weight,
        contribution: normalizedScore * factor.weight
      };
    });

    // Calculate weighted average for the category
    const categoryScore = factorScores.reduce((sum, factor) => 
      sum + factor.contribution, 0
    );

    return {
      categoryId: category.id,
      categoryName: category.name,
      score: Math.round(categoryScore * 100) / 100,
      weightedContribution: categoryScore * category.weight,
      factors: factorScores
    };
  }

  /**
   * Calculate overall risk score
   */
  private static calculateOverallScore(categoryScores: RiskCategoryScore[]): number {
    const weightedSum = categoryScores.reduce((sum, category) => 
      sum + category.weightedContribution, 0
    );
    
    return Math.round(weightedSum * 100) / 100;
  }
}

// =====================================================
// USAGE EXAMPLE
// =====================================================

export function calculatePropertyRiskExample() {
  const riskData: RiskInputData = {
    // Property data from your database
    buildingAge: 15,
    buildingCondition: 'good',
    electricalCompliance: 92,
    lastElectricalInspection: 4,
    drainageMaintenanceFrequency: 6,
    
    // Staff data
    trainedStaff: 18,
    totalStaff: 20,
    averageTrainingAge: 8,
    
    // Compliance data
    fireAlarmCompliance: 95,
    extinguisherCompliance: 88,
    emergencyLightingCompliance: 90,
    overdueComplianceItems: 2,
    totalComplianceItems: 25,
    
    // External factors
    crimeRate: 35,
    postcodeRisk: 40,
    cybersecurityScore: 75
  };

  const assessment = RiskCalculationEngine.calculatePropertyRisk(
    'property-123',
    riskData
  );

  return assessment;
} 