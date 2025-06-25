'use client'

import { useState } from 'react'

interface Property {
  id: string
  name: string
  address: string
  property_type: string
  organisation: {
    name: string
    type: string
  }
  electrical_reports: { count: number }[]
  drainage_reports: { count: number }[]
  created_at: string
}

interface PropertyListProps {
  properties: Property[]
  onRefresh: () => void
}

export function PropertyList({ properties, onRefresh }: PropertyListProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  const formatPropertyType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Property Portfolio ({properties.length})
          </h3>
          <button
            onClick={onRefresh}
            className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Property</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Type</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Organisation</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Reports</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Added</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {properties.map((property) => (
              <tr 
                key={property.id} 
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-slate-900">{property.name}</div>
                    <div className="text-sm text-slate-600 truncate max-w-xs">
                      {property.address}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {formatPropertyType(property.property_type || 'retail_store')}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {property.organisation?.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatPropertyType(property.organisation?.type || '')}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      ⚡ {property.electrical_reports?.[0]?.count || 0}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-cyan-100 text-cyan-800">
                      💧 {property.drainage_reports?.[0]?.count || 0}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {formatDate(property.created_at)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      onClick={() => setSelectedProperty(property.id)}
                    >
                      View
                    </button>
                    <button className="text-slate-600 hover:text-slate-700 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 