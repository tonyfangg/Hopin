'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'

interface ElectricalInspectionFormData {
  property_id: string
  inspection_type: string
  certificate_number: string
  inspector_name: string
  inspector_qualification: string
  inspection_date: string
  next_inspection_due: string
  overall_condition: string
  remedial_work_required: boolean
  remedial_work_description: string
  remedial_work_priority: string
  test_results: {
    earth_fault_loop_impedance: string
    insulation_resistance: string
    polarity_test: string
    rcd_test: string
    continuity_test: string
  }
  risk_rating: string
  compliance_status: string
}

interface Property {
  id: string
  name: string
  address: string
  organisation: {
    name: string
  }
}

interface ElectricalInspectionFormProps {
  onSuccess?: (report: any) => void
  onCancel?: () => void
  preselectedPropertyId?: string
}

const inspectionTypes = [
  'Periodic',
  'Initial Verification',
  'Minor Works',
  'Major Works',
  'Emergency',
  'Re-inspection',
  'Other'
]

const overallConditions = [
  'Excellent',
  'Good',
  'Satisfactory',
  'Poor',
  'Dangerous',
  'Unsafe'
]

const remedialWorkPriorities = [
  'Immediate',
  'High',
  'Medium',
  'Low',
  'None Required'
]

const riskRatings = [
  'Low',
  'Medium',
  'High',
  'Critical'
]

const complianceStatuses = [
  'Compliant',
  'Non-Compliant',
  'Partially Compliant',
  'Under Review',
  'Pending Remedial Work'
]

export function ElectricalInspectionForm({ onSuccess, onCancel, preselectedPropertyId }: ElectricalInspectionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  
  const [formData, setFormData] = useState<ElectricalInspectionFormData>({
    property_id: preselectedPropertyId || '',
    inspection_type: 'eicr' as 'eicr' | 'pat_testing' | 'fire_alarm_testing' | 'emergency_lighting_testing' | 'fire_extinguisher_service' | 'fixed_wire_testing' | 'rcd_testing',
    certificate_number: '',
    inspector_name: '',
    inspector_qualification: '',
    inspection_date: '',
    next_inspection_due: '',
    overall_condition: 'satisfactory' as 'satisfactory' | 'unsatisfactory' | 'requires_improvement',
    remedial_work_required: false,
    remedial_work_description: '',
    remedial_work_priority: 'improvement_recommended' as 'urgent' | 'requires_attention' | 'improvement_recommended',
    risk_rating: '1',
    compliance_status: 'compliant' as 'compliant' | 'non_compliant' | 'partially_compliant',
    test_results: {
      earth_fault_loop_impedance: '',
      insulation_resistance: '',
      polarity_test: '',
      rcd_test: '',
      continuity_test: ''
    }
  })

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        const data = await response.json()
        
        if (response.ok) {
          setProperties(data.properties || [])
        } else {
          console.error('Failed to fetch properties:', data.error)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoadingProperties(false)
      }
    }

    fetchProperties()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        risk_rating: parseInt(formData.risk_rating),
        test_results: Object.keys(formData.test_results).length > 0 ? formData.test_results : undefined,
        remedial_work_description: formData.remedial_work_required ? formData.remedial_work_description : undefined,
        remedial_work_priority: formData.remedial_work_required ? formData.remedial_work_priority : undefined
      }

      const response = await fetch('/api/electrical-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create electrical inspection report')
      }

      if (onSuccess) {
        onSuccess(data.report)
      } else {
        router.push('/dashboard/electrical')
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
    } else if (name.startsWith('test_results.')) {
      const testField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        test_results: {
          ...prev.test_results,
          [testField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const inspectionTypeLabels = {
    eicr: 'EICR (Electrical Installation Condition Report)',
    pat_testing: 'PAT Testing (Portable Appliance Testing)',
    fire_alarm_testing: 'Fire Alarm System Testing',
    emergency_lighting_testing: 'Emergency Lighting Testing',
    fire_extinguisher_service: 'Fire Extinguisher Service',
    fixed_wire_testing: 'Fixed Wire Testing',
    rcd_testing: 'RCD Testing'
  }

  const qualificationOptions = [
    'City & Guilds 2391',
    'City & Guilds 2394/2395',
    'ECS Gold Card',
    'JIB Approved Electrician',
    'NAPIT Registered',
    'NICEIC Approved Contractor',
    'Part P Qualified',
    'Other'
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Electrical Inspection Report</h2>
            <p className="text-slate-600">Record electrical safety inspection details</p>
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
              <label htmlFor="property_id" className="block text-sm font-medium text-slate-700 mb-2">
                Property *
              </label>
              <select
                id="property_id"
                name="property_id"
                required
                value={formData.property_id}
                onChange={handleChange}
                disabled={loadingProperties || !!preselectedPropertyId}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              >
                <option value="">Select a property...</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name} - {property.organisation.name}
                  </option>
                ))}
              </select>
              {loadingProperties && (
                <p className="text-sm text-slate-500 mt-1">Loading properties...</p>
              )}
            </div>

            <div>
              <label htmlFor="inspection_type" className="block text-sm font-medium text-slate-700 mb-2">
                Inspection Type *
              </label>
              <select
                id="inspection_type"
                name="inspection_type"
                required
                value={formData.inspection_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(inspectionTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="certificate_number" className="block text-sm font-medium text-slate-700 mb-2">
                Certificate Number
              </label>
              <input
                type="text"
                id="certificate_number"
                name="certificate_number"
                value={formData.certificate_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., EICR-2024-001"
              />
            </div>

            <div>
              <label htmlFor="risk_rating" className="block text-sm font-medium text-slate-700 mb-2">
                Risk Rating (1-5) *
              </label>
              <select
                id="risk_rating"
                name="risk_rating"
                required
                value={formData.risk_rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 - Very Low Risk</option>
                <option value="2">2 - Low Risk</option>
                <option value="3">3 - Medium Risk</option>
                <option value="4">4 - High Risk</option>
                <option value="5">5 - Very High Risk</option>
              </select>
            </div>
          </div>

          {/* Inspector Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Inspector Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="inspector_name" className="block text-sm font-medium text-slate-700 mb-2">
                  Inspector Name *
                </label>
                <input
                  type="text"
                  id="inspector_name"
                  name="inspector_name"
                  required
                  value={formData.inspector_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <label htmlFor="inspector_qualification" className="block text-sm font-medium text-slate-700 mb-2">
                  Inspector Qualification
                </label>
                <select
                  id="inspector_qualification"
                  name="inspector_qualification"
                  value={formData.inspector_qualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select qualification...</option>
                  {qualificationOptions.map((qual) => (
                    <option key={qual} value={qual}>
                      {qual}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inspection Dates */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Inspection Dates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="inspection_date" className="block text-sm font-medium text-slate-700 mb-2">
                  Inspection Date *
                </label>
                <input
                  type="date"
                  id="inspection_date"
                  name="inspection_date"
                  required
                  value={formData.inspection_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="next_inspection_due" className="block text-sm font-medium text-slate-700 mb-2">
                  Next Inspection Due
                </label>
                <input
                  type="date"
                  id="next_inspection_due"
                  name="next_inspection_due"
                  value={formData.next_inspection_due}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Inspection Results */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Inspection Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="overall_condition" className="block text-sm font-medium text-slate-700 mb-2">
                  Overall Condition *
                </label>
                <select
                  id="overall_condition"
                  name="overall_condition"
                  required
                  value={formData.overall_condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="satisfactory">Satisfactory</option>
                  <option value="unsatisfactory">Unsatisfactory</option>
                  <option value="requires_improvement">Requires Improvement</option>
                </select>
              </div>

              <div>
                <label htmlFor="compliance_status" className="block text-sm font-medium text-slate-700 mb-2">
                  Compliance Status *
                </label>
                <select
                  id="compliance_status"
                  name="compliance_status"
                  required
                  value={formData.compliance_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="compliant">Compliant</option>
                  <option value="partially_compliant">Partially Compliant</option>
                  <option value="non_compliant">Non-Compliant</option>
                </select>
              </div>
            </div>

            {/* Test Results */}
            <div className="mt-4">
              <h4 className="text-md font-medium text-slate-900 mb-3">Test Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="test_results.earth_fault_loop_impedance" className="block text-sm font-medium text-slate-700 mb-2">
                    Earth Fault Loop Impedance (Ω)
                  </label>
                  <input
                    type="text"
                    id="test_results.earth_fault_loop_impedance"
                    name="test_results.earth_fault_loop_impedance"
                    value={formData.test_results.earth_fault_loop_impedance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 0.35"
                  />
                </div>

                <div>
                  <label htmlFor="test_results.insulation_resistance" className="block text-sm font-medium text-slate-700 mb-2">
                    Insulation Resistance (MΩ)
                  </label>
                  <input
                    type="text"
                    id="test_results.insulation_resistance"
                    name="test_results.insulation_resistance"
                    value={formData.test_results.insulation_resistance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., >999"
                  />
                </div>

                <div>
                  <label htmlFor="test_results.polarity_test" className="block text-sm font-medium text-slate-700 mb-2">
                    Polarity Test
                  </label>
                  <select
                    id="test_results.polarity_test"
                    name="test_results.polarity_test"
                    value={formData.test_results.polarity_test}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select result...</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="test_results.rcd_test" className="block text-sm font-medium text-slate-700 mb-2">
                    RCD Test (ms)
                  </label>
                  <input
                    type="text"
                    id="test_results.rcd_test"
                    name="test_results.rcd_test"
                    value={formData.test_results.rcd_test}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 28"
                  />
                </div>

                <div>
                  <label htmlFor="test_results.continuity_test" className="block text-sm font-medium text-slate-700 mb-2">
                    Continuity Test
                  </label>
                  <select
                    id="test_results.continuity_test"
                    name="test_results.continuity_test"
                    value={formData.test_results.continuity_test}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select result...</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Remedial Work */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Remedial Work</h3>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="remedial_work_required"
                name="remedial_work_required"
                checked={formData.remedial_work_required}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remedial_work_required" className="ml-2 text-sm text-slate-700">
                Remedial work required
              </label>
            </div>

            {formData.remedial_work_required && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="remedial_work_priority" className="block text-sm font-medium text-slate-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    id="remedial_work_priority"
                    name="remedial_work_priority"
                    value={formData.remedial_work_priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="urgent">Urgent (C1 - Danger present)</option>
                    <option value="requires_attention">Requires Attention (C2 - Potentially dangerous)</option>
                    <option value="improvement_recommended">Improvement Recommended (C3 - Non-compliance)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="remedial_work_description" className="block text-sm font-medium text-slate-700 mb-2">
                    Description of Required Work
                  </label>
                  <textarea
                    id="remedial_work_description"
                    name="remedial_work_description"
                    rows={4}
                    value={formData.remedial_work_description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the remedial work required..."
                  />
                </div>
              </div>
            )}
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
              disabled={loading || loadingProperties}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Inspection Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 