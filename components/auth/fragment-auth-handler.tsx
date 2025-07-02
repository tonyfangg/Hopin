'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter } from 'next/navigation'

interface FragmentAuthHandlerProps {
  children: React.ReactNode
}

export function FragmentAuthHandler({ children }: FragmentAuthHandlerProps) {
  const [isHandling, setIsHandling] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthFragment = async () => {
      try {
        console.log('Fragment handler starting...')
        console.log('Current URL:', window.location.href)
        
        // First, check if we already have a valid session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionData?.session && !sessionError) {
          console.log('Already have valid session')
          setIsHandling(false)
          return
        }

        // Check for auth fragments in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        const expiresAt = hashParams.get('expires_at')

        console.log('Fragment params:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type,
          expiresAt
        })

        if (accessToken && refreshToken && type === 'recovery') {
          console.log('Setting session from fragments...')
          
          // Set the session manually using the tokens from URL
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (setSessionError) {
            console.error('Error setting session:', setSessionError)
            setError(`Session error: ${setSessionError.message}`)
            return
          }

          if (data?.session) {
            console.log('Session set successfully!')
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname)
            setIsHandling(false)
            return
          } else {
            console.error('No session returned after setting')
            setError('Failed to create session')
            return
          }
        } else if (type === 'recovery') {
          // We have recovery type but missing tokens
          console.error('Recovery type detected but missing tokens')
          setError('Invalid recovery link - missing authentication tokens')
          return
        } else {
          // No recovery fragments found
          console.log('No recovery fragments found')
          setError('No password recovery session found')
          return
        }

      } catch (err) {
        console.error('Fragment auth handler error:', err)
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    handleAuthFragment()
  }, [supabase.auth])

  // Handle errors - redirect to login with error message
  useEffect(() => {
    if (error) {
      console.log('Redirecting due to error:', error)
      setTimeout(() => {
        router.push('/auth/login?error=invalid_reset_link')
      }, 2000)
    }
  }, [error, router])

  if (isHandling) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Processing reset link...</p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-500 mt-1">Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
} 