'use client'

import { RetryButton } from './retry-button'

interface ApiError {
  message: string
  status?: number
  code?: string
}

interface ErrorStateProps {
  error: Error | ApiError | string | null
  title?: string
  description?: string
  onRetry?: () => void | Promise<void>
  variant?: 'default' | 'danger' | 'warning'
  className?: string
  showRetryButton?: boolean
  children?: React.ReactNode
}

export function ErrorState({
  error,
  title = 'Something went wrong',
  description,
  onRetry,
  variant = 'default',
  className = '',
  showRetryButton = true,
  children
}: ErrorStateProps) {
  if (!error) return null

  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred'

  const variantClasses = {
    default: 'bg-red-50 border-red-200 text-red-700',
    danger: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-700'
  }

  const iconClasses = {
    default: 'text-red-600',
    danger: 'text-red-700',
    warning: 'text-amber-600'
  }

  return (
    <div className={`border rounded-xl p-6 ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${iconClasses[variant]}`}>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{title}</h3>
          
          {description && (
            <p className="text-sm opacity-90 mb-3">{description}</p>
          )}
          
          <p className="text-sm font-medium">{errorMessage}</p>
          
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
          
          {showRetryButton && onRetry && (
            <div className="mt-4">
              <RetryButton 
                onRetry={onRetry}
                variant={variant === 'warning' ? 'secondary' : 'danger'}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Convenience component for common error patterns
export function ApiErrorState({
  error,
  onRetry,
  ...props
}: Omit<ErrorStateProps, 'title' | 'description'>) {
  return (
    <ErrorState
      error={error}
      title="Failed to load data"
      description="There was a problem loading the requested information. Please try again."
      onRetry={onRetry}
      {...props}
    />
  )
}

export function NetworkErrorState({
  error,
  onRetry,
  ...props
}: Omit<ErrorStateProps, 'title' | 'description'>) {
  return (
    <ErrorState
      error={error}
      title="Connection error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      variant="warning"
      {...props}
    />
  )
} 