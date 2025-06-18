import { DrainageOverview } from '@/components/dashboard/drainage/overview'
import { DrainageInspections } from '@/components/dashboard/drainage/inspections'
import { DrainageAlerts } from '@/components/dashboard/drainage/alerts'

export default function DrainagePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Drainage Management</h1>
        <p className="text-slate-600">Monitor and maintain your drainage systems across all properties</p>
      </div>

      <DrainageOverview />
      <DrainageInspections />
      <DrainageAlerts />
    </div>
  )
} 