import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

function LoadingSpinner() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  )
}

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingSpinner />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
