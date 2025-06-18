import { AccountSettings } from '@/components/dashboard/settings/account'
import { PropertySettings } from '@/components/dashboard/settings/property'
import { RiskSettings } from '@/components/dashboard/settings/risk'
import { NotificationSettings } from '@/components/dashboard/settings/notifications'
import { PlanSettings } from '@/components/dashboard/settings/plan'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account and application preferences</p>
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
    </div>
  )
}
  