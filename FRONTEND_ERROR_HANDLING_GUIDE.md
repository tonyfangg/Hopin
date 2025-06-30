# Frontend Error Handling Guide

This guide demonstrates how to implement proper error handling in React components using the new `ErrorState` and `RetryButton` components.

## Components Overview

### ErrorState Component
A reusable component that provides consistent error UI across the application.

### RetryButton Component
A button component with loading states and retry functionality.

## Basic Usage

### Simple Error State
```tsx
import { ErrorState } from '@/components/ui/error-state'

function MyComponent() {
  const { data, loading, error, refetch } = useApi('/api/my-endpoint')

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to load data"
        description="There was a problem loading the requested information."
        onRetry={refetch}
      />
    )
  }

  // ... rest of component
}
```

### Custom Error State
```tsx
if (error) {
  return (
    <ErrorState
      error={error}
      title="Custom Error Title"
      description="Custom error description for this specific use case."
      onRetry={refetch}
      variant="danger"
      className="my-custom-class"
    />
  )
}
```

## Convenience Components

### ApiErrorState
For general API errors:
```tsx
import { ApiErrorState } from '@/components/ui/error-state'

if (error) {
  return (
    <ApiErrorState
      error={error}
      onRetry={refetch}
    />
  )
}
```

### NetworkErrorState
For network/connection errors:
```tsx
import { NetworkErrorState } from '@/components/ui/error-state'

if (error) {
  return (
    <NetworkErrorState
      error={error}
      onRetry={refetch}
    />
  )
}
```

## Error Handling Patterns

### 1. API Hook Pattern
```tsx
'use client'
import { useApi } from '@/app/lib/hooks/use-api'
import { ErrorState } from '@/components/ui/error-state'

export function MyComponent() {
  const { data, loading, error, refetch } = useApi('/api/my-endpoint')

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to load data"
        description="Unable to load the requested information. Please try again."
        onRetry={refetch}
      />
    )
  }

  return (
    <div>
      {/* Your component content */}
    </div>
  )
}
```

### 2. Manual Fetch Pattern
```tsx
'use client'
import { useState, useEffect } from 'react'
import { ErrorState } from '@/components/ui/error-state'

export function MyComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/my-endpoint')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data')
      }
      
      setData(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Failed to load data"
        description="Unable to load the requested information. Please try again."
        onRetry={fetchData}
      />
    )
  }

  return (
    <div>
      {/* Your component content */}
    </div>
  )
}
```

### 3. Form Error Handling
```tsx
'use client'
import { useState } from 'react'
import { ErrorState } from '@/components/ui/error-state'

export function MyForm() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }
      
      // Handle success
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <ErrorState
          error={error}
          title="Form submission failed"
          description="There was a problem submitting your form. Please try again."
          onRetry={() => setError(null)}
          variant="danger"
        />
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </div>
  )
}
```

## Error Variants

### Default (Red)
```tsx
<ErrorState
  error={error}
  variant="default"
  onRetry={refetch}
/>
```

### Danger (Darker Red)
```tsx
<ErrorState
  error={error}
  variant="danger"
  onRetry={refetch}
/>
```

### Warning (Amber)
```tsx
<ErrorState
  error={error}
  variant="warning"
  onRetry={refetch}
/>
```

## RetryButton Customization

### Different Sizes
```tsx
<RetryButton onRetry={refetch} size="sm" />
<RetryButton onRetry={refetch} size="md" />
<RetryButton onRetry={refetch} size="lg" />
```

### Different Variants
```tsx
<RetryButton onRetry={refetch} variant="primary" />
<RetryButton onRetry={refetch} variant="secondary" />
<RetryButton onRetry={refetch} variant="danger" />
```

### Custom Content
```tsx
<RetryButton onRetry={refetch}>
  Try Again
</RetryButton>
```

## Best Practices

### 1. Always Provide Retry Functionality
```tsx
// Good
<ErrorState error={error} onRetry={refetch} />

// Avoid
<ErrorState error={error} />
```

### 2. Use Descriptive Titles and Descriptions
```tsx
// Good
<ErrorState
  error={error}
  title="Failed to load user profile"
  description="Unable to load your profile information. Please try again."
  onRetry={refetch}
/>

// Avoid
<ErrorState error={error} title="Error" onRetry={refetch} />
```

### 3. Handle Different Error Types
```tsx
if (isNetworkError(error)) {
  return <NetworkErrorState error={error} onRetry={refetch} />
}

return <ApiErrorState error={error} onRetry={refetch} />
```

### 4. Provide Context-Specific Error Messages
```tsx
const getErrorTitle = (error) => {
  if (error.status === 404) return 'Resource not found'
  if (error.status === 403) return 'Access denied'
  if (error.status === 500) return 'Server error'
  return 'Something went wrong'
}

<ErrorState
  error={error}
  title={getErrorTitle(error)}
  onRetry={refetch}
/>
```

## Migration Guide

### Before (Old Pattern)
```tsx
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <p className="text-red-700">Error: {error.message}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  )
}
```

### After (New Pattern)
```tsx
if (error) {
  return (
    <ErrorState
      error={error}
      title="Failed to load data"
      description="Unable to load the requested information. Please try again."
      onRetry={refetch}
    />
  )
}
```

## TypeScript Support

The components are fully typed and support:
- `Error` objects
- `ApiError` objects (with message, status, code)
- String error messages
- Null/undefined values

```tsx
interface ApiError {
  message: string
  status?: number
  code?: string
}

// All of these work:
<ErrorState error={new Error('Something went wrong')} />
<ErrorState error={{ message: 'API Error', status: 500 }} />
<ErrorState error="Simple error message" />
<ErrorState error={null} />
``` 