import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  
  // Simple query without permission filtering
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, name, property_type, organisation_id')
    .eq('is_active', true)
  
  return NextResponse.json({ 
    properties: properties || [],
    error: error?.message || null,
    count: properties?.length || 0
  })
} 