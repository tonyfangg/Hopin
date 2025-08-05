'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ElectricalInspectionForm } from '@/components/forms/electrical-inspection-form'

export default function NewTestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInspectionSuccess = (report: any) => {
    console.log('PAT test created:', report)
    // Redirect back to electrical dashboard
    window.location.href = '/dashboard/electrical'
  }

  const handleCancel = () => {
    window.location.href = '/dashboard/electrical'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/electrical"
          className="text-slate-600 hover:text-slate-900 text-sm font-medium"
        >
          ← Back to Electrical Systems
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">New PAT Test</h1>
          <p className="text-slate-600 mt-1">Record a new Portable Appliance Test (PAT) inspection</p>
        </div>

        <div className="p-6">
          <ElectricalInspectionForm
            onSuccess={handleInspectionSuccess}
            onCancel={handleCancel}
            defaultInspectionType="PAT Testing"
          />
        </div>
      </div>
    </div>
  )
}