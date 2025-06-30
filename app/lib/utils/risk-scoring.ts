import { RiskLevel, RiskLevelConfig, RISK_LEVEL_CONFIG, RiskScore, UnifiedRiskCategory, RISK_CATEGORIES } from '@/app/lib/types/risk-types'

export class RiskScoringUtils {
  /**
   * Convert a score (0-100) to risk level
   */
  static scoreToRiskLevel(score: number): RiskLevel {
    if (score <= 30) return RiskLevel.LOW
    if (score <= 60) return RiskLevel.MEDIUM
    if (score <= 80) return RiskLevel.HIGH
    return RiskLevel.CRITICAL
  }

  /**
   * Get risk level configuration
   */
  static getRiskLevelConfig(level: RiskLevel): RiskLevelConfig {
    return RISK_LEVEL_CONFIG[level]
  }

  /**
   * Get risk level configuration by score
   */
  static getRiskConfigByScore(score: number): RiskLevelConfig {
    const level = this.scoreToRiskLevel(score)
    return this.getRiskLevelConfig(level)
  }

  /**
   * Convert safety score (0-100) to risk score (0-100, inverted)
   * Safety score of 100 = Risk score of 0
   * Safety score of 0 = Risk score of 100
   */
  static safetyToRiskScore(safetyScore: number): number {
    return Math.max(0, Math.min(100, 100 - safetyScore))
  }

  /**
   * Convert risk score (0-100) to safety score (0-100, inverted)
   */
  static riskToSafetyScore(riskScore: number): number {
    return Math.max(0, Math.min(100, 100 - riskScore))
  }

  /**
   * Get risk level display text for UI
   */
  static getRiskLevelDisplay(score: number): string {
    const level = this.scoreToRiskLevel(score)
    switch (level) {
      case RiskLevel.LOW:
        return 'Low Risk'
      case RiskLevel.MEDIUM:
        return 'Medium Risk'
      case RiskLevel.HIGH:
        return 'High Risk'
      case RiskLevel.CRITICAL:
        return 'Critical Risk'
      default:
        return 'Unknown Risk'
    }
  }

  /**
   * Get CSS classes for risk level styling
   */
  static getRiskLevelStyles(score: number): { color: string; bgColor: string; borderColor: string } {
    const config = this.getRiskConfigByScore(score)
    return {
      color: config.color,
      bgColor: config.bgColor,
      borderColor: config.bgColor.replace('bg-', 'border-')
    }
  }

  /**
   * Calculate overall risk score from category scores
   */
  static calculateOverallRisk(categoryScores: Record<string, number>): number {
    let totalWeightedScore = 0
    let totalWeight = 0

    RISK_CATEGORIES.forEach(category => {
      const score = categoryScores[category.id] || 0
      totalWeightedScore += score * category.weight
      totalWeight += category.weight
    })

    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0
  }

  /**
   * Create a RiskScore object
   */
  static createRiskScore(value: number, category: string = 'Overall'): RiskScore {
    const level = this.scoreToRiskLevel(value)
    const config = this.getRiskLevelConfig(level)
    
    return {
      value,
      level,
      category,
      description: config.description
    }
  }

  /**
   * Get risk level color for charts and visualizations
   */
  static getRiskLevelColor(score: number): string {
    const level = this.scoreToRiskLevel(score)
    switch (level) {
      case RiskLevel.LOW:
        return '#10b981' // emerald-500
      case RiskLevel.MEDIUM:
        return '#f59e0b' // amber-500
      case RiskLevel.HIGH:
        return '#ef4444' // red-500
      case RiskLevel.CRITICAL:
        return '#dc2626' // red-600
      default:
        return '#6b7280' // gray-500
    }
  }

  /**
   * Validate risk score is within valid range
   */
  static validateRiskScore(score: number): boolean {
    return score >= 0 && score <= 100 && !isNaN(score)
  }

  /**
   * Normalize a value to 0-100 scale
   */
  static normalizeToRiskScale(value: number, min: number, max: number): number {
    if (max === min) return 50 // Default to medium risk if no range
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  }

  /**
   * Get risk trend direction (improving, stable, worsening)
   */
  static getRiskTrend(currentScore: number, previousScore: number): 'improving' | 'stable' | 'worsening' {
    const difference = currentScore - previousScore
    if (Math.abs(difference) < 5) return 'stable'
    return difference > 0 ? 'worsening' : 'improving'
  }
} 