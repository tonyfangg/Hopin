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

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, !!session)
      
      if (event === 'SIGNED_IN' && session && redirecting) {
        console.log('✅ Auth state confirmed, redirecting to dashboard')
        window.location.href = '/dashboard'
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, redirecting])

  // Debug: Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Initial session check:', !!session)
    }
    checkSession()
  }, [supabase])

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
    setRedirecting(false)

    try {
      console.log('🔐 Attempting login with email:', email)
      
      // First, test if Supabase client is working
      const testConnection = await supabase.from('profiles').select('count').limit(1)
      if (testConnection.error && testConnection.error.message.includes('Failed to fetch')) {
        console.error('🌐 Network/CORS issue detected:', testConnection.error)
        setError('Connection failed. Please check your internet connection and try again. If the problem persists, contact support.')
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Login response:', { data: !!data, error: error?.message })

      if (error) {
        console.error('❌ Login error:', error.message)
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else if (error.message.includes('Failed to fetch')) {
          setError('Network connection failed. Please check your internet connection and try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.')
        } else {
          setError(error.message)
        }
        setLoading(false)
        return
      }

      console.log('✅ Login successful, ensuring session persistence')
      setRedirecting(true)
      
      // Ensure the session is properly stored before redirecting
      // Force a session refresh to ensure it's persisted
      await supabase.auth.getSession()
      
      // Wait a bit longer for the session to be properly set
      setTimeout(() => {
        console.log('🚀 Redirecting to dashboard with established session...')
        window.location.href = '/dashboard'
      }, 2000)
      
    } catch (err: any) {
      console.error('💥 Login exception:', err)
      
      // Handle different types of network errors
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Network connection failed. Please check your internet connection and try again.')
      } else if (err.message?.includes('CORS')) {
        setError('Connection blocked. Please try refreshing the page or contact support.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
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

        {/* Debug section */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">Debug Info:</p>
          <div className="text-xs text-slate-500 space-y-1">
            <div>Loading: {loading ? 'Yes' : 'No'}</div>
            <div>Redirecting: {redirecting ? 'Yes' : 'No'}</div>
            <div>Error: {error || 'None'}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              console.log('Manual redirect test')
              window.location.href = '/dashboard'
            }}
            className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            Test Manual Redirect
          </button>
          <a
            href="/test-login"
            className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 block text-center"
          >
            Test Login Page
          </a>
        </div>
      </div>
    </div>
  )
}
