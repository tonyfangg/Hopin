'use client'

import Button from '@/components/ui/button'
import { cookies } from 'next/headers'

export default async function Hero() {
  const cookieStore = await cookies()

  return (
    <section className="pt-32 pb-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          Smart Risk Management<br />
          <span className="text-gray-900">for Modern Retailers</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Transform your store&apos;s safety data into measurable insurance savings 
          with intelligent risk monitoring and analytics
        </p>
        
        {/* Savings Highlight */}
        <div className="bg-white rounded-xl p-6 max-w-md mx-auto mb-10 shadow-sm">
          <div className="text-4xl font-bold text-green-600 mb-2">
            25-35%
          </div>
          <div className="text-gray-600 font-medium">Average insurance premium reduction</div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <span className="mr-2">🔔</span>
            Notify When Available
          </Button>
        </div>
      </div>
    </section>
  )
}
