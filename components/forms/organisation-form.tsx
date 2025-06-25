'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OrganisationFormProps {
  onSuccess?: (organisation: any) => void
  onCancel?: () => void
}

export function OrganisationForm({ onSuccess, onCancel }: OrganisationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'independent_store' as 'retail_chain' | 'franchise' | 'independent_store',
    trading_name: '',
    company_number: '',
    vat_number: '',
    address_line_1: '',
    address_line_2: '',
    town_city: '',
    county: '',
    postcode: '',
    contact_email: '',
    contact_telephone: '',
    contact_mobile: '',
    website_url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/organisations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create organisation')
      }

      if (onSuccess) {
        onSuccess(data.organisation)
      } else {
        router.push('/dashboard/settings')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">🏢</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create Organisation</h2>
            <p className="text-slate-600">Add your retail business details</p>
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
                Legal Company Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Hoops Retail Ltd"
              />
            </div>

            <div>
              <label htmlFor="trading_name" className="block text-sm font-medium text-slate-700 mb-2">
                Trading Name
              </label>
              <input
                type="text"
                id="trading_name"
                name="trading_name"
                value={formData.trading_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Hoops Stores"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                Business Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="independent_store">Independent Store</option>
                <option value="retail_chain">Retail Chain</option>
                <option value="franchise">Franchise</option>
              </select>
            </div>

            <div>
              <label htmlFor="company_number" className="block text-sm font-medium text-slate-700 mb-2">
                Companies House Number
              </label>
              <input
                type="text"
                id="company_number"
                name="company_number"
                value={formData.company_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 12345678"
              />
            </div>

            <div>
              <label htmlFor="vat_number" className="block text-sm font-medium text-slate-700 mb-2">
                VAT Registration Number
              </label>
              <input
                type="text"
                id="vat_number"
                name="vat_number"
                value={formData.vat_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., GB123456789"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Registered Address</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="address_line_1" className="block text-sm font-medium text-slate-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="address_line_1"
                  name="address_line_1"
                  value={formData.address_line_1}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 123 High Street"
                />
              </div>

              <div>
                <label htmlFor="address_line_2" className="block text-sm font-medium text-slate-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="address_line_2"
                  name="address_line_2"
                  value={formData.address_line_2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Business Park"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="town_city" className="block text-sm font-medium text-slate-700 mb-2">
                    Town/City
                  </label>
                  <input
                    type="text"
                    id="town_city"
                    name="town_city"
                    value={formData.town_city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., London"
                  />
                </div>

                <div>
                  <label htmlFor="county" className="block text-sm font-medium text-slate-700 mb-2">
                    County
                  </label>
                  <input
                    type="text"
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Greater London"
                  />
                </div>

                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-slate-700 mb-2">
                    Postcode
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., SW1A 1AA"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., admin@hoopsstores.co.uk"
                />
              </div>

              <div>
                <label htmlFor="website_url" className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website_url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., https://www.hoopsstores.co.uk"
                />
              </div>

              <div>
                <label htmlFor="contact_telephone" className="block text-sm font-medium text-slate-700 mb-2">
                  Main Telephone
                </label>
                <input
                  type="tel"
                  id="contact_telephone"
                  name="contact_telephone"
                  value={formData.contact_telephone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 020 7123 4567"
                />
              </div>

              <div>
                <label htmlFor="contact_mobile" className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile
                </label>
                <input
                  type="tel"
                  id="contact_mobile"
                  name="contact_mobile"
                  value={formData.contact_mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 07123 456789"
                />
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
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Organisation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 