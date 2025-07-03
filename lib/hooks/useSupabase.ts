'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/app/lib/supabase'

export function useSupabase() {
  const [client] = useState<SupabaseClient<Database>>(() => createClient())
  
  // Ensure client is properly initialized
  useEffect(() => {
    if (!client) {
      console.error('Supabase client not initialized')
    }
  }, [client])

  return client
}

// Alternative hook for auth-specific operations
export function useSupabaseAuth() {
  const client = useSupabase()
  return client.auth
} 