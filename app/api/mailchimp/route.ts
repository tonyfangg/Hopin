import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Store in Supabase
    const supabase = await createServerSupabaseClient()
    const { error: dbError } = await supabase
      .from('email_signups')
      .insert([{ email, source: 'landing_page_notify' }])

    if (dbError && dbError.code !== '23505') {
      console.error('Database error:', dbError)
    }

    // Mailchimp integration (your existing code)
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
    const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
      return NextResponse.json({ success: true, message: 'Email saved!' })
    }

    const response = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['landing-page', 'early-access'],
        }),
      }
    )

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Successfully subscribed!' })
    } else {
      const data = await response.json()
      if (data.title === 'Member Exists') {
        return NextResponse.json({ success: true, message: 'You\'re already on the list!' })
      }
      return NextResponse.json({ success: true, message: 'Email saved!' })
    }
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
