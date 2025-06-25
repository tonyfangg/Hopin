// =====================================================
// BRITISH ENGLISH TYPESCRIPT TYPES
// File: app/lib/types.ts
// =====================================================

// =====================================================
// CORE ENTITY TYPES
// =====================================================

export interface Organisation {
  id: string
  name: string
  address: string
  postcode: string
  contact_person: string
  contact_email: string
  contact_phone: string
  registration_number?: string
  vat_number?: string
  industry_sector?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  organisation_id: string
  name: string
  address: string
  postcode: string
  property_type: 'residential' | 'commercial' | 'industrial' | 'mixed_use'
  number_of_floors: number
  year_built?: number
  square_footage?: number
  construction_type?: string
  occupancy_type?: string
  is_active: boolean
  created_at: string
  updated_at: string
  organisation?: Organisation
}

export interface UserPermission {
  id: string
  user_id: string
  organisation_id: string
  access_level: 'viewer' | 'editor' | 'admin' | 'owner'
  can_upload_documents: boolean
  can_manage_properties: boolean
  can_manage_reports: boolean
  can_manage_risk_assessments: boolean
  can_manage_users: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  organisation?: Organisation
}

// =====================================================
// REPORT TYPES
// =====================================================

export interface ElectricalReport {
  id: string
  property_id: string
  inspection_type: 'periodic' | 'installation' | 'emergency' | 'compliance'
  report_date: string
  inspector_name: string
  inspector_qualification: string
  certificate_number: string
  next_inspection_due: string
  status: 'pass' | 'fail' | 'requires_attention' | 'pending'
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe'
  findings: string
  recommendations: string
  action_required: boolean
  action_deadline?: string
  attachments: string[]
  notes?: string
  created_at: string
  updated_at: string
  property?: Property
}

export interface DrainageReport {
  id: string
  property_id: string
  inspection_type: 'cctv' | 'manual' | 'emergency' | 'compliance'
  report_date: string
  inspector_name: string
  inspector_qualification: string
  certificate_number: string
  next_inspection_due: string
  status: 'pass' | 'fail' | 'requires_attention' | 'pending'
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'blocked'
  findings: string
  recommendations: string
  action_required: boolean
  action_deadline?: string
  attachments: string[]
  notes?: string
  created_at: string
  updated_at: string
  property?: Property
}

// =====================================================
// DOCUMENT TYPES
// =====================================================

export interface Document {
  id: string
  property_id?: string
  organisation_id: string
  category: 'certificates' | 'reports' | 'compliance' | 'insurance' | 'contracts' | 'general'
  document_type: string
  title: string
  description?: string
  file_name: string
  file_path: string
  file_size_bytes: number
  mime_type: string
  is_confidential: boolean
  expiry_date?: string
  uploaded_by: string
  reviewed_by?: string
  review_date?: string
  version_number: number
  tags?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  property?: Property
  organisation?: Organisation
  uploaded_by_user?: {
    email: string
  }
  reviewed_by_user?: {
    email: string
  }
}

// =====================================================
// RISK ASSESSMENT TYPES
// =====================================================

export interface RiskAssessment {
  id: string
  property_id: string
  assessment_type: 'fire_safety' | 'health_safety' | 'environmental' | 'security' | 'structural' | 'general'
  assessor_name: string
  assessor_qualification: string
  assessment_date: string
  review_date?: string
  overall_risk_level: 'low' | 'medium' | 'high' | 'critical'
  risk_factors: string[]
  control_measures: string[]
  recommendations: string
  action_plan?: string
  insurance_implications?: string
  compliance_status: 'compliant' | 'non_compliant' | 'requires_action' | 'pending_review'
  created_at: string
  updated_at: string
  property?: Property
}

// =====================================================
// DASHBOARD TYPES
// =====================================================

export interface DashboardStats {
  organisations: number
  properties: number
  electrical_reports: number
  drainage_reports: number
  risk_assessments: number
  documents: number
  expiring_documents: number
  overdue_inspections: number
}

export interface DashboardChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }[]
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// =====================================================
// FORM TYPES
// =====================================================

export interface CreateOrganisationForm {
  name: string
  address: string
  postcode: string
  contact_person: string
  contact_email: string
  contact_phone: string
  registration_number?: string
  vat_number?: string
  industry_sector?: string
}

export interface CreatePropertyForm {
  organisation_id: string
  name: string
  address: string
  postcode: string
  property_type: 'residential' | 'commercial' | 'industrial' | 'mixed_use'
  number_of_floors: number
  year_built?: number
  square_footage?: number
  construction_type?: string
  occupancy_type?: string
}

export interface CreateElectricalReportForm {
  property_id: string
  inspection_type: 'periodic' | 'installation' | 'emergency' | 'compliance'
  report_date: string
  inspector_name: string
  inspector_qualification: string
  certificate_number: string
  next_inspection_due: string
  status: 'pass' | 'fail' | 'requires_attention' | 'pending'
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe'
  findings: string
  recommendations: string
  action_required: boolean
  action_deadline?: string
  attachments?: string[]
  notes?: string
}

export interface CreateDrainageReportForm {
  property_id: string
  inspection_type: 'cctv' | 'manual' | 'emergency' | 'compliance'
  report_date: string
  inspector_name: string
  inspector_qualification: string
  certificate_number: string
  next_inspection_due: string
  status: 'pass' | 'fail' | 'requires_attention' | 'pending'
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'blocked'
  findings: string
  recommendations: string
  action_required: boolean
  action_deadline?: string
  attachments?: string[]
  notes?: string
}

export interface CreateDocumentForm {
  property_id?: string
  organisation_id: string
  category: 'certificates' | 'reports' | 'compliance' | 'insurance' | 'contracts' | 'general'
  document_type: string
  title: string
  description?: string
  file_name: string
  file_path: string
  file_size_bytes: number
  mime_type: string
  is_confidential?: boolean
  expiry_date?: string
  tags?: string[]
}

export interface CreateRiskAssessmentForm {
  property_id: string
  assessment_type: 'fire_safety' | 'health_safety' | 'environmental' | 'security' | 'structural' | 'general'
  assessor_name: string
  assessor_qualification: string
  assessment_date: string
  review_date?: string
  overall_risk_level: 'low' | 'medium' | 'high' | 'critical'
  risk_factors: string[]
  control_measures: string[]
  recommendations: string
  action_plan?: string
  insurance_implications?: string
  compliance_status: 'compliant' | 'non_compliant' | 'requires_action' | 'pending_review'
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface FileUploadResponse {
  file_path: string
  file_name: string
  file_size_bytes: number
  mime_type: string
  public_url: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface FilterParams {
  organisation_id?: string
  property_id?: string
  category?: string
  status?: string
  date_from?: string
  date_to?: string
  search?: string
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}

// =====================================================
// ENUM TYPES
// =====================================================

export const PROPERTY_TYPES = [
  'residential',
  'commercial', 
  'industrial',
  'mixed_use'
] as const

export const INSPECTION_TYPES = [
  'periodic',
  'installation',
  'emergency',
  'compliance'
] as const

export const DRAINAGE_INSPECTION_TYPES = [
  'cctv',
  'manual',
  'emergency',
  'compliance'
] as const

export const REPORT_STATUSES = [
  'pass',
  'fail',
  'requires_attention',
  'pending'
] as const

export const CONDITION_LEVELS = [
  'excellent',
  'good',
  'fair',
  'poor',
  'unsafe'
] as const

export const DRAINAGE_CONDITIONS = [
  'excellent',
  'good',
  'fair',
  'poor',
  'blocked'
] as const

export const RISK_LEVELS = [
  'low',
  'medium',
  'high',
  'critical'
] as const

export const ASSESSMENT_TYPES = [
  'fire_safety',
  'health_safety',
  'environmental',
  'security',
  'structural',
  'general'
] as const

export const COMPLIANCE_STATUSES = [
  'compliant',
  'non_compliant',
  'requires_action',
  'pending_review'
] as const

export const DOCUMENT_CATEGORIES = [
  'certificates',
  'reports',
  'compliance',
  'insurance',
  'contracts',
  'general'
] as const

export const ACCESS_LEVELS = [
  'viewer',
  'editor',
  'admin',
  'owner'
] as const 