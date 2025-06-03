import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          company_name: string | null
          subscription_plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          company_name?: string | null
          subscription_plan?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          company_name?: string | null
          subscription_plan?: string
          created_at?: string
          updated_at?: string
        }
      }
      email_signups: {
        Row: {
          id: string
          email: string
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string
          created_at?: string
        }
      }
    }
  }
}

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>()
