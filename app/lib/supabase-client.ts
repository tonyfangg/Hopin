import { createBrowserClient } from '@supabase/ssr'
import { Database } from './supabase'

// Singleton instance
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export const createClient = () => {
  // Return existing instance if it exists
  if (supabaseClient) {
    return supabaseClient
  }

  // Create new instance only if none exists
  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabaseClient
}

// Optional: Method to get existing client without creating new one
export const getClient = () => {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Call createClient() first.')
  }
  return supabaseClient
}

// Optional: Method to reset client (useful for testing or auth changes)
export const resetClient = () => {
  supabaseClient = null
} 