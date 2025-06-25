// =====================================================
// UTILITY FUNCTIONS - BRITISH ENGLISH
// File: app/lib/utils.ts
// =====================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// =====================================================
// STYLING UTILITIES
// =====================================================

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =====================================================
// DATE UTILITIES
// =====================================================

/**
 * Format date to British format (DD/MM/YYYY)
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Format date and time to British format (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Check if a date is in the past
 */
export function isDatePast(date: string | Date): boolean {
  return new Date(date) < new Date()
}

/**
 * Check if a date is within the next X days
 */
export function isDateWithinDays(date: string | Date, days: number): boolean {
  const targetDate = new Date(date)
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)
  return targetDate <= futureDate && targetDate >= new Date()
}

// =====================================================
// FILE UTILITIES
// =====================================================

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Check if file type is allowed
 */
export function isAllowedFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = getFileExtension(filename)
  return allowedTypes.includes(extension)
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const extension = getFileExtension(originalName)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `${timestamp}-${random}.${extension}`
}

// =====================================================
// STRING UTILITIES
// =====================================================

/**
 * Capitalise first letter of each word
 */
export function capitaliseWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitleCase(str: string): string {
  return str.split('_').map(capitaliseWords).join(' ')
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// =====================================================
// VALIDATION UTILITIES
// =====================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate UK postcode format
 */
export function isValidPostcode(postcode: string): boolean {
  const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i
  return postcodeRegex.test(postcode)
}

/**
 * Validate UK phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// =====================================================
// COLOUR UTILITIES
// =====================================================

/**
 * Get status colour based on status value
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pass':
    case 'compliant':
    case 'active':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'fail':
    case 'non_compliant':
    case 'blocked':
    case 'unsafe':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'requires_attention':
    case 'requires_action':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'pending':
    case 'pending_review':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

/**
 * Get risk level colour
 */
export function getRiskLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// =====================================================
// ARRAY UTILITIES
// =====================================================

/**
 * Remove duplicates from array
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Sort array by multiple keys
 */
export function sortBy<T>(array: T[], ...keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
    }
    return 0
  })
}

// =====================================================
// ERROR HANDLING
// =====================================================

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: string): void {
  console.error(`[${context || 'App'}] Error:`, error)
}

// =====================================================
// DEBOUNCE UTILITY
// =====================================================

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// =====================================================
// LOCAL STORAGE UTILITIES
// =====================================================

/**
 * Safe localStorage get
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Safe localStorage set
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Safe localStorage remove
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore localStorage errors
  }
} 