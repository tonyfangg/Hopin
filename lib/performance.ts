// Performance monitoring and optimization utilities

/**
 * Simple performance timer for measuring function execution time
 */
export class PerformanceTimer {
  private startTime: number = 0
  private endTime: number = 0

  start(): void {
    this.startTime = performance.now()
  }

  end(): number {
    this.endTime = performance.now()
    return this.endTime - this.startTime
  }

  measure(label: string): number {
    const duration = this.end()
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    }
    return duration
  }
}

/**
 * Debounce function to limit API calls
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

/**
 * Throttle function to limit function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Cache implementation for API responses
 */
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>()

  set(key: string, data: T, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

export const apiCache = new SimpleCache()

/**
 * Memoization decorator for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Lazy loading wrapper for components
 */
export function withLazyLoading<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn)
  
  return (props: any) => 
    React.createElement(
      React.Suspense,
      { 
        fallback: fallback 
          ? React.createElement(fallback) 
          : React.createElement('div', null, 'Loading...')
      },
      React.createElement(LazyComponent, props)
    )
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const timer = new PerformanceTimer()
    timer.start()
    
    return () => {
      timer.measure(`${componentName} render`)
    }
  })
}

/**
 * Optimized fetch with caching
 */
export async function cachedFetch<T>(
  url: string,
  options?: RequestInit,
  ttl: number = 300000
): Promise<T> {
  const cacheKey = `${url}:${JSON.stringify(options)}`
  
  // Check cache first
  const cached = apiCache.get(cacheKey)
  if (cached) {
    return cached as T
  }
  
  // Fetch and cache
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  apiCache.set(cacheKey, data, ttl)
  
  return data
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }
}

/**
 * Bundle size analyzer (development only)
 */
export function analyzeBundleSize(): void {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Analyze loaded scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    let totalSize = 0
    
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src
      if (src.includes('_next')) {
        console.log(`📦 Script: ${src}`)
      }
    })
    
    console.log(`📊 Total scripts: ${scripts.length}`)
  }
}

// React import for Suspense
import React from 'react'