// =====================================================
// CUSTOMER SUCCESS MILESTONE API
// File: app/api/customer-success/milestone/route.ts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { milestone, organisation_id, metadata, timestamp } = await request.json()

    if (!milestone || !organisation_id) {
      return NextResponse.json(
        { error: 'Milestone and organisation_id are required' },
        { status: 400 }
      )
    }

    // Check if user has access to this organisation
    const { data: permission } = await supabase
      .from('user_permissions')
      .select('organisation_id')
      .eq('user_id', session.user.id)
      .eq('organisation_id', organisation_id)
      .eq('is_active', true)
      .single()

    if (!permission) {
      return NextResponse.json(
        { error: 'No access to this organisation' },
        { status: 403 }
      )
    }

    // Record the milestone
    const { data: milestoneRecord, error: milestoneError } = await supabase
      .from('customer_milestones')
      .insert({
        user_id: session.user.id,
        organisation_id,
        milestone,
        metadata: metadata || {},
        timestamp: timestamp || new Date().toISOString()
      })
      .select()
      .single()

    if (milestoneError) {
      console.error('Error recording milestone:', milestoneError)
      return NextResponse.json(
        { error: 'Failed to record milestone' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      milestone: milestoneRecord,
      message: 'Milestone recorded successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Customer success milestone API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 