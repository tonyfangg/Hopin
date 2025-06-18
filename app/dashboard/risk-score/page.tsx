'use client'
import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { RiskOverview } from '@/components/dashboard/risk-overview'
import { RiskFactors } from '@/components/dashboard/risk-factors'
import { InsuranceSavings } from '@/components/dashboard/insurance-savings'

const TABS = [
  { name: 'Risk Overview', active: true },
  { name: 'Claims History', active: false },
  { name: 'Predictions', active: false, locked: true },
];

const riskFactors = [
  { name: 'Fire Safety Compliance', score: 95, desc: 'Major reduction', color: 'bg-green-500' },
  { name: 'Security Systems', score: 88, desc: 'Moderate reduction', color: 'bg-yellow-400' },
  { name: 'Maintenance Records', score: 92, desc: 'Major reduction', color: 'bg-green-500' },
  { name: 'Claims History', score: 98, desc: 'Significant reduction', color: 'bg-green-500' },
  { name: 'Location Risk', score: 78, desc: 'Minor increase', color: 'bg-red-500' },
];

export default function RiskScorePage() {
  const [activeTab, setActiveTab] = useState('Risk Overview');

  return (
    <div className="space-y-8">
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

      {/* Main Risk Score */}
      <RiskOverview />
      
      {/* Risk Factors */}
      <RiskFactors />
      
      {/* Insurance Savings */}
      <InsuranceSavings />
    </div>
  );
} 