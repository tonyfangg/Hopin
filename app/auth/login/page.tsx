import { LoginForm } from '@/components/auth/login-form'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      redirect('/dashboard')
    }
  } catch {
    // Continue to show login form if there's an error
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
