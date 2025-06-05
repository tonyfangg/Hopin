'use client'

import Button from '@/components/ui/button'
import { cookies } from 'next/headers'

export default async function Hero() {
  const cookieStore = await cookies()

  return (
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
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <span className="mr-2">🔔</span>
            Notify When Available
          </Button>
        </div>
      </div>
    </section>
  )
}
