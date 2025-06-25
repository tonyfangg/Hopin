// =====================================================
// TEST API ENDPOINT - NO AUTHENTICATION REQUIRED
// File: app/api/test/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'API is working correctly',
      timestamp: new Date().toISOString(),
      status: 'success'
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString(),
      status: 'success'
    }, { status: 201 })
  } catch (error) {
    console.error('Test API POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 