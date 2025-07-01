'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'

interface Step1Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function Step1Account({ data, onUpdate, onNext }: Step1Props) {
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: any = {}
    
    if (!data.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!data.password) {
      newErrors.password = 'Password is required'
    } else if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!data.companyName) {
      newErrors.companyName = 'Business name is required'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Hoops Store Operations</h1>
        </div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Welcome to your compliance journey</h2>
        <p className="text-slate-800">Let's start by setting up your account</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email address *
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            placeholder="your@business-email.co.uk"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            Password *
          </label>
          <input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => onUpdate({ password: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            placeholder="Create a strong password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-sm text-slate-700">
            At least 8 characters with a mix of letters and numbers
          </p>
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
            Business name *
          </label>
          <input
            id="companyName"
            type="text"
            value={data.companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.companyName ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            placeholder="e.g., Sam's Corner Café"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Continue to Business Details →
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-slate-700">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
      </div>
    </form>
  )
} 