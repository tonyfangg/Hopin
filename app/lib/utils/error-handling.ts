export interface ApiError {
  message: string
  status?: number
  code?: string
}

export class ApiException extends Error {
  status: number
  code?: string

  constructor(message: string, status: number = 500, code?: string) {
    super(message)
    this.name = 'ApiException'
    this.status = status
    this.code = code
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiException) {
    return {
      message: error.message,
      status: error.status,
      code: error.code
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    }
  }

  return {
    message: 'An unknown error occurred',
    status: 500
  }
}

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('NetworkError')
  }
  return false
} 