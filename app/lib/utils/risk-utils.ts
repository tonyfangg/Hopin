// =====================================================
// RISK CALCULATION UTILITIES
// =====================================================

import { RiskInputData } from '../types/risk-types';

export class RiskCalculationUtils {
  
  /**
   * Calculate building condition score based on age and condition
   */
  static calculateBuildingConditionScore(data: RiskInputData): number {
    const age = data.buildingAge || 15;
    const condition = data.buildingCondition || 'good';
    
    // Age factor (newer is better)
    let ageScore = Math.max(0, 100 - (age * 2));
    
    // Condition multiplier
    const conditionMultiplier = {
      excellent: 0.8,
      good: 1.0,
      fair: 1.3,
      poor: 1.8,
      critical: 2.5
    };
    
    return Math.min(100, ageScore * (conditionMultiplier[condition] || 1.0));
  }

  /**
   * Calculate electrical compliance score
   */
  static calculateElectricalComplianceScore(data: RiskInputData): number {
    const compliance = data.electricalCompliance || 85;
    const lastInspection = data.lastElectricalInspection || 6; // months ago
    
    // Base compliance score
    let score = compliance;
    
    // Deduct points for overdue inspections
    if (lastInspection > 12) score -= 20;
    else if (lastInspection > 6) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate drainage maintenance score
   */
  static calculateDrainageMaintenanceScore(data: RiskInputData): number {
    const maintenanceFrequency = data.drainageMaintenanceFrequency || 6; // months
    const lastIssues = data.lastDrainageIssues || 12; // months since last issue
    
    // Good maintenance = higher score
    let score = 100 - (maintenanceFrequency * 5);
    
    // Recent issues reduce score
    if (lastIssues < 6) score -= 30;
    else if (lastIssues < 12) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate fire safety score
   */
  static calculateFireSafetyScore(data: RiskInputData): number {
    const alarmCompliance = data.fireAlarmCompliance || 90;
    const extinguisherCompliance = data.extinguisherCompliance || 85;
    const emergencyLighting = data.emergencyLightingCompliance || 80;
    
    // Weighted average of fire safety components
    return (alarmCompliance * 0.4) + 
           (extinguisherCompliance * 0.35) + 
           (emergencyLighting * 0.25);
  }

  /**
   * Calculate compliance timeliness score
   */
  static calculateComplianceTimeliness(data: RiskInputData): number {
    const overdueItems = data.overdueComplianceItems || 0;
    const totalItems = data.totalComplianceItems || 20;
    
    const complianceRate = ((totalItems - overdueItems) / totalItems) * 100;
    return Math.max(0, complianceRate);
  }

  /**
   * Calculate staff training score
   */
  static calculateStaffTrainingScore(data: RiskInputData): number {
    const trainedStaff = data.trainedStaff || 15;
    const totalStaff = data.totalStaff || 20;
    const averageTrainingAge = data.averageTrainingAge || 8; // months
    
    let score = (trainedStaff / totalStaff) * 100;
    
    // Deduct for old training
    if (averageTrainingAge > 24) score -= 20;
    else if (averageTrainingAge > 12) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * Determine risk level based on score
   */
  static determineRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score <= 25) return 'LOW';
    if (score <= 50) return 'MEDIUM';
    if (score <= 75) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Normalize a value to 0-100 scale
   */
  static normalizeValue(value: number, maxValue: number): number {
    return Math.min(100, (value / maxValue) * 100);
  }

  /**
   * Calculate weighted average
   */
  static calculateWeightedAverage(values: number[], weights: number[]): number {
    if (values.length !== weights.length) {
      throw new Error('Values and weights arrays must have the same length');
    }
    
    const weightedSum = values.reduce((sum, value, index) => 
      sum + (value * weights[index]), 0
    );
    
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }
} 