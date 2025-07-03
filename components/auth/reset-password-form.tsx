'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/button'
import Link from 'next/link'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(true)
  const [sessionValid, setSessionValid] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log('Reset password form - handling auth')
        
        // Check if we have token_hash from URL (older auth flow)
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        
        console.log('URL params:', { tokenHash: !!tokenHash, type })

        if (tokenHash && type === 'recovery') {
          console.log('Processing token_hash recovery flow')
          
          // For token_hash flow, we need to verify the hash and get session
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery'
          })

          if (error) {
            console.error('Token verification error:', error)
            setError('Invalid or expired reset link')
            setTimeout(() => router.push('/auth/login?error=invalid_token'), 2000)
            return
          }

          if (data.session) {
            console.log('Session created from token_hash')
            setSessionValid(true)
            setIsProcessing(false)
            
            // Clean up URL
            window.history.replaceState(null, '', '/auth/reset-password')
            return
          }
        }

        // Check for existing session (code flow or already authenticated)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Session check:', { 
          hasSession: !!session, 
          error: sessionError?.message,
          userEmail: session?.user?.email 
        })
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Session error occurred')
          setTimeout(() => router.push('/auth/login?error=session_error'), 2000)
          return
        }
        
        if (session) {
          console.log('Valid session found')
          setSessionValid(true)
          setIsProcessing(false)
          return
        }

        // No valid session or token
        console.log('No valid auth found - redirecting to login')
        setError('No valid password reset session found')
        setTimeout(() => router.push('/auth/login?error=no_reset_session'), 2000)
        
      } catch (err) {
        console.error('Auth handling error:', err)
        setError('An error occurred during authentication')
        setTimeout(() => router.push('/auth/login?error=auth_error'), 2000)
      }
    }

    handleAuth()
  }, [supabase.auth, searchParams, router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      console.log('Updating password...')
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password update error:', error)
        setError(error.message)
      } else {
        console.log('Password updated successfully!')
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      console.error('Password update exception:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Processing state
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Processing reset link...</p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-xs text-red-500 mt-1">Redirecting...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Password updated!</h2>
            <p className="text-slate-600 mb-6">
              Your password has been successfully updated. You'll be redirected to your dashboard shortly.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Reset form
  if (sessionValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">★</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Hoops Store</h1>
              </div>
              <h2 className="text-xl font-semibold text-slate-700">Set new password</h2>
              <p className="text-slate-600">Enter your new password below</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6" autoComplete="on">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter new password (min. 6 characters)"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Updating password...' : 'Update password'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Reset session error</h2>
          <p className="text-slate-600 mb-6">
            Unable to process password reset. Please request a new reset link.
          </p>
          <div className="space-y-3">
            <Link href="/auth/forgot-password">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Request new reset link
              </Button>
            </Link>
            <Link 
              href="/auth/login" 
              className="block text-center text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 