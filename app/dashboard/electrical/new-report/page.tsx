'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ElectricalInspectionForm } from '@/components/forms/electrical-inspection-form'

export default function NewElectricalReportPage() {
  const router = useRouter()

  const handleSuccess = (report: any) => {
    console.log('Electrical report created:', report)
    router.push('/dashboard/electrical?success=report-created')
  }

  const handleCancel = () => {
    router.push('/dashboard/electrical')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">New Electrical Inspection Report</h1>
          <p className="text-sm sm:text-base text-slate-600">Document electrical safety inspection and compliance status</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        <ElectricalInspectionForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}