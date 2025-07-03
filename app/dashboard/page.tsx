import { createServerSupabaseClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back, {session.user.email}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Properties</h3>
              <p className="text-blue-600 text-sm font-medium">Manage your locations</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">3</div>
          <p className="text-slate-500 text-sm">Active Properties</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Risk Score</h3>
              <p className="text-green-600 text-sm font-medium">Overall Rating</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">85%</div>
          <p className="text-slate-500 text-sm">Low Risk</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Reports</h3>
              <p className="text-yellow-600 text-sm font-medium">Due This Month</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">2</div>
          <p className="text-slate-500 text-sm">Pending Items</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
        ✅ Login successful! You are now authenticated and can access the dashboard.
      </div>
    </div>
  )
}