import { DashboardSidebar } from '@/app/components/dashboard/sidebar'
import { DashboardHeader } from '@/app/components/dashboard/header'
import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      redirect('/auth/login')
    }

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <DashboardSidebar />
          <div className="flex-1 ml-64">
            <DashboardHeader user={session.user} />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    )
  } catch {
    redirect('/auth/login')
  }
}
