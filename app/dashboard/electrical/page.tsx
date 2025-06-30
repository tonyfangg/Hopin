'use client'

import { useState } from 'react'
import { ElectricalOverview } from '@/components/dashboard/electrical/overview'
import { ElectricalInspections } from '@/components/dashboard/electrical/inspections'
import ElectricalSafety from '@/components/dashboard/electrical/safety'
import { ElectricalMaintenance } from '@/components/dashboard/electrical/maintenance'
import { ElectricalInspectionForm } from '@/components/forms/electrical-inspection-form'

export default function ElectricalPage() {
  const [showInspectionForm, setShowInspectionForm] = useState(false)

  const handleInspectionSuccess = (report: any) => {
    console.log('Inspection report created:', report)
    setShowInspectionForm(false)
    // Refresh the page or update state
    window.location.reload()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Electrical Systems</h1>
          <p className="text-slate-600">Monitor electrical safety and compliance across all properties</p>
        </div>
        <button
          onClick={() => setShowInspectionForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Inspection
        </button>
      </div>

      <ElectricalOverview />
      <ElectricalSafety />
      <ElectricalInspections />
      <ElectricalMaintenance />

      {/* Electrical Inspection Form Modal */}
      {showInspectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ElectricalInspectionForm 
              onSuccess={handleInspectionSuccess}
              onCancel={() => setShowInspectionForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 