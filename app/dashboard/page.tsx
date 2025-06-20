import { StatsCards } from '@/app/dashboard/stats-cards'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { ServiceStatus } from '@/components/dashboard/service-status'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <StatsCards />
      
      {/* Performance Chart */}
      <PerformanceChart />
      
      {/* Service Status */}
      <ServiceStatus />
    </div>
  )
}