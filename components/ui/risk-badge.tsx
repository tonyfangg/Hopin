import React from 'react'
import { RiskScoringUtils } from '@/app/lib/utils/risk-scoring'

interface RiskBadgeProps {
  score: number
  showScore?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  score, 
  showScore = true, 
  size = 'md',
  className = '' 
}) => {
  const level = RiskScoringUtils.scoreToRiskLevel(score)
  const config = RiskScoringUtils.getRiskLevelConfig(level)
  const display = RiskScoringUtils.getRiskLevelDisplay(score)

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${config.bgColor} ${sizeClasses[size]} ${className}`}
    >
      {display}
      {showScore && <span className="font-bold">({score})</span>}
    </span>
  )
} 