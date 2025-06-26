// =====================================================
// PERFORMANCE OPTIMIZATION FOR PRODUCTION
// File: app/lib/performance-optimizer.ts
// =====================================================

export class PerformanceOptimizer {
  // Cache frequently accessed data
  private static cache = new Map<string, { data: any; expires: number }>()

  static async getCachedData<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttlMinutes = 5
  ): Promise<T> {
    const cached = this.cache.get(key)
    const now = Date.now()

    if (cached && now < cached.expires) {
      return cached.data
    }

    const data = await fetcher()
    this.cache.set(key, {
      data,
      expires: now + (ttlMinutes * 60 * 1000)
    })

    return data
  }

  // Preload critical data for dashboard
  static async preloadDashboardData(organisationId: string) {
    const criticalQueries = [
      () => fetch(`/api/dashboard/stats?org=${organisationId}`).then(r => r.json()),
      () => fetch(`/api/properties?organisation_id=${organisationId}`).then(r => r.json()),
      () => fetch(`/api/documents?organisation_id=${organisationId}&limit=10`).then(r => r.json())
    ]

    await Promise.all(criticalQueries.map(query => query()))
  }
} 