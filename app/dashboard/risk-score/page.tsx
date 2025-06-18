'use client'
import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';

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
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.name}
            disabled={tab.locked}
            onClick={() => !tab.locked && setActiveTab(tab.name)}
            className={`px-6 py-3 rounded-full font-semibold text-base focus:outline-none transition-all
              ${tab.locked ? 'bg-gray-100 text-gray-400 flex items-center gap-2' : ''}
              ${activeTab === tab.name ? 'bg-blue-600 text-white' : (!tab.locked ? 'bg-gray-100 text-gray-500' : '')}
            `}
          >
            {tab.name}
            {tab.locked && <LockClosedIcon className="w-5 h-5 ml-1" />}
          </button>
        ))}
      </div>

      {/* Insurance Risk Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center mb-6">
        <div className="flex w-full justify-between items-center mb-2">
          <span className="text-xl font-semibold text-slate-900">Insurance Risk Profile</span>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold text-sm">Low Risk</span>
        </div>
        <div className="flex flex-col items-center my-4">
          <div className="rounded-full bg-green-50 w-56 h-56 flex flex-col items-center justify-center mb-4">
            <span className="text-6xl font-bold text-slate-900">750</span>
            <span className="text-xl text-slate-500">Safety Score</span>
            <span className="text-green-600 font-semibold mt-2">↑ +5</span>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-slate-900 mb-1">Excellent Safety Record</div>
            <div className="text-slate-500 text-base">Your data indicates 40% lower risk than industry average</div>
          </div>
        </div>
        <div className="w-full bg-green-50 rounded-xl p-4 flex items-center gap-4 mt-4">
          <div className="bg-blue-100 text-blue-600 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 17.25h16.5M3.75 12h16.5" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Potential Insurance Savings</div>
            <div className="text-3xl font-bold text-green-600 leading-tight">25-35%</div>
            <div className="text-slate-500 text-sm">Based on your risk management data</div>
          </div>
        </div>
      </div>

      {/* Insurance Risk Factors */}
      <div className="bg-white rounded-2xl p-6 shadow mb-6">
        <div className="text-xl font-semibold text-slate-900 mb-4">Insurance Risk Factors</div>
        <div className="space-y-5">
          {riskFactors.map(factor => (
            <div key={factor.name} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">{factor.name}</div>
                <div className="text-slate-500 text-sm">{factor.desc}</div>
              </div>
              <div className="flex items-center gap-3 min-w-[120px]">
                <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-3 rounded-full ${factor.color}`} style={{ width: `${factor.score}%` }}></div>
                </div>
                <span className="font-bold text-lg text-slate-900">{factor.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Insights Coming Soon */}
      <div className="rounded-2xl p-6 shadow bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center text-white">
        <div className="mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z" />
          </svg>
        </div>
        <div className="text-2xl font-semibold mb-2">Insurance Insights Coming Soon</div>
        <div className="mb-4 text-white/90 text-center max-w-xs">We're analyzing your excellent operations data to provide personalized insurance recommendations</div>
        <button className="mt-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold transition">Notify me when available</button>
      </div>
    </div>
  );
} 