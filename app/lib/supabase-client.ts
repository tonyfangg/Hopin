'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from './supabase'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  // Create a singleton on the client side
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  return client
}

// Optional: Method to get existing client without creating new one
export const getClient = () => {
  if (!client) {
    throw new Error('Supabase client not initialized. Call createClient() first.')
  }
  return client
}

// Optional: Method to reset client (useful for testing or auth changes)
export const resetClient = () => {
  client = undefined
} 