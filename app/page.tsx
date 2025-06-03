'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'
import { Features } from '@/components/marketing/features'
import { DashboardPreview } from '@/components/marketing/dashboard-preview'
import { RiskFactors } from '@/components/marketing/risk-factors'
import { Pricing } from '@/components/marketing/pricing'
import CTA from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'
import { NotifyModal } from '@/components/marketing/notify-modal'
import Link from 'next/link'

export default function Home() {
  const [showNotifyModal, setShowNotifyModal] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <nav className="container mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-transparent">
              <img src="/images/hoops-logo.png" alt="Hoops Logo" className="object-contain w-8 h-8" />
            </div>
            Hoops Store Operations
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50">
              Features
            </a>
            <a href="#dashboard" className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50">
              Dashboard
            </a>
            <a href="#risk-factors" className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50">
              Risk Areas
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50">
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Smart Risk Management<br />
            <span className="text-blue-600">for Modern Retailers</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Transform your store&apos;s safety data into measurable insurance savings 
            with intelligent risk monitoring and analytics
          </p>
          
          {/* Savings Highlight */}
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto mb-10 shadow-lg border border-slate-200">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
              25-35%
            </div>
            <div className="text-slate-600 font-medium">Average insurance premium reduction</div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowNotifyModal(true)}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <span className="mr-2">🔔</span>
              Notify When Available
            </Button>
          </div>
        </div>
      </section>

      {/* All Other Sections */}
      <Features />
      <DashboardPreview />
      <RiskFactors />
      <Pricing />
      <CTA />
      <Footer />

      {/* Notify Modal */}
      <NotifyModal 
        isOpen={showNotifyModal} 
        onClose={() => setShowNotifyModal(false)} 
      />
    </main>
  )
}
