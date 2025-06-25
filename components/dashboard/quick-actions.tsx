'use client'

import { useRouter } from 'next/navigation'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: 'Add Property',
      description: 'Register a new property',
      icon: '🏪',
      color: 'bg-blue-100 text-blue-600',
      onClick: () => router.push('/dashboard/properties?action=add')
    },
    {
      title: 'Electrical Inspection',
      description: 'Record EICR or PAT test',
      icon: '⚡',
      color: 'bg-yellow-100 text-yellow-600',
      onClick: () => router.push('/dashboard/electrical?action=add')
    },
    {
      title: 'Drainage Check',
      description: 'Log drainage inspection',
      icon: '💧',
      color: 'bg-cyan-100 text-cyan-600',
      onClick: () => router.push('/dashboard/drainage?action=add')
    },
    {
      title: 'Upload Document',
      description: 'Add certificates or reports',
      icon: '📄',
      color: 'bg-green-100 text-green-600',
      onClick: () => router.push('/dashboard/documents?action=upload')
    },
    {
      title: 'Risk Assessment',
      description: 'Conduct risk evaluation',
      icon: '🛡️',
      color: 'bg-purple-100 text-purple-600',
      onClick: () => router.push('/dashboard/risk-assessments?action=add')
    },
    {
      title: 'View Reports',
      description: 'Generate compliance reports',
      icon: '📊',
      color: 'bg-indigo-100 text-indigo-600',
      onClick: () => router.push('/dashboard/reports')
    }
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
              <span className="text-xl">{action.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900">{action.title}</h4>
              <p className="text-sm text-slate-600">{action.description}</p>
            </div>
            <div className="text-slate-400">
              →
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 