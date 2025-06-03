import { StatsCards } from '@/components/dashboard/stats-cards'
import { PerformanceChart } from '@/app/components/dashboard/performance-chart'
import { ServiceStatus } from '@/app/components/dashboard/service-status'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Performance Chart */}
      <PerformanceChart />
      
      {/* Service Status Table */}
      <ServiceStatus />
    </div>
  )
}
