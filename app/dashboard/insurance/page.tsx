'use client'

import { useState, useEffect } from 'react'

export default function InsurancePage() {
  const [insuranceData, setInsuranceData] = useState({
    hasInsurance: true,
    insuranceProvider: 'Hiscox',
    currentPremium: 850,
    policyExpiry: '2025-06-15',
    employeeCount: '2-3 people',
    annualTurnover: '£50,000 - £150,000',
    operatesIn: 'UK only',
    managementExperience: '3-5 years experience',
    qualifications: ['Food Safety/Hygiene certification', 'Health & Safety qualification']
  })

  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilExpiry = getDaysUntilExpiry(insuranceData.policyExpiry)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Insurance Management</h1>
        <p className="text-slate-600">Manage your business insurance policies and requirements</p>
      </div>

      {/* Current Insurance Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Current Insurance Policy</h2>
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏢</span>
              <h3 className="font-semibold text-slate-900">Provider</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{insuranceData.insuranceProvider}</p>
            <p className="text-sm text-slate-600">Insurance Provider</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💷</span>
              <h3 className="font-semibold text-slate-900">Annual Premium</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {formatCurrency(insuranceData.currentPremium)}
            </p>
            <p className="text-sm text-slate-600">Per year</p>
          </div>

          <div className={`rounded-lg p-4 ${daysUntilExpiry < 30 ? 'bg-red-50' : daysUntilExpiry < 90 ? 'bg-amber-50' : 'bg-green-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📅</span>
              <h3 className="font-semibold text-slate-900">Policy Expiry</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">
              {formatDate(insuranceData.policyExpiry)}
            </p>
            <p className={`text-sm font-medium ${daysUntilExpiry < 30 ? 'text-red-600' : daysUntilExpiry < 90 ? 'text-amber-600' : 'text-green-600'}`}>
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
            </p>
          </div>
        </div>

        {daysUntilExpiry < 90 && (
          <div className={`mt-6 p-4 rounded-lg border ${daysUntilExpiry < 30 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-2">
              <span className={daysUntilExpiry < 30 ? 'text-red-600' : 'text-amber-600'}>⚠️</span>
              <span className={`font-medium ${daysUntilExpiry < 30 ? 'text-red-800' : 'text-amber-800'}`}>
                {daysUntilExpiry < 30 ? 'Urgent: Policy expires soon' : 'Reminder: Policy expires in less than 3 months'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${daysUntilExpiry < 30 ? 'text-red-700' : 'text-amber-700'}`}>
              Contact your insurance provider to renew your policy or explore new options.
            </p>
          </div>
        )}
      </div>

      {/* Business Profile (from signup) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Business Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-4">Business Operations</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Employee Count</span>
                <span className="text-sm text-slate-900">{insuranceData.employeeCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Annual Turnover</span>
                <span className="text-sm text-slate-900">{insuranceData.annualTurnover}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Operating Region</span>
                <span className="text-sm text-slate-900">{insuranceData.operatesIn}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 mb-4">Experience & Qualifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Management Experience</span>
                <span className="text-sm text-slate-900">{insuranceData.managementExperience}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 block mb-2">Qualifications</span>
                <div className="space-y-1">
                  {insuranceData.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-600 text-xs">✓</span>
                      <span className="text-sm text-slate-900">{qual}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Requirements */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Insurance Requirements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Required Coverage</h3>
            
            {!insuranceData.employeeCount.includes('Just me') && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600">⚠️</span>
                  <h4 className="font-medium text-red-800">Employers' Liability Insurance</h4>
                </div>
                <p className="text-sm text-red-700">
                  Legally required as you have employees. Minimum £5 million coverage.
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">ℹ️</span>
                <h4 className="font-medium text-blue-800">Public Liability Insurance</h4>
              </div>
              <p className="text-sm text-blue-700">
                Highly recommended for retail businesses. Protects against customer injury claims.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">✓</span>
                <h4 className="font-medium text-green-800">Business Insurance</h4>
              </div>
              <p className="text-sm text-green-700">
                Your current policy should cover property, stock, and business interruption.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Risk Factors</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Experience Level</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {insuranceData.managementExperience.includes('10+') ? 'Low Risk' :
                   insuranceData.managementExperience.includes('first') ? 'Higher Risk' : 'Moderate Risk'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Qualifications</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  {insuranceData.qualifications.length > 1 ? 'Low Risk' : 'Moderate Risk'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">Business Size</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {insuranceData.annualTurnover.includes('Over £1,000,000') ? 'Higher Risk' :
                   insuranceData.annualTurnover.includes('Under £50,000') ? 'Lower Risk' : 'Moderate Risk'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">📋</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Policy Review</h4>
            <p className="text-sm text-slate-500">Check coverage adequacy</p>
          </button>
          
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">💷</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Get Quotes</h4>
            <p className="text-sm text-slate-500">Compare insurance rates</p>
          </button>
          
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">📞</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Contact Provider</h4>
            <p className="text-sm text-slate-500">Speak with {insuranceData.insuranceProvider}</p>
          </button>
          
          <button className="p-4 text-left border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-lg">📊</span>
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Risk Report</h4>
            <p className="text-sm text-slate-500">Generate for insurer</p>
          </button>
        </div>
      </div>

      {/* Update Form Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Update Insurance Details</h3>
              <button
                onClick={() => setShowUpdateForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={insuranceData.insuranceProvider}
                  onChange={(e) => setInsuranceData({...insuranceData, insuranceProvider: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Annual Premium (£)
                  </label>
                  <input
                    type="number"
                    value={insuranceData.currentPremium}
                    onChange={(e) => setInsuranceData({...insuranceData, currentPremium: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Policy Expiry
                  </label>
                  <input
                    type="date"
                    value={insuranceData.policyExpiry}
                    onChange={(e) => setInsuranceData({...insuranceData, policyExpiry: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowUpdateForm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUpdateForm(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}