import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './supabase'

export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies })

export const createApiClient = () => 
  createRouteHandlerClient<Database>({ cookies })
