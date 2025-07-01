import { SignupWizard } from '@/components/auth/enhanced-signup/signup-wizard'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SignupPage() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      redirect('/dashboard')
    }
  } catch {
    // Continue to show signup form if there's an error
  }

  return <SignupWizard />
}