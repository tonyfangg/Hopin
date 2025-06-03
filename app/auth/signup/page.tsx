import { SignupForm } from '@/components/auth/signup-form'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function SignupPage() {
  const supabase = createServerClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      redirect('/dashboard')
    }
  } catch {
    // Continue to show signup form if there's an error
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <SignupForm />
    </div>
  )
}
