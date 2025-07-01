'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'

interface Step3Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function Step3Property({ data, onUpdate, onNext, onPrev }: Step3Props) {
  const [errors, setErrors] = useState<any>({})
  const [addressLookup, setAddressLookup] = useState('')

  const sizeCategories = [
    'Small (under 500 sq ft)',
    'Medium (500-1,500 sq ft)',  
    'Large (1,500-3,000 sq ft)',
    'Very large (3,000+ sq ft)',
    'Not sure'
  ]

  const buildingAges = [
    'Modern (built after 2000)',
    'Recent (1980-2000)',
    'Older (1950-1980)',
    'Historic (before 1950)',
    'Not sure'
  ]

  const tenureTypes = [
    'Own the property',
    'Rent/lease the property',
    'Franchise location',
    'Other arrangement'
  ]

  const handlePostcodeLookup = () => {
    // In real implementation, this would call UK postcode API
    if (addressLookup) {
      onUpdate({ 
        postcode: addressLookup,
        propertyAddress: `${data.companyName}, ${addressLookup}` 
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: any = {}
    
    if (!data.propertyAddress) {
      newErrors.propertyAddress = 'Property address is required'
    }
    
    if (!data.postcode) {
      newErrors.postcode = 'Postcode is required'
    }
    
    if (!data.sizeCategory) {
      newErrors.sizeCategory = 'Please select the approximate size'
    }
    
    if (!data.tenureType) {
      newErrors.tenureType = 'Please select your property arrangement'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Property details</h2>
        <p className="text-slate-700">Help us understand your business location for accurate risk assessment</p>
      </div>

      <div className="space-y-6">
        {/* Postcode lookup */}
        <div>
          <label htmlFor="postcodeLookup" className="block text-sm font-medium text-slate-800 mb-2">
            Search for your business address using postcode
          </label>
          <div className="flex gap-2">
            <input
              id="postcodeLookup"
              type="text"
              value={addressLookup}
              onChange={(e) => setAddressLookup(e.target.value.toUpperCase())}
              placeholder="e.g., SW1A 1AA"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <Button 
              type="button"
              onClick={handlePostcodeLookup}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white"
            >
              Find address
            </Button>
          </div>
          <p className="mt-1 text-sm text-slate-700">
            This is where your business contents are kept and where your portable equipment is stored when it's not on the go.
          </p>
        </div>

        {/* Full address */}
        <div>
          <label htmlFor="propertyAddress" className="block text-sm font-medium text-slate-800 mb-2">
            Full business address *
          </label>
          <textarea
            id="propertyAddress"
            value={data.propertyAddress}
            onChange={(e) => onUpdate({ propertyAddress: e.target.value })}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.propertyAddress ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            placeholder="Enter your complete business address"
          />
          {errors.propertyAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.propertyAddress}</p>
          )}
        </div>

        {/* Postcode */}
        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-slate-800 mb-2">
            Postcode *
          </label>
          <input
            id="postcode"
            type="text"
            value={data.postcode}
            onChange={(e) => onUpdate({ postcode: e.target.value.toUpperCase() })}
            className={`w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.postcode ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            placeholder="SW1A 1AA"
          />
          {errors.postcode && (
            <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
          )}
        </div>

        {/* Size category */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-3">
            Approximate floor area *
          </label>
          <div className="space-y-2">
            {sizeCategories.map((size) => (
              <label
                key={size}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.sizeCategory === size
                    ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="sizeCategory"
                  value={size}
                  checked={data.sizeCategory === size}
                  onChange={(e) => onUpdate({ sizeCategory: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.sizeCategory === size
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-slate-400'
                }`}>
                  {data.sizeCategory === size && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className={`text-sm ${
                  data.sizeCategory === size 
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-800 font-medium'
                }`}>
                  {size}
                </span>
              </label>
            ))}
          </div>
          {errors.sizeCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.sizeCategory}</p>
          )}
        </div>

        {/* Building age */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Building age (if known)
          </label>
          <div className="space-y-2">
            {buildingAges.map((age) => (
              <label
                key={age}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.buildingAgeRange === age
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="buildingAgeRange"
                  value={age}
                  checked={data.buildingAgeRange === age}
                  onChange={(e) => onUpdate({ buildingAgeRange: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.buildingAgeRange === age
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.buildingAgeRange === age && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{age}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tenure type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Do you own or rent your premises? *
          </label>
          <div className="space-y-2">
            {tenureTypes.map((tenure) => (
              <label
                key={tenure}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 ${
                  data.tenureType === tenure
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="tenureType"
                  value={tenure}
                  checked={data.tenureType === tenure}
                  onChange={(e) => onUpdate({ tenureType: e.target.value })}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  data.tenureType === tenure
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {data.tenureType === tenure && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{tenure}</span>
              </label>
            ))}
          </div>
          {errors.tenureType && (
            <p className="mt-1 text-sm text-red-600">{errors.tenureType}</p>
          )}
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
          Continue to Operations →
        </Button>
      </div>
    </form>
  )
} 