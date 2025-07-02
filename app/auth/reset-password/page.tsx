'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/button'
import Link from 'next/link'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading reset form...</p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  )
} 