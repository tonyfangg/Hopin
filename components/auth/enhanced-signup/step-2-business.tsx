'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'

interface Step2Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

const businessActivities = [
  'Café',
  'Convenience Store',
  'Restaurant/Takeaway',
  'Butcher',
  'Newsagent',
  'Clothing Store',
  'Electronics Shop',
  'Supermarket',
  'Bakery',
  'Pharmacy',
  'Camping and outdoor equipment shop',
  'Camera and photography shop',
  'Book shop',
  'Gift shop',
  'Hardware store',
  'Other (please specify)'
]

export function Step2Business({ data, onUpdate, onNext, onPrev }: Step2Props) {
  const [errors, setErrors] = useState<any>({})
  const [customActivity, setCustomActivity] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: any = {}
    
    if (!data.businessActivity) {
      newErrors.businessActivity = 'Please select your business activity'
    }
    
    if (data.businessActivity === 'Other (please specify)' && !customActivity) {
      newErrors.customActivity = 'Please specify your business activity'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      if (data.businessActivity === 'Other (please specify)') {
        onUpdate({ businessActivity: customActivity })
      }
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Tell us about your business</h2>
        <p className="text-slate-700">This helps us provide the right compliance guidance and risk assessment</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-3">
            Which industry do you work in? *
          </label>
          <div className="relative">
            <select
              value={data.industry}
              onChange={(e) => onUpdate({ industry: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="Retail and Shops">Retail and Shops</option>
              <option value="Food Service & Hospitality">Food Service & Hospitality</option>
              <option value="Business Services">Business Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-3">
            Choose your business activity *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-4">
            {businessActivities.map((activity) => (
              <label
                key={activity}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.businessActivity === activity
                    ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="businessActivity"
                  value={activity}
                  checked={data.businessActivity === activity}
                  onChange={(e) => onUpdate({ businessActivity: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.businessActivity === activity
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-400'
                }`}>
                  {data.businessActivity === activity && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className={`text-sm ${
                  data.businessActivity === activity 
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-800 font-medium'
                }`}>
                  {activity}
                </span>
              </label>
            ))}
          </div>
          {errors.businessActivity && (
            <p className="mt-1 text-sm text-red-600">{errors.businessActivity}</p>
          )}
        </div>

        {data.businessActivity === 'Other (please specify)' && (
          <div>
            <label htmlFor="customActivity" className="block text-sm font-medium text-slate-700 mb-2">
              Please specify your business activity *
            </label>
            <input
              id="customActivity"
              type="text"
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              className={`w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.customActivity ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="e.g., Pet grooming salon"
            />
            {errors.customActivity && (
              <p className="mt-1 text-sm text-red-600">{errors.customActivity}</p>
            )}
          </div>
        )}
      </div>

      {/* Helpful info box for food businesses */}
      {(data.businessActivity === 'Café' || 
        data.businessActivity === 'Restaurant/Takeaway' || 
        data.businessActivity === 'Butcher' ||
        data.businessActivity === 'Bakery') && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-green-600 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-1">Food business detected</h4>
              <p className="text-sm text-green-700">
                Great! We'll provide specialized food safety guidance including HACCP, temperature monitoring, 
                and staff training requirements specific to your business type.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <Button 
          type="button"
          onClick={onPrev}
          variant="outline"
          className="flex-1 py-3 px-6 border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          ← Back
        </Button>
        <Button 
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6"
        >
          Continue to Property Details →
        </Button>
      </div>
    </form>
  )
} 