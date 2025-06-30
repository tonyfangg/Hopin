import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Your actual environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Export the configured client
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Default export for backward compatibility
export default createClient() 