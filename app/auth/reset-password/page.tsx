import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { FragmentAuthHandler } from '@/components/auth/fragment-auth-handler'

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

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingSpinner />}>
        <FragmentAuthHandler>
          <ResetPasswordForm />
        </FragmentAuthHandler>
      </Suspense>
    </div>
  )
} 