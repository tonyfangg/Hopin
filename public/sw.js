// Service Worker for caching and performance optimization

const CACHE_NAME = 'hoops-store-v1'
const STATIC_CACHE_NAME = 'hoops-store-static-v1'

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/auth/login',
  '/manifest.json'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/dashboard/stats',
  '/api/electrical-reports',
  '/api/drainage-reports'
]

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }
  
  // Handle static assets
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(handleStaticAssets(request))
    return
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
    return
  }
  
  // Default: network first
  event.respondWith(fetch(request))
})

// Handle API requests with cache-first strategy for GET requests
async function handleApiRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  
  // For GET requests, try cache first
  if (request.method === 'GET') {
    const shouldCache = API_CACHE_PATTERNS.some(pattern => 
      request.url.includes(pattern)
    )
    
    if (shouldCache) {
      const cachedResponse = await cache.match(request)
      
      if (cachedResponse) {
        // Check if cache is fresh (5 minutes)
        const cacheTime = new Date(cachedResponse.headers.get('date'))
        const now = new Date()
        const fiveMinutes = 5 * 60 * 1000
        
        if (now - cacheTime < fiveMinutes) {
          console.log('Service Worker: Serving from cache:', request.url)
          return cachedResponse
        }
      }
    }
  }
  
  try {
    const response = await fetch(request)
    
    // Cache successful GET responses
    if (request.method === 'GET' && response.ok) {
      const shouldCache = API_CACHE_PATTERNS.some(pattern => 
        request.url.includes(pattern)
      )
      
      if (shouldCache) {
        const responseClone = response.clone()
        cache.put(request, responseClone)
        console.log('Service Worker: Cached API response:', request.url)
      }
    }
    
    return response
  } catch (error) {
    console.error('Service Worker: Network error:', error)
    
    // Return cached response if available
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      console.log('Service Worker: Serving stale cache due to error:', request.url)
      return cachedResponse
    }
    
    throw error
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.error('Service Worker: Failed to fetch static asset:', error)
    throw error
  }
}

// Handle navigation with network-first strategy
async function handleNavigation(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    console.error('Service Worker: Navigation error:', error)
    
    // Try to serve cached page
    const cache = await caches.open(STATIC_CACHE_NAME)
    const cachedResponse = await cache.match('/')
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered')
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle any queued offline actions
  console.log('Service Worker: Performing background sync...')
}

// Push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

console.log('Service Worker: Loaded')