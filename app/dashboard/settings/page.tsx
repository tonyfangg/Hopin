'use client'

import { useState } from 'react'
import { AccountSettings } from '@/components/dashboard/settings/account'
import { PropertySettings } from '@/components/dashboard/settings/property'
import { RiskSettings } from '@/components/dashboard/settings/risk'
import { NotificationSettings } from '@/components/dashboard/settings/notifications'
import { PlanSettings } from '@/components/dashboard/settings/plan'
import { OrganisationForm } from '@/components/forms/organisation-form'

export default function SettingsPage() {
  const [showOrganisationForm, setShowOrganisationForm] = useState(false)

  const handleOrganisationSuccess = (org: any) => {
    console.log('Organisation created:', org)
    setShowOrganisationForm(false)
    // Refresh the page or update state
    window.location.reload()
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account and application preferences</p>
        </div>
        <button
          onClick={() => setShowOrganisationForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Organisation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          <AccountSettings />
          <PropertySettings />
          <RiskSettings />
          <NotificationSettings />
        </div>
        
        {/* Sidebar */}
        <div>
          <PlanSettings />
        </div>
      </div>

      {/* Organisation Form Modal */}
      {showOrganisationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <OrganisationForm 
              onSuccess={handleOrganisationSuccess}
              onCancel={() => setShowOrganisationForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
  