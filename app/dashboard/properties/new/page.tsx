'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface PropertyData {
  name: string
  address: string
  postcode: string
  property_type: string
  floor_area: number
  description: string
  contact_person: string
  contact_phone: string
  contact_email: string
}

const propertyTypes = [
  'Retail Store',
  'Office',
  'Warehouse',
  'Restaurant',
  'Cafe',
  'Shop',
  'Supermarket',
  'Other'
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<PropertyData>({
    name: '',
    address: '',
    postcode: '',
    property_type: 'Retail Store',
    floor_area: 0,
    description: '',
    contact_person: '',
    contact_phone: '',
    contact_email: ''
  })

  const handleInputChange = (field: keyof PropertyData, value: any) => {
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
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push('/dashboard/properties?success=property-created')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create property')
      }
    } catch (error) {
      setError('An error occurred while creating the property')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/properties')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Add New Property</h1>
          <p className="text-sm sm:text-base text-slate-600">Register a new property for risk management and compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="min-h-[44px] touch-manipulation"
          >
            Cancel
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Basic Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Main Store London, Branch Office Manchester"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full property address"
                  required
                />
              </div>

              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-slate-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SW1A 1AA"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-slate-700 mb-2">
                  Property Type *
                </label>
                <select
                  id="property_type"
                  value={formData.property_type}
                  onChange={(e) => handleInputChange('property_type', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="floor_area" className="block text-sm font-medium text-slate-700 mb-2">
                  Floor Area (sq ft)
                </label>
                <input
                  type="number"
                  id="floor_area"
                  value={formData.floor_area || ''}
                  onChange={(e) => handleInputChange('floor_area', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1500"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional details about the property, special features, or notes..."
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Contact Information</h3>
            <p className="text-sm text-slate-600">Local contact person for this property (optional)</p>
            
            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-slate-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Property manager or local contact"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="01234 567890"
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contact_email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@property.com"
                />
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5">💡</span>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your property will be added to the risk management system</li>
                  <li>• You can start scheduling inspections and compliance checks</li>
                  <li>• Risk assessments will be calculated as you add inspection data</li>
                  <li>• Insurance requirements will be analyzed based on property type</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 min-h-[44px] touch-manipulation"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 min-h-[44px] touch-manipulation"
            disabled={loading}
          >
            {loading ? 'Creating Property...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </div>
  )
}