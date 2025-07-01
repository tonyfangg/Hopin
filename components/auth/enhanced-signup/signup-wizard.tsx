'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { Step1Account } from './step-1-account'
import { Step2Business } from './step-2-business'
import { Step3Property } from './step-3-property'
import { Step4Operations } from './step-4-operations'
import { Step5Experience } from './step-5-experience'
import { Step6TierSelection } from './step-6-tier-selection'

interface SignupData {
  // Step 1: Account
  email: string
  password: string
  companyName: string
  
  // Step 2: Business
  industry: string
  businessActivity: string
  
  // Step 3: Property
  propertyAddress: string
  postcode: string
  sizeCategory: string
  buildingAgeRange: string
  tenureType: string
  
  // Step 4: Operations
  employeeCount: string
  annualTurnover: string
  operatesIn: string
  
  // Step 5: Experience & Insurance
  managementExperience: string
  qualifications: string[]
  hasInsurance: boolean
  currentPremium?: number
  policyExpiry?: string
  insuranceProvider?: string
  
  // Step 6: Compliance & Priorities
  complianceStatus: string[]
  mainPriority: string
  selectedTier: 'free' | 'premium' | 'enterprise'
}

export function SignupWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    companyName: '',
    industry: 'Retail and Shops',
    businessActivity: '',
    propertyAddress: '',
    postcode: '',
    sizeCategory: '',
    buildingAgeRange: '',
    tenureType: '',
    employeeCount: '',
    annualTurnover: '',
    operatesIn: 'UK',
    managementExperience: '',
    qualifications: [],
    hasInsurance: false,
    complianceStatus: [],
    mainPriority: '',
    selectedTier: 'free'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const updateSignupData = (stepData: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const calculateRiskScore = () => {
    let riskScore = 50 // baseline
    
    // Business type risk factors
    if (signupData.businessActivity === 'Café') {
      riskScore += 10
    } else if (signupData.businessActivity === 'Convenience Store') {
      riskScore += 5
    }
    
    // Building age risk
    if (signupData.buildingAgeRange === 'Historic (before 1950)') {
      riskScore += 15
    } else if (signupData.buildingAgeRange === 'Modern (built after 2000)') {
      riskScore -= 5
    }
    
    // Management experience (key risk factor)
    const experienceRisk = {
      "This is my first business (0 years)": 15,
      "1-2 years experience": 10,
      "3-5 years experience": 5,
      "6-10 years experience": 0,
      "10+ years experience": -5
    }
    riskScore += experienceRisk[signupData.managementExperience] || 0
    
    // Qualifications reduce risk
    riskScore -= (signupData.qualifications.length * 2)
    
    // Compliance adjustment
    riskScore -= (signupData.complianceStatus.length * 3)
    
    // Size factor
    if (signupData.sizeCategory === 'Large (1,500-3,000 sq ft)' || 
        signupData.sizeCategory === 'Very large (3,000+ sq ft)') {
      riskScore += 8
    }
    
    return Math.max(10, Math.min(90, riskScore))
  }

  const recommendTier = () => {
    const employees = signupData.employeeCount
    const turnover = signupData.annualTurnover
    const experience = signupData.managementExperience
    
    const isExperienced = experience.includes("6-10") || experience.includes("10+")
    const hasMultipleEmployees = !employees.includes("Just me")
    const significantTurnover = turnover.includes("£150,000") || turnover.includes("£500,000")
    
    if (employees === "Just me (1)" && !significantTurnover) {
      return "free"
    } else if (hasMultipleEmployees || significantTurnover || isExperienced) {
      return "premium"
    } else {
      return "premium"
    }
  }

  const completeSignup = async () => {
    setLoading(true)
    setError('')

    try {
      // Calculate final risk score and tier
      const finalRiskScore = calculateRiskScore()
      const recommendedTier = recommendTier()
      
      // Step 1: Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            company_name: signupData.companyName,
            business_activity: signupData.businessActivity,
            employee_count_range: signupData.employeeCount,
            turnover_range: signupData.annualTurnover,
            management_experience: signupData.managementExperience,
            qualifications: signupData.qualifications,
            main_priority: signupData.mainPriority,
            subscription_tier: signupData.selectedTier,
            onboarding_completed: true,
            initial_risk_score: finalRiskScore
          }
        }
      })

      if (authError) throw authError

      // Step 2: Create property record
      if (authData.user) {
        const { error: propertyError } = await supabase
          .from('properties')
          .insert({
            user_id: authData.user.id,
            name: `${signupData.companyName} - Main Location`,
            address: signupData.propertyAddress,
            postcode: signupData.postcode,
            size_category: signupData.sizeCategory,
            building_age_range: signupData.buildingAgeRange,
            tenure_type: signupData.tenureType,
            risk_score: finalRiskScore
          })

        if (propertyError) throw propertyError

        // Step 3: Save insurance information
        if (signupData.hasInsurance) {
          const { error: insuranceError } = await supabase
            .from('user_insurance_status')
            .insert({
              user_id: authData.user.id,
              has_current_insurance: signupData.hasInsurance,
              current_premium: signupData.currentPremium,
              policy_expiry: signupData.policyExpiry,
              insurance_provider: signupData.insuranceProvider
            })

          if (insuranceError) throw insuranceError
        }

        // Step 4: Save compliance baseline
        const { error: complianceError } = await supabase
          .from('compliance_baseline')
          .insert({
            user_id: authData.user.id,
            compliance_items: signupData.complianceStatus,
            assessment_score: Math.max(0, 100 - finalRiskScore)
          })

        if (complianceError) throw complianceError
      }

      // Redirect to dashboard with welcome flow
      router.push('/dashboard?welcome=true&tier=' + signupData.selectedTier)
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Account 
            data={signupData} 
            onUpdate={updateSignupData} 
            onNext={nextStep} 
          />
        )
      case 2:
        return (
          <Step2Business 
            data={signupData} 
            onUpdate={updateSignupData} 
            onNext={nextStep} 
            onPrev={prevStep} 
          />
        )
      case 3:
        return (
          <Step3Property 
            data={signupData} 
            onUpdate={updateSignupData} 
            onNext={nextStep} 
            onPrev={prevStep} 
          />
        )
      case 4:
        return (
          <Step4Operations 
            data={signupData} 
            onUpdate={updateSignupData} 
            onNext={nextStep} 
            onPrev={prevStep} 
          />
        )
      case 5:
        return (
          <Step5Experience 
            data={signupData} 
            onUpdate={updateSignupData} 
            onNext={nextStep} 
            onPrev={prevStep} 
          />
        )
      case 6:
        return (
          <Step6TierSelection 
            data={signupData} 
            onUpdate={updateSignupData} 
            onComplete={completeSignup} 
            onPrev={prevStep} 
            loading={loading}
            riskScore={calculateRiskScore()}
            recommendedTier={recommendTier()}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white shadow-lg'
                      : currentStep === step - 1
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 6 && (
                  <div className={`w-16 h-1 mx-2 transition-all ${
                    currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">
              {currentStep === 1 && "Create Your Account"}
              {currentStep === 2 && "Tell Us About Your Business"}
              {currentStep === 3 && "Property Details"}
              {currentStep === 4 && "Business Operations"}
              {currentStep === 5 && "Experience & Insurance"}
              {currentStep === 6 && "Choose Your Plan"}
            </div>
            <div className="text-slate-600 mt-1">
              Step {currentStep} of 6
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Current step content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          {renderStep()}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  )
} 