'use client'

import { useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter } from 'next/navigation'

export function RedirectHandler() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        console.log('Session found, redirecting to dashboard')
        // Force redirect using multiple methods
        router.push('/dashboard')
        
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 500)
      }
    }

    // Check immediately
    checkAuthAndRedirect()

    // Also listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('Auth state change detected, redirecting')
        window.location.href = '/dashboard'
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <div className="text-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-slate-600">Redirecting to dashboard...</p>
    </div>
  )
} 