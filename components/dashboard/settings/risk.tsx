'use client'

import { useState } from 'react'

export function RiskSettings() {
  const [riskSettings, setRiskSettings] = useState({
    alertThreshold: 75,
    autoNotifications: true,
    weeklyReports: true,
    monthlyAnalysis: true
  })

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <span className="text-xl">🛡️</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Risk Preferences</h3>
          <p className="text-slate-600">Customize risk monitoring</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Risk Alert Threshold
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={riskSettings.alertThreshold}
            onChange={(e) => setRiskSettings({...riskSettings, alertThreshold: Number(e.target.value)})}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-slate-500 mt-1">
            <span>50</span>
            <span className="font-medium">{riskSettings.alertThreshold}</span>
            <span>100</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Automatic Notifications</h4>
              <p className="text-sm text-slate-600">Get alerts when risk scores change</p>
            </div>
            <input
              type="checkbox"
              checked={riskSettings.autoNotifications}
              onChange={(e) => setRiskSettings({...riskSettings, autoNotifications: e.target.checked})}
              className="h-4 w-4 text-blue-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Weekly Reports</h4>
              <p className="text-sm text-slate-600">Receive weekly risk summaries</p>
            </div>
            <input
              type="checkbox"
              checked={riskSettings.weeklyReports}
              onChange={(e) => setRiskSettings({...riskSettings, weeklyReports: e.target.checked})}
              className="h-4 w-4 text-blue-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Monthly Analysis</h4>
              <p className="text-sm text-slate-600">Detailed monthly risk analysis</p>
            </div>
            <input
              type="checkbox"
              checked={riskSettings.monthlyAnalysis}
              onChange={(e) => setRiskSettings({...riskSettings, monthlyAnalysis: e.target.checked})}
              className="h-4 w-4 text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 