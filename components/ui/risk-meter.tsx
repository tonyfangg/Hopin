import React from 'react'
import { RiskScoringUtils } from '@/app/lib/utils/risk-scoring'

interface RiskMeterProps {
  score: number
  size?: number
  showLabel?: boolean
  showScore?: boolean
  className?: string
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  size = 120,
  showLabel = true,
  showScore = true,
  className = ''
}) => {
  const config = RiskScoringUtils.getRiskConfigByScore(score)
  const level = RiskScoringUtils.scoreToRiskLevel(score)
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  // Get color based on risk level
  const getStrokeColor = () => {
    switch (level) {
      case 'LOW': return '#10b981' // emerald-500
      case 'MEDIUM': return '#f59e0b' // amber-500
      case 'HIGH': return '#ef4444' // red-500
      case 'CRITICAL': return '#dc2626' // red-600
      default: return '#6b7280' // gray-500
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showScore && (
            <div className="text-2xl font-bold text-slate-900">{score}</div>
          )}
          {showLabel && (
            <div className={`text-xs font-medium ${config.color}`}>
              {level.replace('_', ' ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 