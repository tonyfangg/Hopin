'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/button'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [urlError, setUrlError] = useState('')
  const [redirecting, setRedirecting] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Handle URL error params safely
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      const errorMessages: { [key: string]: string } = {
        'invalid_reset_link': 'Invalid or expired reset link. Please try again.',
        'expired_code': 'Reset link has expired. Please request a new one.',
        'invalid_code': 'Invalid reset link. Please request a new one.',
        'exchange_failed': 'Authentication failed. Please try again.',
        'no_session': 'Session could not be created. Please try again.',
        'callback_exception': 'An error occurred during authentication. Please try again.',
        'oauth_error': 'Authentication error. Please try again.',
        'no_code': 'Invalid authentication link. Please try again.',
      }
      
      setUrlError(errorMessages[errorParam] || 'An authentication error occurred. Please try again.')
    }
  }, [searchParams])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, !!session)
      
      if (event === 'SIGNED_IN' && session && redirecting) {
        console.log('✅ Auth state confirmed, executing redirect')
        setRedirecting(false)
        
        // Execute redirect after auth state is confirmed
        setTimeout(() => {
          console.log('🚀 Executing confirmed redirect')
          window.location.href = '/dashboard'
        }, 100)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, redirecting])

  const displayError = error || urlError

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRedirecting(false)

    try {
      console.log('🔐 Attempting login with email:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Login response:', { data: !!data, error: error?.message })

      if (error) {
        console.error('❌ Login error:', error.message)
        setError(error.message)
        setLoading(false)
        return
      }

      console.log('✅ Login successful, waiting for auth state change')
      setRedirecting(true)
      
      // Set a timeout in case auth state change doesn't fire
      setTimeout(() => {
        if (redirecting) {
          console.log('⏰ Timeout reached, forcing redirect')
          setRedirecting(false)
          window.location.href = '/dashboard'
        }
      }, 3000)
      
    } catch (err) {
      console.error('💥 Login exception:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">★</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Hoops Store</h1>
          </div>
          <h2 className="text-xl font-semibold text-slate-700">Welcome back</h2>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="on">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={loading || redirecting}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={loading || redirecting}
            />
          </div>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {displayError}
            </div>
          )}

          {(loading || redirecting) && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                {loading ? 'Signing in...' : 'Redirecting to dashboard...'}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading || redirecting}
          >
            {loading ? 'Signing in...' : redirecting ? 'Redirecting...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
