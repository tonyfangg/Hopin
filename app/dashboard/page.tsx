import { StatsCards } from '@/app/dashboard/stats-cards'
import { RiskScoreHero } from '@/app/dashboard/risk-score-hero'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { ServiceStatus } from '@/app/dashboard/service-status'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Risk Score Hero - Only one hero section */}
      <RiskScoreHero />
      
      {/* Main Stats */}
      <StatsCards />
      
      {/* Performance Chart */}
      <PerformanceChart />
      
      {/* Service Status */}
      <ServiceStatus />
    </div>
  )
}