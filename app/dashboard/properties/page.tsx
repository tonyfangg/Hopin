'use client'

import { useState, useEffect } from 'react'
import { PropertyForm } from '@/components/forms/property-form'
import { PropertyList } from '@/components/dashboard/properties/property-list'

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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()

      if (response.ok) {
        setProperties(data.properties || [])
      } else {
        setError(data.error || 'Failed to fetch properties')
      }
    } catch (err) {
      setError('Failed to load properties')
      console.error('Properties error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handlePropertyAdded = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev])
    setShowAddForm(false)
  }

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Add New Property</h1>
          <button
            onClick={() => setShowAddForm(false)}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Back to Properties
          </button>
        </div>
        <PropertyForm
          onSuccess={handlePropertyAdded}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="text-slate-600">Manage your property portfolio</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Property
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchProperties}
            className="mt-2 text-red-700 hover:text-red-900 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏪</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Properties Yet</h3>
          <p className="text-slate-600 mb-6">Start by adding your first property to the system</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Property
          </button>
        </div>
      ) : (
        <PropertyList properties={properties} onRefresh={fetchProperties} />
      )}
    </div>
  )
}
  