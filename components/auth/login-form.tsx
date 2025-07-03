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

  const displayError = error || urlError

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting login with email:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response:', { data: !!data, error: error?.message })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      console.log('Login successful, redirecting to dashboard')
      
      // IMMEDIATE REDIRECT - Don't wait for auth state
      setTimeout(() => {
        console.log('Executing immediate redirect')
        window.location.href = '/dashboard'
      }, 100) // Very short delay to ensure session is set
      
    } catch (err) {
      console.error('Login error:', err)
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

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={loading}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {displayError}
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Signing in and redirecting...
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
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
