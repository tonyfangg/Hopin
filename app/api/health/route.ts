// =====================================================
// HEALTH CHECK ENDPOINT
// File: app/api/health/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check database connectivity
    const supabase = await createServerSupabaseClient()
    const { data: dbCheck, error: dbError } = await supabase
      .from('organisations')
      .select('count')
      .limit(1)
    
    const dbStatus = dbError ? 'error' : 'healthy'
    const responseTime = Date.now() - startTime

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.NODE_ENV,
      services: {
        database: dbStatus,
        api: 'healthy'
      },
      response_time_ms: responseTime,
      uptime: process.uptime()
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      services: {
        database: 'error',
        api: 'error'
      }
    }, { status: 503 })
  }
} 