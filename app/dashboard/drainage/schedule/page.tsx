'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface Property {
  id: string
  name: string
  address: string
}

interface MaintenanceSchedule {
  id?: string
  property_id: string
  maintenance_type: string
  scheduled_date: string
  frequency: string
  priority: string
  description: string
  assigned_contractor: string
  estimated_cost: number
  status: string
}

const maintenanceTypes = [
  'Routine Cleaning',
  'Blockage Removal',
  'CCTV Survey',
  'Drain Jetting',
  'Structural Repair',
  'Preventive Maintenance',
  'Emergency Call-out'
]

const frequencies = [
  'One-time',
  'Monthly',
  'Quarterly',
  'Bi-annually',
  'Annually'
]

const priorities = [
  'Low',
  'Medium',
  'High',
  'Urgent'
]

const statuses = [
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled'
]

export default function DrainageSchedulePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scheduledMaintenance, setScheduledMaintenance] = useState<MaintenanceSchedule[]>([])
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState<MaintenanceSchedule>({
    property_id: '',
    maintenance_type: 'Routine Cleaning',
    scheduled_date: '',
    frequency: 'One-time',
    priority: 'Medium',
    description: '',
    assigned_contractor: '',
    estimated_cost: 0,
    status: 'Scheduled'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties
        const propertiesResponse = await fetch('/api/properties')
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json()
          setProperties(propertiesData.properties || [])
        }

        // Fetch existing maintenance schedules (mock data for now)
        setScheduledMaintenance([
          {
            id: '1',
            property_id: 'prop1',
            maintenance_type: 'Routine Cleaning',
            scheduled_date: '2024-02-15',
            frequency: 'Quarterly',
            priority: 'Medium',
            description: 'Quarterly drainage system cleaning and inspection',
            assigned_contractor: 'AquaFlow Services',
            estimated_cost: 250,
            status: 'Scheduled'
          },
          {
            id: '2',
            property_id: 'prop1',
            maintenance_type: 'CCTV Survey',
            scheduled_date: '2024-03-01',
            frequency: 'Annually',
            priority: 'Low',
            description: 'Annual CCTV drainage survey for preventive maintenance',
            assigned_contractor: 'DrainTech Solutions',
            estimated_cost: 450,
            status: 'Scheduled'
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoadingProperties(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (field: keyof MaintenanceSchedule, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // For now, just add to local state (in real app, would call API)
      const newSchedule: MaintenanceSchedule = {
        ...formData,
        id: Date.now().toString()
      }
      
      setScheduledMaintenance(prev => [...prev, newSchedule])
      setShowForm(false)
      setFormData({
        property_id: '',
        maintenance_type: 'Routine Cleaning',
        scheduled_date: '',
        frequency: 'One-time',
        priority: 'Medium',
        description: '',
        assigned_contractor: '',
        estimated_cost: 0,
        status: 'Scheduled'
      })
    } catch (error) {
      setError('An error occurred while scheduling maintenance')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    return property ? property.name : 'Unknown Property'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Scheduled': return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Drainage Maintenance Schedule</h1>
          <p className="text-sm sm:text-base text-slate-600">Plan and track drainage system maintenance activities</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 min-h-[44px] touch-manipulation"
        >
          + Schedule Maintenance
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Scheduled Maintenance List */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Scheduled Maintenance</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contractor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {scheduledMaintenance.map((maintenance) => (
                <tr key={maintenance.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {getPropertyName(maintenance.property_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {maintenance.maintenance_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(maintenance.scheduled_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(maintenance.priority)}`}>
                      {maintenance.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {maintenance.assigned_contractor || 'TBD'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    £{maintenance.estimated_cost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(maintenance.status)}`}>
                      {maintenance.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {scheduledMaintenance.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-slate-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Maintenance Scheduled</h3>
            <p className="text-slate-600 mb-4">
              Schedule your first maintenance activity to keep drainage systems in optimal condition.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Schedule Maintenance
            </Button>
          </div>
        )}
      </div>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Schedule Maintenance</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property *
                </label>
                <select
                  value={formData.property_id}
                  onChange={(e) => handleInputChange('property_id', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name} - {property.address}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maintenance Type *
                  </label>
                  <select
                    value={formData.maintenance_type}
                    onChange={(e) => handleInputChange('maintenance_type', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {maintenanceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the maintenance work required..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Assigned Contractor
                  </label>
                  <input
                    type="text"
                    value={formData.assigned_contractor}
                    onChange={(e) => handleInputChange('assigned_contractor', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contractor company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estimated Cost (£)
                  </label>
                  <input
                    type="number"
                    value={formData.estimated_cost}
                    onChange={(e) => handleInputChange('estimated_cost', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Scheduling...' : 'Schedule Maintenance'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}