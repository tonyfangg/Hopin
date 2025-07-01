'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'

interface Step6Props {
  data: any
  onUpdate: (data: any) => void
  onComplete: () => void
  onPrev: () => void
  loading: boolean
  riskScore: number
  recommendedTier: string
}

export function Step6TierSelection({ data, onUpdate, onComplete, onPrev, loading, riskScore, recommendedTier }: Step6Props) {
  const [errors, setErrors] = useState<any>({})

  const complianceOptions = [
    'HACCP procedures documented and followed',
    'Staff have current food hygiene certificates',
    'Temperature monitoring in place',
    'Regular cleaning schedules maintained',
    'Fire safety equipment serviced annually',
    'PAT testing up to date',
    'Some of the above',
    'None of the above - need help getting started'
  ]

  const priorityOptions = [
    'Getting compliant with food safety regulations',
    'Reducing insurance costs',
    'Better staff training and management',
    'Improving operational efficiency',
    'Preparing for business growth',
    'Just want to stay organised'
  ]

  const handleComplianceChange = (item: string, checked: boolean) => {
    const currentCompliance = data.complianceStatus || []
    
    if (item === 'None of the above - need help getting started' || item === 'Some of the above') {
      if (checked) {
        onUpdate({ complianceStatus: [item] })
      } else {
        onUpdate({ complianceStatus: [] })
      }
    } else {
      let newCompliance
      if (checked) {
        newCompliance = [...currentCompliance.filter((c: string) => 
          c !== 'None of the above - need help getting started' && c !== 'Some of the above'
        ), item]
      } else {
        newCompliance = currentCompliance.filter((c: string) => c !== item)
      }
      onUpdate({ complianceStatus: newCompliance })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: any = {}
    
    if (!data.complianceStatus || data.complianceStatus.length === 0) {
      newErrors.complianceStatus = 'Please select your current compliance status'
    }
    
    if (!data.mainPriority) {
      newErrors.mainPriority = 'Please select your main priority'
    }
    
    if (!data.selectedTier) {
      newErrors.selectedTier = 'Please select a plan'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onComplete()
    }
  }

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
    if (score <= 60) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' }
    if (score <= 80) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  }

  const risk = getRiskLevel(riskScore)

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Almost done! Let's assess your current status</h2>
        <p className="text-slate-700">This helps us provide personalized guidance and recommend the right plan for you</p>
      </div>

      {/* Risk Assessment Preview */}
      <div className={`p-4 rounded-lg border ${risk.bg} ${risk.border} mb-6`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Your Preliminary Risk Assessment</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${risk.color} bg-white`}>
            {risk.level} Risk
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">Risk Score</span>
              <span className={`font-medium ${risk.color}`}>{riskScore}/100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  risk.level === 'Low' ? 'bg-green-500' :
                  risk.level === 'Medium' ? 'bg-yellow-500' :
                  risk.level === 'High' ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>
        </div>
        <p className={`text-sm mt-2 ${risk.color}`}>
          {risk.level === 'Low' && "Great! Your business shows good risk management practices."}
          {risk.level === 'Medium' && "Your business has moderate risk. We'll help you improve your compliance."}
          {risk.level === 'High' && "There are some areas we can help you improve to reduce risk."}
          {risk.level === 'Critical' && "We'll prioritize getting your compliance framework in place."}
        </p>
      </div>

      <div className="space-y-6">
        {/* Compliance status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Current food safety & compliance status *
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {complianceOptions.map((item) => (
              <label
                key={item}
                className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.complianceStatus?.includes(item)
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.complianceStatus?.includes(item) || false}
                  onChange={(e) => handleComplianceChange(item, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center mt-0.5 ${
                  data.complianceStatus?.includes(item)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.complianceStatus?.includes(item) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{item}</span>
              </label>
            ))}
          </div>
          {errors.complianceStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.complianceStatus}</p>
          )}
        </div>

        {/* Main priority */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            What's your main priority right now? *
          </label>
          <div className="space-y-2">
            {priorityOptions.map((priority) => (
              <label
                key={priority}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.mainPriority === priority
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="mainPriority"
                  value={priority}
                  checked={data.mainPriority === priority}
                  onChange={(e) => onUpdate({ mainPriority: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.mainPriority === priority
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.mainPriority === priority && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{priority}</span>
              </label>
            ))}
          </div>
          {errors.mainPriority && (
            <p className="mt-1 text-sm text-red-600">{errors.mainPriority}</p>
          )}
        </div>

        {/* Plan selection */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose your plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Plan */}
            <div className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
              data.selectedTier === 'free'
                ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
            }`} onClick={() => onUpdate({ selectedTier: 'free' })}>
              <div className="text-center">
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Free</h4>
                <div className="text-3xl font-bold text-slate-900 mb-2">£0</div>
                <p className="text-sm text-slate-600 mb-4">per month</p>
                <ul className="text-sm text-slate-700 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    1 property
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    1 user
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Basic compliance tracking
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Monthly reports
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Email support
                  </li>
                </ul>
              </div>
              {recommendedTier === 'free' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Recommended
                  </span>
                </div>
              )}
            </div>

            {/* Premium Plan - Enhanced with gradient */}
            <div className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
              data.selectedTier === 'premium'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg ring-2 ring-blue-200'
                : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
            }`} onClick={() => onUpdate({ selectedTier: 'premium' })}>
              <div className="text-center">
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Premium</h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">£29</div>
                <p className="text-sm text-slate-600 mb-4">per month</p>
                <ul className="text-sm text-slate-700 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Up to 5 properties
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Up to 5 users
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Trade management
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Advanced compliance
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                    Analytics & workflows
                  </li>
                </ul>
              </div>
              {recommendedTier === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Recommended
                  </span>
                </div>
              )}
            </div>

            {/* Enterprise Plan */}
            <div className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
              data.selectedTier === 'enterprise'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg ring-2 ring-purple-200'
                : 'border-slate-300 hover:border-slate-400 hover:shadow-md'
            }`} onClick={() => onUpdate({ selectedTier: 'enterprise' })}>
              <div className="text-center">
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Enterprise</h4>
                <div className="text-3xl font-bold text-purple-600 mb-2">£99</div>
                <p className="text-sm text-slate-600 mb-4">per month</p>
                <ul className="text-sm text-slate-700 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Unlimited properties
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Unlimited users
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    AI insights
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    Custom workflows
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                    API access
                  </li>
                </ul>
              </div>
              {recommendedTier === 'enterprise' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Recommended
                  </span>
                </div>
              )}
            </div>
          </div>
          {errors.selectedTier && (
            <p className="mt-1 text-sm text-red-600">{errors.selectedTier}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button 
          type="button"
          onClick={onPrev}
          variant="outline"
          className="flex-1 py-4 px-6 border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
          disabled={loading}
        >
          ← Back
        </Button>
        <Button 
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 font-semibold rounded-lg shadow-lg transform transition-all hover:scale-105"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Creating Your Account...
            </>
          ) : (
            <>
              Complete Setup & Go to Dashboard
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </Button>
      </div>

      {data.selectedTier && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✓ Your account will be created instantly</li>
            <li>✓ You'll get access to your personalized dashboard</li>
            <li>✓ We'll guide you through your first compliance assessment</li>
            {data.selectedTier !== 'free' && <li>✓ You can start your 14-day free trial immediately</li>}
          </ul>
        </div>
      )}
    </form>
  )
} 