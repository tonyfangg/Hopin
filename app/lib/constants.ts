// =====================================================
// APPLICATION CONSTANTS - BRITISH ENGLISH
// File: app/lib/constants.ts
// =====================================================

// =====================================================
// API CONSTANTS
// =====================================================

export const API_ENDPOINTS = {
  ORGANISATIONS: '/api/organisations',
  PROPERTIES: '/api/properties',
  ELECTRICAL_REPORTS: '/api/electrical-reports',
  DRAINAGE_REPORTS: '/api/drainage-reports',
  DOCUMENTS: '/api/documents',
  DOCUMENTS_UPLOAD: '/api/documents/upload',
  RISK_ASSESSMENTS: '/api/risk-assessments',
  DASHBOARD_STATS: '/api/dashboard/stats',
} as const

// =====================================================
// FILE UPLOAD CONSTANTS
// =====================================================

export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed',
    'application/json',
    'application/xml'
  ],
  ALLOWED_EXTENSIONS: [
    'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'txt', 'csv', 'zip', 'json', 'xml'
  ]
} as const

// =====================================================
// PAGINATION CONSTANTS
// =====================================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZES: [10, 25, 50, 100]
} as const

// =====================================================
// DATE CONSTANTS
// =====================================================

export const DATE_FORMATS = {
  BRITISH: 'DD/MM/YYYY',
  BRITISH_WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  ISO_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
} as const

export const DATE_RANGES = {
  EXPIRING_SOON: 30, // days
  OVERDUE: 0, // days (past due)
  UPCOMING: 90 // days
} as const

// =====================================================
// STATUS CONSTANTS
// =====================================================

export const STATUS_OPTIONS = {
  REPORT: [
    { value: 'pass', label: 'Pass' },
    { value: 'fail', label: 'Fail' },
    { value: 'requires_attention', label: 'Requires Attention' },
    { value: 'pending', label: 'Pending' }
  ],
  COMPLIANCE: [
    { value: 'compliant', label: 'Compliant' },
    { value: 'non_compliant', label: 'Non-Compliant' },
    { value: 'requires_action', label: 'Requires Action' },
    { value: 'pending_review', label: 'Pending Review' }
  ],
  RISK_LEVEL: [
    { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' },
    { value: 'high', label: 'High Risk' },
    { value: 'critical', label: 'Critical Risk' }
  ]
} as const

// =====================================================
// PROPERTY CONSTANTS
// =====================================================

export const PROPERTY_OPTIONS = {
  TYPES: [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'mixed_use', label: 'Mixed Use' }
  ],
  CONSTRUCTION_TYPES: [
    { value: 'brick', label: 'Brick' },
    { value: 'concrete', label: 'Concrete' },
    { value: 'steel', label: 'Steel Frame' },
    { value: 'timber', label: 'Timber Frame' },
    { value: 'mixed', label: 'Mixed Construction' }
  ],
  OCCUPANCY_TYPES: [
    { value: 'office', label: 'Office' },
    { value: 'retail', label: 'Retail' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'residential', label: 'Residential' },
    { value: 'mixed', label: 'Mixed Occupancy' }
  ]
} as const

// =====================================================
// INSPECTION CONSTANTS
// =====================================================

export const INSPECTION_OPTIONS = {
  ELECTRICAL_TYPES: [
    { value: 'periodic', label: 'Periodic Inspection' },
    { value: 'installation', label: 'Installation Certificate' },
    { value: 'emergency', label: 'Emergency Inspection' },
    { value: 'compliance', label: 'Compliance Check' }
  ],
  DRAINAGE_TYPES: [
    { value: 'cctv', label: 'CCTV Survey' },
    { value: 'manual', label: 'Manual Inspection' },
    { value: 'emergency', label: 'Emergency Survey' },
    { value: 'compliance', label: 'Compliance Check' }
  ],
  CONDITIONS: [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'unsafe', label: 'Unsafe' }
  ],
  DRAINAGE_CONDITIONS: [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'blocked', label: 'Blocked' }
  ]
} as const

// =====================================================
// DOCUMENT CONSTANTS
// =====================================================

export const DOCUMENT_OPTIONS = {
  CATEGORIES: [
    { value: 'certificates', label: 'Certificates' },
    { value: 'reports', label: 'Reports' },
    { value: 'compliance', label: 'Compliance Documents' },
    { value: 'insurance', label: 'Insurance Documents' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'general', label: 'General Documents' }
  ],
  TYPES: [
    { value: 'electrical_certificate', label: 'Electrical Certificate' },
    { value: 'drainage_report', label: 'Drainage Report' },
    { value: 'fire_safety_certificate', label: 'Fire Safety Certificate' },
    { value: 'insurance_certificate', label: 'Insurance Certificate' },
    { value: 'contract_agreement', label: 'Contract Agreement' },
    { value: 'risk_assessment', label: 'Risk Assessment' },
    { value: 'compliance_report', label: 'Compliance Report' },
    { value: 'other', label: 'Other' }
  ]
} as const

// =====================================================
// RISK ASSESSMENT CONSTANTS
// =====================================================

export const RISK_ASSESSMENT_OPTIONS = {
  TYPES: [
    { value: 'fire_safety', label: 'Fire Safety Assessment' },
    { value: 'health_safety', label: 'Health & Safety Assessment' },
    { value: 'environmental', label: 'Environmental Assessment' },
    { value: 'security', label: 'Security Assessment' },
    { value: 'structural', label: 'Structural Assessment' },
    { value: 'general', label: 'General Risk Assessment' }
  ]
} as const

// =====================================================
// USER PERMISSION CONSTANTS
// =====================================================

export const USER_PERMISSION_OPTIONS = {
  ACCESS_LEVELS: [
    { value: 'viewer', label: 'Viewer' },
    { value: 'editor', label: 'Editor' },
    { value: 'admin', label: 'Administrator' },
    { value: 'owner', label: 'Owner' }
  ]
} as const

// =====================================================
// COLOUR CONSTANTS
// =====================================================

export const COLOURS = {
  SUCCESS: {
    light: 'bg-green-50',
    medium: 'bg-green-100',
    dark: 'bg-green-600',
    text: 'text-green-600',
    border: 'border-green-200'
  },
  WARNING: {
    light: 'bg-yellow-50',
    medium: 'bg-yellow-100',
    dark: 'bg-yellow-600',
    text: 'text-yellow-600',
    border: 'border-yellow-200'
  },
  ERROR: {
    light: 'bg-red-50',
    medium: 'bg-red-100',
    dark: 'bg-red-600',
    text: 'text-red-600',
    border: 'border-red-200'
  },
  INFO: {
    light: 'bg-blue-50',
    medium: 'bg-blue-100',
    dark: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-200'
  },
  NEUTRAL: {
    light: 'bg-gray-50',
    medium: 'bg-gray-100',
    dark: 'bg-gray-600',
    text: 'text-gray-600',
    border: 'border-gray-200'
  }
} as const

// =====================================================
// VALIDATION CONSTANTS
// =====================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  POSTCODE_REGEX: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
  PHONE_REGEX: /^(\+44|0)[1-9]\d{8,9}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  ADDRESS_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000
} as const

// =====================================================
// ERROR MESSAGES
// =====================================================

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_POSTCODE: 'Please enter a valid UK postcode',
  INVALID_PHONE: 'Please enter a valid UK phone number',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  NAME_TOO_SHORT: 'Name must be at least 2 characters long',
  NAME_TOO_LONG: 'Name must be less than 100 characters',
  ADDRESS_TOO_LONG: 'Address must be less than 255 characters',
  DESCRIPTION_TOO_LONG: 'Description must be less than 1000 characters',
  FILE_TOO_LARGE: 'File size must be less than 50MB',
  INVALID_FILE_TYPE: 'File type not allowed',
  UNAUTHORISED: 'You are not authorised to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred'
} as const

// =====================================================
// SUCCESS MESSAGES
// =====================================================

export const SUCCESS_MESSAGES = {
  ORGANISATION_CREATED: 'Organisation created successfully',
  ORGANISATION_UPDATED: 'Organisation updated successfully',
  PROPERTY_CREATED: 'Property created successfully',
  PROPERTY_UPDATED: 'Property updated successfully',
  PROPERTY_DELETED: 'Property deleted successfully',
  REPORT_CREATED: 'Report created successfully',
  REPORT_UPDATED: 'Report updated successfully',
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  DOCUMENT_CREATED: 'Document created successfully',
  RISK_ASSESSMENT_CREATED: 'Risk assessment created successfully',
  RISK_ASSESSMENT_UPDATED: 'Risk assessment updated successfully',
  SETTINGS_SAVED: 'Settings saved successfully'
} as const

// =====================================================
// LOCAL STORAGE KEYS
// =====================================================

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  DASHBOARD_FILTERS: 'dashboard_filters',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  THEME: 'theme',
  LANGUAGE: 'language'
} as const

// =====================================================
// ROUTE PATHS
// =====================================================

export const ROUTES = {
  DASHBOARD: '/dashboard',
  ORGANISATIONS: '/organisations',
  PROPERTIES: '/properties',
  ELECTRICAL_REPORTS: '/electrical-reports',
  DRAINAGE_REPORTS: '/drainage-reports',
  DOCUMENTS: '/documents',
  RISK_ASSESSMENTS: '/risk-assessments',
  SETTINGS: '/settings',
  PROFILE: '/profile'
} as const 