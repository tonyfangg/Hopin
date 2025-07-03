import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './supabase'

interface CookieOptions {
  name?: string
  value?: string
  path?: string
  domain?: string
  maxAge?: number
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// Cache server clients to avoid recreation
const serverClientCache = new Map<string, ReturnType<typeof createServerClient<Database>>>()

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()
  
  // Create a cache key based on session (simplified)
  const sessionCookie = cookieStore.get('supabase.auth.token')?.value || 'anonymous'
  const cacheKey = `server-${sessionCookie.substring(0, 20)}`
  
  // Return cached client if exists
  if (serverClientCache.has(cacheKey)) {
    return serverClientCache.get(cacheKey)!
  }

  // Create new server client
  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          console.log(`Getting cookie ${name}:`, cookie?.value ? 'exists' : 'not found')
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            console.log(`Setting cookie ${name}:`, value.substring(0, 20) + '...')
            cookieStore.set(name, value, options)
          } catch (error) {
            console.error('Cookie set error:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            console.log(`Removing cookie ${name}`)
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            console.error('Cookie remove error:', error)
          }
        },
      },
    }
  )

  // Cache the client
  serverClientCache.set(cacheKey, client)
  
  // Clean cache after 5 minutes to prevent memory leaks
  setTimeout(() => {
    serverClientCache.delete(cacheKey)
  }, 5 * 60 * 1000)

  return client
} 