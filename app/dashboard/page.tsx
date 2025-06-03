import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { PerformanceChart } from '@/app/components/dashboard/performance-chart'
import { ServiceStatus } from '@/app/components/dashboard/service-status'

export default async function DashboardPage() {
  const supabase = createServerClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      redirect('/auth/login')
    }

    return (
      <div className="space-y-6">
        <StatsCards />
        <PerformanceChart />
        <ServiceStatus />
      </div>
    )
  } catch {
    redirect('/auth/login')
  }
}