import { StatsCards } from '@/components/dashboard/stats-cards'
import { RiskScoreCard } from '@/components/dashboard/risk-score-card'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { ServiceStatus } from '@/components/dashboard/service-status'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <StatsCards />
      
      {/* Risk Score Highlight */}
      <RiskScoreCard />
      
      {/* Performance Chart */}
      <PerformanceChart />
      
      {/* Service Status */}
      <ServiceStatus />
    </div>
  )
}