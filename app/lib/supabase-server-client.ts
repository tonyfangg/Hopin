import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase'

// =====================================================
// SERVER-SIDE SUPABASE CLIENT - BRITISH ENGLISH
// File: app/lib/supabase-server-client.ts
// =====================================================

/**
 * Creates a Supabase client for server-side operations
 * Uses service role key for full database access
 * 
 * @returns Supabase client instance
 */
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set')
  }

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Creates a Supabase client for server-side operations with error handling
 * 
 * @returns Supabase client instance or throws error if configuration is invalid
 */
export const getSupabaseClient = () => {
  try {
    return createServerSupabaseClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw new Error('Database connection failed')
  }
}

// Export a default instance for convenience
export const supabase = createServerSupabaseClient() 