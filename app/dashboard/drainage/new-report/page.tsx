'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface Property {
  id: string
  name: string
  address: string
}

interface DrainageReportData {
  property_id: string
  inspection_date: string
  drainage_condition: string
  blockages_found: boolean
  blockage_locations: string
  structural_issues: boolean
  structural_details: string
  flow_rate: string
  visual_condition: string
  odour_present: boolean
  pest_activity: boolean
  recommendations: string
  urgent_action_required: boolean
  next_inspection_due: string
  inspector_name: string
  risk_rating: number
}

const drainageConditions = [
  'Excellent',
  'Good', 
  'Fair',
  'Poor',
  'Critical'
]

const flowRates = [
  'Excellent',
  'Good',
  'Adequate', 
  'Poor',
  'Blocked'
]

const visualConditions = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
  'Damaged'
]

export default function NewDrainageReportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<DrainageReportData>({
    property_id: '',
    inspection_date: new Date().toISOString().split('T')[0],
    drainage_condition: 'Good',
    blockages_found: false,
    blockage_locations: '',
    structural_issues: false,
    structural_details: '',
    flow_rate: 'Good',
    visual_condition: 'Good',
    odour_present: false,
    pest_activity: false,
    recommendations: '',
    urgent_action_required: false,
    next_inspection_due: '',
    inspector_name: '',
    risk_rating: 1
  })

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        if (response.ok) {
          const data = await response.json()
          setProperties(data.properties || [])
        } else {
          console.error('Failed to fetch properties')
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoadingProperties(false)
      }
    }

    fetchProperties()
  }, [])

  const handleInputChange = (field: keyof DrainageReportData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateRiskRating = (): number => {
    let risk = 1
    
    if (formData.drainage_condition === 'Critical') risk = 5
    else if (formData.drainage_condition === 'Poor') risk = 4
    else if (formData.drainage_condition === 'Fair') risk = 3
    else if (formData.drainage_condition === 'Good') risk = 2
    
    if (formData.blockages_found) risk += 1
    if (formData.structural_issues) risk += 1
    if (formData.urgent_action_required) risk += 2
    if (formData.odour_present) risk += 1
    if (formData.pest_activity) risk += 1
    
    return Math.min(5, risk)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const reportData = {
        ...formData,
        risk_rating: calculateRiskRating()
      }

      const response = await fetch('/api/drainage-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })

      if (response.ok) {
        router.push('/dashboard/drainage?success=report-created')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create drainage report')
      }
    } catch (error) {
      setError('An error occurred while creating the report')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/drainage')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">New Drainage Inspection Report</h1>
          <p className="text-sm sm:text-base text-slate-600">Document drainage system condition and maintenance requirements</p>
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
          {/* Property Selection */}
          <div>
            <label htmlFor="property_id" className="block text-sm font-medium text-slate-700 mb-2">
              Property *
            </label>
            {loadingProperties ? (
              <div className="animate-pulse bg-slate-200 h-12 rounded-lg"></div>
            ) : (
              <select
                id="property_id"
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
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inspection_date" className="block text-sm font-medium text-slate-700 mb-2">
                Inspection Date *
              </label>
              <input
                type="date"
                id="inspection_date"
                value={formData.inspection_date}
                onChange={(e) => handleInputChange('inspection_date', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="inspector_name" className="block text-sm font-medium text-slate-700 mb-2">
                Inspector Name *
              </label>
              <input
                type="text"
                id="inspector_name"
                value={formData.inspector_name}
                onChange={(e) => handleInputChange('inspector_name', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Drainage Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Drainage Assessment</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="drainage_condition" className="block text-sm font-medium text-slate-700 mb-2">
                  Overall Condition *
                </label>
                <select
                  id="drainage_condition"
                  value={formData.drainage_condition}
                  onChange={(e) => handleInputChange('drainage_condition', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {drainageConditions.map(condition => (
                    <option key={condition} value={condition.toLowerCase()}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="flow_rate" className="block text-sm font-medium text-slate-700 mb-2">
                  Flow Rate
                </label>
                <select
                  id="flow_rate"
                  value={formData.flow_rate}
                  onChange={(e) => handleInputChange('flow_rate', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {flowRates.map(rate => (
                    <option key={rate} value={rate.toLowerCase()}>
                      {rate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="visual_condition" className="block text-sm font-medium text-slate-700 mb-2">
                  Visual Condition
                </label>
                <select
                  id="visual_condition"
                  value={formData.visual_condition}
                  onChange={(e) => handleInputChange('visual_condition', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {visualConditions.map(condition => (
                    <option key={condition} value={condition.toLowerCase()}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Issues and Observations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Issues and Observations</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="blockages_found"
                    checked={formData.blockages_found}
                    onChange={(e) => handleInputChange('blockages_found', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="blockages_found" className="ml-2 block text-sm text-slate-700">
                    Blockages Found
                  </label>
                </div>

                {formData.blockages_found && (
                  <div>
                    <label htmlFor="blockage_locations" className="block text-sm font-medium text-slate-700 mb-2">
                      Blockage Locations
                    </label>
                    <textarea
                      id="blockage_locations"
                      value={formData.blockage_locations}
                      onChange={(e) => handleInputChange('blockage_locations', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe blockage locations and severity..."
                    />
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="structural_issues"
                    checked={formData.structural_issues}
                    onChange={(e) => handleInputChange('structural_issues', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="structural_issues" className="ml-2 block text-sm text-slate-700">
                    Structural Issues Found
                  </label>
                </div>

                {formData.structural_issues && (
                  <div>
                    <label htmlFor="structural_details" className="block text-sm font-medium text-slate-700 mb-2">
                      Structural Issue Details
                    </label>
                    <textarea
                      id="structural_details"
                      value={formData.structural_details}
                      onChange={(e) => handleInputChange('structural_details', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe structural issues found..."
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="odour_present"
                    checked={formData.odour_present}
                    onChange={(e) => handleInputChange('odour_present', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="odour_present" className="ml-2 block text-sm text-slate-700">
                    Unusual Odour Present
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pest_activity"
                    checked={formData.pest_activity}
                    onChange={(e) => handleInputChange('pest_activity', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="pest_activity" className="ml-2 block text-sm text-slate-700">
                    Pest Activity Observed
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="urgent_action_required"
                    checked={formData.urgent_action_required}
                    onChange={(e) => handleInputChange('urgent_action_required', e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 rounded"
                  />
                  <label htmlFor="urgent_action_required" className="ml-2 block text-sm text-slate-700">
                    Urgent Action Required
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations and Follow-up */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Recommendations and Follow-up</h3>
            
            <div>
              <label htmlFor="recommendations" className="block text-sm font-medium text-slate-700 mb-2">
                Recommendations and Actions Required
              </label>
              <textarea
                id="recommendations"
                value={formData.recommendations}
                onChange={(e) => handleInputChange('recommendations', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe recommended actions, maintenance requirements, or follow-up inspections..."
              />
            </div>

            <div>
              <label htmlFor="next_inspection_due" className="block text-sm font-medium text-slate-700 mb-2">
                Next Inspection Due Date
              </label>
              <input
                type="date"
                id="next_inspection_due"
                value={formData.next_inspection_due}
                onChange={(e) => handleInputChange('next_inspection_due', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Risk Rating Display */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-slate-900 mb-2">Calculated Risk Rating</h3>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                calculateRiskRating() <= 2 ? 'bg-green-100 text-green-800' :
                calculateRiskRating() <= 3 ? 'bg-yellow-100 text-yellow-800' :
                calculateRiskRating() <= 4 ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                Risk Level: {calculateRiskRating()}/5
              </div>
              <span className="text-sm text-slate-600">
                {calculateRiskRating() <= 2 ? 'Low Risk' :
                 calculateRiskRating() <= 3 ? 'Medium Risk' :
                 calculateRiskRating() <= 4 ? 'High Risk' : 'Critical Risk'}
              </span>
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
            {loading ? 'Creating Report...' : 'Create Drainage Report'}
          </Button>
        </div>
      </form>
    </div>
  )
}