import { ElectricalOverview } from '@/components/dashboard/electrical/overview'
import { ElectricalInspections } from '@/components/dashboard/electrical/inspections'
import { ElectricalSafety } from '@/components/dashboard/electrical/safety'
import { ElectricalMaintenance } from '@/components/dashboard/electrical/maintenance'

export default function ElectricalPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Electrical Systems</h1>
        <p className="text-slate-600">Monitor electrical safety and compliance across all properties</p>
      </div>

      <ElectricalOverview />
      <ElectricalSafety />
      <ElectricalInspections />
      <ElectricalMaintenance />
    </div>
  )
} 