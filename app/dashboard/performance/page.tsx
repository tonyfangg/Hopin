'use client'

import { useState, useEffect } from 'react'
import { apiCache, analyzeBundleSize } from '@/lib/performance'

export default function PerformancePage() {
  const [cacheStats, setCacheStats] = useState({ size: 0, items: [] as string[] })
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceEntry[]>([])

  useEffect(() => {
    // Get cache statistics
    setCacheStats({
      size: apiCache.size(),
      items: [] // Cache items would be private in real implementation
    })

    // Get performance metrics
    if (typeof window !== 'undefined') {
      const entries = performance.getEntriesByType('navigation')
      setPerformanceMetrics(entries)
      
      // Analyze bundle size in development
      if (process.env.NODE_ENV === 'development') {
        analyzeBundleSize()
      }
    }
  }, [])

  const clearCache = () => {
    apiCache.clear()
    setCacheStats({ size: 0, items: [] })
  }

  const formatTime = (time: number) => `${time.toFixed(2)}ms`

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Performance Dashboard</h1>
          <p className="text-slate-600">Available in development mode only</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Performance Dashboard</h1>
        <p className="text-slate-600">Monitor application performance and optimization metrics</p>
      </div>

      {/* Cache Statistics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">API Cache Statistics</h2>
          <button
            onClick={clearCache}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Cache
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{cacheStats.size}</div>
            <div className="text-sm text-blue-800">Cached Items</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {cacheStats.size > 0 ? 'Active' : 'Empty'}
            </div>
            <div className="text-sm text-green-800">Cache Status</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">5min</div>
            <div className="text-sm text-purple-800">Default TTL</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Page Load Performance</h2>
        
        {performanceMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((entry, index) => {
              const navEntry = entry as PerformanceNavigationTiming
              return (
                <div key={index} className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-slate-900">
                      {formatTime(navEntry.loadEventEnd - navEntry.navigationStart)}
                    </div>
                    <div className="text-sm text-slate-600">Total Load Time</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-slate-900">
                      {formatTime(navEntry.domContentLoadedEventEnd - navEntry.navigationStart)}
                    </div>
                    <div className="text-sm text-slate-600">DOM Ready</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-slate-900">
                      {formatTime(navEntry.responseEnd - navEntry.requestStart)}
                    </div>
                    <div className="text-sm text-slate-600">Network Time</div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-lg font-semibold text-slate-900">
                      {formatTime(navEntry.domInteractive - navEntry.responseEnd)}
                    </div>
                    <div className="text-sm text-slate-600">Processing Time</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Optimization Status</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600">✅</span>
            <div>
              <div className="font-medium text-green-800">Component Memoization</div>
              <div className="text-sm text-green-600">RiskScoreCard and DashboardHeader optimized</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600">✅</span>
            <div>
              <div className="font-medium text-green-800">API Caching</div>
              <div className="text-sm text-green-600">5-minute cache for API responses</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600">✅</span>
            <div>
              <div className="font-medium text-green-800">Code Splitting</div>
              <div className="text-sm text-green-600">Vendor chunks separated for better caching</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600">✅</span>
            <div>
              <div className="font-medium text-green-800">Image Optimization</div>
              <div className="text-sm text-green-600">WebP/AVIF formats with 7-day caching</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600">✅</span>
            <div>
              <div className="font-medium text-green-800">Security Headers</div>
              <div className="text-sm text-green-600">CSP, XSS protection, and frame options configured</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-600">🔄</span>
            <div>
              <div className="font-medium text-blue-800">Service Worker</div>
              <div className="text-sm text-blue-600">Offline caching and background sync ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle Analysis */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Bundle Information</h2>
        
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-sm text-slate-600 mb-2">Check browser console for detailed bundle analysis</div>
          <div className="space-y-2 text-xs font-mono text-slate-500">
            <div>• Vendor chunks: Supabase, Icons, Core React</div>
            <div>• Code splitting: Route-based and component-based</div>
            <div>• Tree shaking: Enabled for production builds</div>
            <div>• Compression: Gzip/Brotli enabled</div>
          </div>
        </div>
      </div>
    </div>
  )
}