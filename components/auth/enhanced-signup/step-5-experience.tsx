'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'

interface Step5Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function Step5Experience({ data, onUpdate, onNext, onPrev }: Step5Props) {
  const [errors, setErrors] = useState<any>({})

  const experienceLevels = [
    'This is my first business (0 years)',
    '1-2 years experience',
    '3-5 years experience',
    '6-10 years experience',
    '10+ years experience'
  ]

  const qualificationOptions = [
    'Food Safety/Hygiene certification',
    'Health & Safety qualification',
    'Business management qualification',
    'Industry-specific training',
    'None of the above'
  ]

  const insuranceOptions = [
    'Yes - I have business insurance',
    'No, but planning to get insurance',
    'No, not currently needed',
    'Not sure what I need'
  ]

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    const currentQualifications = data.qualifications || []
    
    if (qualification === 'None of the above') {
      if (checked) {
        onUpdate({ qualifications: ['None of the above'] })
      } else {
        onUpdate({ qualifications: [] })
      }
    } else {
      let newQualifications
      if (checked) {
        newQualifications = [...currentQualifications.filter((q: string) => q !== 'None of the above'), qualification]
      } else {
        newQualifications = currentQualifications.filter((q: string) => q !== qualification)
      }
      onUpdate({ qualifications: newQualifications })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: any = {}
    
    if (!data.managementExperience) {
      newErrors.managementExperience = 'Please select your experience level'
    }
    
    if (!data.qualifications || data.qualifications.length === 0) {
      newErrors.qualifications = 'Please select your qualifications or "None of the above"'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Management experience & insurance</h2>
        <p className="text-slate-800">This helps us understand the size of your business and what insurance you might be legally required to have</p>
      </div>

      <div className="space-y-6">
        {/* Management experience */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            How many years of retail/shop management experience do you have? *
          </label>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label
                key={level}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.managementExperience === level
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="managementExperience"
                  value={level}
                  checked={data.managementExperience === level}
                  onChange={(e) => onUpdate({ managementExperience: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.managementExperience === level
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.managementExperience === level && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{level}</span>
              </label>
            ))}
          </div>
          {errors.managementExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.managementExperience}</p>
          )}
          
          {/* Experience impact info */}
          {data.managementExperience && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 text-blue-600 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 text-sm">Experience matters for insurance</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {data.managementExperience.includes('first business') && 
                      "As a first-time business owner, we'll provide extra guidance and training resources to help you succeed."
                    }
                    {data.managementExperience.includes('10+') && 
                      "Your extensive experience may qualify you for reduced insurance premiums and advanced management features."
                    }
                    {(data.managementExperience.includes('6-10') || data.managementExperience.includes('3-5')) && 
                      "Your solid experience shows you understand business operations, which insurers view favorably."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Qualifications */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Do you have any relevant qualifications? *
          </label>
          <div className="space-y-2">
            {qualificationOptions.map((qualification) => (
              <label
                key={qualification}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.qualifications?.includes(qualification)
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.qualifications?.includes(qualification) || false}
                  onChange={(e) => handleQualificationChange(qualification, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                  data.qualifications?.includes(qualification)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.qualifications?.includes(qualification) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{qualification}</span>
              </label>
            ))}
          </div>
          {errors.qualifications && (
            <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>
          )}
        </div>

        {/* Insurance status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Do you currently have business insurance?
          </label>
          <div className="space-y-2">
            {insuranceOptions.map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  (option.startsWith('Yes') && data.hasInsurance) || 
                  (option.startsWith('No') && data.hasInsurance === false) ||
                  (option.startsWith('Not sure') && data.hasInsurance === undefined)
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="hasInsurance"
                  checked={
                    (option.startsWith('Yes') && data.hasInsurance) || 
                    (option.startsWith('No') && data.hasInsurance === false) ||
                    (option.startsWith('Not sure') && data.hasInsurance === undefined)
                  }
                  onChange={() => {
                    if (option.startsWith('Yes')) {
                      onUpdate({ hasInsurance: true })
                    } else if (option.startsWith('No')) {
                      onUpdate({ hasInsurance: false })
                    } else {
                      onUpdate({ hasInsurance: undefined })
                    }
                  }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  (option.startsWith('Yes') && data.hasInsurance) || 
                  (option.startsWith('No') && data.hasInsurance === false) ||
                  (option.startsWith('Not sure') && data.hasInsurance === undefined)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {((option.startsWith('Yes') && data.hasInsurance) || 
                    (option.startsWith('No') && data.hasInsurance === false) ||
                    (option.startsWith('Not sure') && data.hasInsurance === undefined)) && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Insurance details if they have insurance */}
        {data.hasInsurance && (
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-900">Tell us about your current insurance</h4>
            
            <div>
              <label htmlFor="insuranceProvider" className="block text-sm font-medium text-slate-700 mb-2">
                Insurance provider
              </label>
              <input
                id="insuranceProvider"
                type="text"
                value={data.insuranceProvider || ''}
                onChange={(e) => onUpdate({ insuranceProvider: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., Hiscox, AXA, Simply Business"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentPremium" className="block text-sm font-medium text-slate-700 mb-2">
                  Annual premium (£)
                </label>
                <input
                  id="currentPremium"
                  type="number"
                  value={data.currentPremium || ''}
                  onChange={(e) => onUpdate({ currentPremium: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., 850"
                />
              </div>

              <div>
                <label htmlFor="policyExpiry" className="block text-sm font-medium text-slate-700 mb-2">
                  Policy expires
                </label>
                <input
                  id="policyExpiry"
                  type="date"
                  value={data.policyExpiry || ''}
                  onChange={(e) => onUpdate({ policyExpiry: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* No insurance guidance */}
        {data.hasInsurance === false && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-amber-600 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-amber-800">Insurance recommendations</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Based on your business type, we'll help you understand what insurance coverage 
                  might be recommended or legally required for your business.
                </p>
              </div>
            </div>
          </div>
        )}
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
          Continue to Final Step →
        </Button>
      </div>
    </form>
  )
} 