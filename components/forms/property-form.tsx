'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface PropertyFormData {
  name: string
  address: string
  organisation_id: string
  property_type: string
  floor_area_sqm: string
  number_of_floors: string
  building_age_years: string
  lease_type: string
  lease_expiry_date: string
  council_tax_band: string
  business_rates_reference: string
  is_listed_building: boolean
  conservation_area: boolean
}

interface Organisation {
  id: string
  name: string
  type: string
}

interface PropertyFormProps {
  onSuccess?: (property: any) => void
  onCancel?: () => void
  selectedOrganisationId?: string
}

const propertyTypes = [
  'Office',
  'Retail',
  'Industrial',
  'Warehouse',
  'Residential',
  'Mixed Use',
  'Healthcare',
  'Education',
  'Leisure',
  'Other'
]

const leaseTypes = [
  'Freehold',
  'Leasehold',
  'Licence',
  'Tenancy at Will',
  'Other'
]

const councilTaxBands = [
  'A',
  'B', 
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'Exempt'
]

export function PropertyForm({ onSuccess, onCancel, selectedOrganisationId }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [loadingOrganisations, setLoadingOrganisations] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    organisation_id: selectedOrganisationId || '',
    property_type: 'retail_store' as 'retail_store' | 'warehouse' | 'office' | 'mixed_use',
    floor_area_sqm: '',
    number_of_floors: '',
    building_age_years: '',
    lease_type: 'leasehold' as 'freehold' | 'leasehold' | 'rental',
    lease_expiry_date: '',
    council_tax_band: '',
    business_rates_reference: '',
    is_listed_building: false,
    conservation_area: false
  })

  // Fetch organisations on component mount
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const response = await fetch('/api/organisations')
        const data = await response.json()
        
        if (response.ok) {
          setOrganisations(data.organisations || [])
        } else {
          console.error('Failed to fetch organisations:', data.error)
        }
      } catch (error) {
        console.error('Error fetching organisations:', error)
      } finally {
        setLoadingOrganisations(false)
      }
    }

    fetchOrganisations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        floor_area_sqm: formData.floor_area_sqm ? parseFloat(formData.floor_area_sqm) : undefined,
        number_of_floors: formData.number_of_floors ? parseInt(formData.number_of_floors) : undefined,
        building_age_years: formData.building_age_years ? parseInt(formData.building_age_years) : undefined,
        lease_expiry_date: formData.lease_expiry_date || undefined
      }

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create property')
      }

      if (onSuccess) {
        onSuccess(data.property)
      } else {
        router.push('/dashboard/properties')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🏪</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add New Property</h2>
            <p className="text-slate-600">Register a new store or property location</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Hopin #1 - High Street"
              />
            </div>

            <div>
              <label htmlFor="organisation_id" className="block text-sm font-medium text-slate-700 mb-2">
                Organisation *
              </label>
              <select
                id="organisation_id"
                name="organisation_id"
                required
                value={formData.organisation_id}
                onChange={handleChange}
                disabled={loadingOrganisations || !!selectedOrganisationId}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              >
                <option value="">Select an organisation...</option>
                {organisations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.type.replace('_', ' ')})
                  </option>
                ))}
              </select>
              {loadingOrganisations && (
                <p className="text-sm text-slate-500 mt-1">Loading organisations...</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
              Full Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 123 High Street, Town Centre, London, SW1A 1AA"
            />
          </div>

          {/* Property Details */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-slate-700 mb-2">
                  Property Type
                </label>
                <select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="retail_store">Retail Store</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="office">Office</option>
                  <option value="mixed_use">Mixed Use</option>
                </select>
              </div>

              <div>
                <label htmlFor="floor_area_sqm" className="block text-sm font-medium text-slate-700 mb-2">
                  Floor Area (m²)
                </label>
                <input
                  type="number"
                  id="floor_area_sqm"
                  name="floor_area_sqm"
                  step="0.1"
                  value={formData.floor_area_sqm}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 250.5"
                />
              </div>

              <div>
                <label htmlFor="number_of_floors" className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Floors
                </label>
                <input
                  type="number"
                  id="number_of_floors"
                  name="number_of_floors"
                  min="1"
                  value={formData.number_of_floors}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2"
                />
              </div>

              <div>
                <label htmlFor="building_age_years" className="block text-sm font-medium text-slate-700 mb-2">
                  Building Age (Years)
                </label>
                <input
                  type="number"
                  id="building_age_years"
                  name="building_age_years"
                  min="0"
                  value={formData.building_age_years}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 15"
                />
              </div>
            </div>
          </div>

          {/* Legal & Financial Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Legal & Financial Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lease_type" className="block text-sm font-medium text-slate-700 mb-2">
                  Tenure Type
                </label>
                <select
                  id="lease_type"
                  name="lease_type"
                  value={formData.lease_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="freehold">Freehold</option>
                  <option value="leasehold">Leasehold</option>
                  <option value="rental">Rental</option>
                </select>
              </div>

              <div>
                <label htmlFor="lease_expiry_date" className="block text-sm font-medium text-slate-700 mb-2">
                  Lease Expiry Date
                </label>
                <input
                  type="date"
                  id="lease_expiry_date"
                  name="lease_expiry_date"
                  value={formData.lease_expiry_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="council_tax_band" className="block text-sm font-medium text-slate-700 mb-2">
                  Council Tax Band
                </label>
                <select
                  id="council_tax_band"
                  name="council_tax_band"
                  value={formData.council_tax_band}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select band...</option>
                  {councilTaxBands.map((band) => (
                    <option key={band} value={band}>
                      Band {band}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="business_rates_reference" className="block text-sm font-medium text-slate-700 mb-2">
                  Business Rates Reference
                </label>
                <input
                  type="text"
                  id="business_rates_reference"
                  name="business_rates_reference"
                  value={formData.business_rates_reference}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 12345678901234567890"
                />
              </div>
            </div>
          </div>

          {/* Special Designations */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Special Designations</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_listed_building"
                  name="is_listed_building"
                  checked={formData.is_listed_building}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_listed_building" className="ml-2 text-sm text-slate-700">
                  Listed Building (Grade I, II* or II)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conservation_area"
                  name="conservation_area"
                  checked={formData.conservation_area}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="conservation_area" className="ml-2 text-sm text-slate-700">
                  Located in Conservation Area
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || loadingOrganisations}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 