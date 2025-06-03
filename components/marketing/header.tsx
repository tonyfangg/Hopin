'use client'

import Link from 'next/link'
import Button from '@/components/ui/button'

export function Header() {

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <nav className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-transparent">
            <img src="/images/hoops-logo.png" alt="Hoops Logo" className="object-contain w-8 h-8" />
          </div>
          Hoops Store Operations
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="#features" 
            className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
          >
            Features
          </Link>
          <Link 
            href="#dashboard" 
            className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
          >
            Dashboard
          </Link>
          <Link 
            href="#risk-factors" 
            className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
          >
            Risk Areas
          </Link>
          <Link 
            href="#pricing" 
            className="text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
          >
            Pricing
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}