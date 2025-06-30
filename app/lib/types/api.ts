export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: string
  pagination?: {
    total: number
    limit: number
    offset: number
    has_more: boolean
  }
  stats?: Record<string, any>
}

export interface ElectricalReport {
  id: string
  issue_type: string
  person_injury?: string
  appliance_damage?: string
  address?: string
  date_needed?: string
  photo_url?: string
  created_at: string
  inspection_type?: string
  certificate_number?: string
  inspector_name?: string
  inspector_qualification?: string
  inspection_date?: string
  next_inspection_due?: string
  overall_condition?: string
  remedial_work_required?: boolean
  remedial_work_description?: string
  remedial_work_priority?: string
  test_results?: any
  risk_rating?: number
  compliance_status?: string
  updated_at: string
  property_id?: string
  safety_score?: number
  cost?: number
}

export interface Property {
  id: string
  user_id: string
  name: string
  address?: string
  risk_score?: number
  safety_score?: number
  created_at: string
  updated_at: string
  organization_id?: string
  organisation_id?: string
  manager_id?: string
  property_manager_id?: string
  property_type?: string
  floor_area_sqm?: number
  number_of_floors?: number
  building_age_years?: number
  lease_type?: string
  lease_expiry_date?: string
  council_tax_band?: string
  business_rates_reference?: string
  is_listed_building?: boolean
  conservation_area?: boolean
  is_active?: boolean
}

export interface RiskAssessment {
  id: string
  property_id: string
  fire_safety_score?: number
  security_score?: number
  maintenance_score?: number
  staff_training_score?: number
  overall_score?: number
  assessed_date: string
  notes?: string
  created_at: string
  updated_at: string
} 