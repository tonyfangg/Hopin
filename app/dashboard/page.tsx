import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UnifiedRiskOverview } from '@/components/dashboard/unified-risk-overview'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Overview of your property portfolio and operations</p>
      </div>

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Unified Risk Overview */}
      <UnifiedRiskOverview />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <QuickActions />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}