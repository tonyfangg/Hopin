# Step-by-step Vercel deployment fix

## 1. Set Environment Variables in Vercel Dashboard

### Go to your Vercel project dashboard:
1. Navigate to: https://vercel.com/your-username/hopin
2. Go to Settings → Environment Variables
3. Add these variables for ALL environments (Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL = https://bkpidadvdeellvqxqufp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGlkYWR2ZGVlbGx2cXhxdWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzczNDksImV4cCI6MjA2MjIxMzM0OX0.oLynlxCyaQVKNLEKCw9C_ljsLmE3U5LO-jfIIqkqWOw
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGlkYWR2ZGVlbGx2cXhxdWZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjYzNzM0OSwiZXhwIjoyMDYyMjEzMzQ5fQ.lNzFOPmTu4Ssrkej-JiiJZRCMZqvmgdrz26nsMlPgUw
```

## 2. Alternative: Set via Vercel CLI

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter: https://bkpidadvdeellvqxqufp.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGlkYWR2ZGVlbGx2cXhxdWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MzczNDksImV4cCI6MjA2MjIxMzM0OX0.oLynlxCyaQVKNLEKCw9C_ljsLmE3U5LO-jfIIqkqWOw

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGlkYWR2ZGVlbGx2cXhxdWZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjYzNzM0OSwiZXhwIjoyMDYyMjEzMzQ5fQ.lNzFOPmTu4Ssrkej-JiiJZRCMZqvmgdrz26nsMlPgUw

# Do the same for preview and development environments
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview

vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add SUPABASE_SERVICE_ROLE_KEY development
```

## 3. Update your package.json scripts (if needed)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## 4. Create next.config.js (if you don't have one)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove any experimental features that might cause build issues
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

module.exports = nextConfig
```

## 5. Fix all components that import createClient

### Update these files:

1. **app/components/dashboard/header.tsx**
2. **app/test/page.tsx** 
3. **components/auth/login-form.tsx**
4. **components/auth/signup-form.tsx**
5. **components/dashboard/electrical/maintenance.tsx**

### Replace the import:
```typescript
// OLD (causing build errors):
import { createClient } from '@/app/lib/supabase-client'

// NEW (working):
import { createClient } from '@/app/lib/supabase-client'

// Or better yet, use fetch for frontend components:
// Remove Supabase client usage and use fetch('/api/...') instead
```

## 6. Test the build locally

```bash
# Build locally to test
npm run build

# If successful, deploy
vercel --prod
```

## 7. Emergency fallback: Remove problematic imports

If you're still having issues, temporarily comment out or remove the createClient imports from these files:
- app/components/dashboard/header.tsx
- app/test/page.tsx
- components/auth/login-form.tsx
- components/auth/signup-form.tsx

Replace Supabase client usage with fetch calls to your API endpoints.

## 8. Monitor the deployment

```bash
# Watch deployment logs
vercel logs your-deployment-url

# Or check in Vercel dashboard
```

## Quick Fix Summary:

1. ✅ **Set environment variables in Vercel dashboard**
2. ✅ **Replace problematic Supabase client imports** 
3. ✅ **Use dynamic imports in API routes**
4. ✅ **Add build-time safety checks**
5. ✅ **Test locally before deploying**

The main issue was that Vercel couldn't find the Supabase keys during build time, and some components were importing the client incorrectly. 