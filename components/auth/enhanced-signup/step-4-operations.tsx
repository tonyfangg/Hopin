'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'

interface Step4Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function Step4Operations({ data, onUpdate, onNext, onPrev }: Step4Props) {
  const [errors, setErrors] = useState<any>({})

  const employeeCounts = [
    'Just me (1)',
    '2-3 people',
    '4-10 people',
    '11-25 people',
    '26+ people'
  ]

  const turnoverRanges = [
    'Just starting out (estimate first year)',
    'Under £50,000',
    '£50,000 - £150,000',
    '£150,000 - £500,000',
    '£500,000 - £1,000,000',
    'Over £1,000,000'
  ]

  const operatingRegions = [
    'UK only',
    'UK + EU',
    'Worldwide'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: any = {}
    
    if (!data.employeeCount) {
      newErrors.employeeCount = 'Please select number of employees'
    }
    
    if (!data.annualTurnover) {
      newErrors.annualTurnover = 'Please select annual turnover range'
    }
    
    if (!data.operatesIn) {
      newErrors.operatesIn = 'Please select where your business operates'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Business operations</h2>
        <p className="text-slate-600">This helps us understand the size of your business and what insurance you might be legally required to have</p>
      </div>

      <div className="space-y-6">
        {/* Employee count */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Including yourself, how many people work in your business? *
          </label>
          <div className="space-y-2">
            {employeeCounts.map((count) => (
              <label
                key={count}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.employeeCount === count
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="employeeCount"
                  value={count}
                  checked={data.employeeCount === count}
                  onChange={(e) => onUpdate({ employeeCount: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.employeeCount === count
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.employeeCount === count && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{count}</span>
              </label>
            ))}
          </div>
          {errors.employeeCount && (
            <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>
          )}
          
          {/* Helpful info for employee liability */}
          {data.employeeCount && !data.employeeCount.includes('Just me') && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 text-amber-600 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 text-sm">Employers' Liability Insurance Required</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Since you have employees, UK law requires you to have Employers' Liability Insurance. 
                    We'll help you ensure you're properly covered.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Annual turnover */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            What is your annual turnover? *
          </label>
          <div className="space-y-2">
            {turnoverRanges.map((range) => (
              <label
                key={range}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.annualTurnover === range
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="annualTurnover"
                  value={range}
                  checked={data.annualTurnover === range}
                  onChange={(e) => onUpdate({ annualTurnover: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.annualTurnover === range
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.annualTurnover === range && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{range}</span>
              </label>
            ))}
          </div>
          {errors.annualTurnover && (
            <p className="mt-1 text-sm text-red-600">{errors.annualTurnover}</p>
          )}
          <p className="mt-2 text-sm text-slate-500">
            If you're just starting out, please estimate your first year turnover. 
            Turnover helps us understand the size of your business and the potential risks you might face.
          </p>
        </div>

        {/* Operating region */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Where does your business operate? *
          </label>
          <div className="space-y-2">
            {operatingRegions.map((region) => (
              <label
                key={region}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.operatesIn === region
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="operatesIn"
                  value={region}
                  checked={data.operatesIn === region}
                  onChange={(e) => onUpdate({ operatesIn: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.operatesIn === region
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.operatesIn === region && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{region}</span>
              </label>
            ))}
          </div>
          {errors.operatesIn && (
            <p className="mt-1 text-sm text-red-600">{errors.operatesIn}</p>
          )}
          <p className="mt-2 text-sm text-slate-500">
            It's important that we know where you work and which legal systems you may need to 
            defend a claim under so that we can adjust your policy to cover you properly.
          </p>
        </div>
      </div>

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
          Continue to Experience →
        </Button>
      </div>
    </form>
  )
} 