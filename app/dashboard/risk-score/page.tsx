'use client'
import { useState } from 'react';
import { UnifiedRiskOverview } from '@/components/dashboard/unified-risk-overview'
import { RiskFactors } from '@/components/dashboard/risk-factors'
import { InsuranceSavings } from '@/components/dashboard/insurance-savings'

export default function RiskScorePage() {
  const [activeTab, setActiveTab] = useState('Risk Overview');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Risk Assessment</h1>
        <p className="text-slate-600">Comprehensive risk analysis and scoring for your properties</p>
      </div>

      {/* Risk Overview Tabs */}
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium">
          Risk Overview
        </button>
        <button className="bg-slate-100 text-slate-600 px-6 py-3 rounded-full font-medium hover:bg-slate-200">
          Claims History
        </button>
        <button className="bg-slate-100 text-slate-400 px-6 py-3 rounded-full font-medium cursor-not-allowed">
          Predictions 🔒
        </button>
      </div>

      {/* Unified Risk Overview */}
      <UnifiedRiskOverview />
      
      {/* Risk Factors */}
      <RiskFactors />
      
      {/* Insurance Savings */}
      <InsuranceSavings />
    </div>
  );
} 