'use client'

import { createClient } from '@/app/lib/supabase-client'
import Button from '@/components/ui/button'

export function TestRedirectButton() {
  const supabase = createClient()

  const testRedirect = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Current session:', !!session)
    
    if (session) {
      console.log('Session exists, redirecting to dashboard')
      window.location.href = '/dashboard'
    } else {
      console.log('No session found')
      alert('No active session found')
    }
  }

  return (
    <div className="mt-4 text-center">
      <Button onClick={testRedirect} variant="outline" className="text-sm">
        Test Dashboard Redirect
      </Button>
    </div>
  )
} 