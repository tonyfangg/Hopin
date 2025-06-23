'use client'
import { TrendingUp } from 'lucide-react'

export function CreditScoreHero() {
  return (
    <div className="bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-900 rounded-xl p-8 text-white mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium mb-2">Credit Score</h2>
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold">750</span>
            <span className="text-green-400 font-medium">↗ +5pts</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-400">↗</span>
            <span className="text-green-400 font-medium">Excellent</span>
          </div>
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-white/80" />
        </div>
      </div>
    </div>
  )
} 