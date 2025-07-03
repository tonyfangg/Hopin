'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/app/lib/supabase'

const SupabaseContext = createContext<SupabaseClient<Database> | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    // Optional: Add global error handling
    const handleAuthError = (error: any) => {
      console.error('Supabase auth error:', error)
    }

    // Listen for auth errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear any cached data
        console.log('User signed out')
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider')
  }
  return context
} 