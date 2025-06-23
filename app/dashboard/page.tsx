import { StatsCards } from '@/app/dashboard/stats-cards'
import { CreditScoreHero } from '@/app/dashboard/credit-score-hero'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { ServiceStatus } from '@/app/dashboard/service-status'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Credit Score Hero */}
      <CreditScoreHero />
      
      {/* Main Stats */}
      <StatsCards />
      
      {/* Performance Chart */}
      <PerformanceChart />
      
      {/* Service Status */}
      <ServiceStatus />
    </div>
  )
}