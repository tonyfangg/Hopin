'use client'

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-medium text-slate-600">Total Revenue</h3>
        <p className="text-2xl font-bold text-slate-900 mt-2">$24,780</p>
        <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-medium text-slate-600">Active Users</h3>
        <p className="text-2xl font-bold text-slate-900 mt-2">1,234</p>
        <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-medium text-slate-600">Total Orders</h3>
        <p className="text-2xl font-bold text-slate-900 mt-2">456</p>
        <p className="text-sm text-red-600 mt-1">-2.4% from last month</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-medium text-slate-600">Conversion Rate</h3>
        <p className="text-2xl font-bold text-slate-900 mt-2">3.2%</p>
        <p className="text-sm text-green-600 mt-1">+0.8% from last month</p>
      </div>
    </div>
  )
}
