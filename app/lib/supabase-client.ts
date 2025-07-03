import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './supabase'

// Singleton instance
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export const createClient = () => {
  // Return existing instance if it exists
  if (supabaseClient) {
    return supabaseClient
  }

  // Create new instance only if none exists
  supabaseClient = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Add proper configuration to avoid conflicts
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'supabase.auth.token', // Use consistent storage key
      },
    }
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