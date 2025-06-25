# API Testing Guide

## 🔍 **Issue Analysis**

The API endpoints are returning **401 Unauthorized** errors because:

1. **Authentication Method**: The API routes use Supabase's **server-side authentication** which requires user sessions (cookies)
2. **Bearer Token Only**: We're only sending the Bearer token, but Supabase server-side auth needs a proper user session
3. **Session Required**: The API checks for `session.user.id` which requires a logged-in user

## ✅ **What's Working**

- ✅ **Basic API**: `/api/test` works without authentication
- ✅ **Server Running**: Next.js development server is running correctly
- ✅ **Environment**: Supabase configuration is properly set up
- ✅ **API Structure**: All API routes are correctly implemented

## 🚀 **Solutions for Testing**

### **Option 1: Create a Test User Account**

1. **Sign up for a user account** in your Supabase project
2. **Sign in** through the web interface
3. **Use the session cookies** for API testing

### **Option 2: Create API Routes for Testing (Recommended)**

Create test endpoints that bypass authentication for development:

```typescript
// app/api/test-organisations/route.ts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // For testing, use service role key to bypass auth
    const { data: organisations, error } = await supabase
      .from('organisations')
      .select('*')
      .eq('is_active', true)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ organisations })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### **Option 3: Use Service Role Key for Testing**

Create a test environment that uses the service role key:

```typescript
// app/api/test-with-service-role/route.ts
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
    )
    
    const { data: organisations, error } = await supabase
      .from('organisations')
      .select('*')
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ organisations })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## 🧪 **Current Test Results**

### **✅ Working Endpoints**
```bash
# Basic API test (no auth required)
curl -X GET http://localhost:3000/api/test
# Response: {"message":"API is working correctly","timestamp":"...","status":"success"}
```

### **❌ Failing Endpoints (401 Unauthorized)**
```bash
# All authenticated endpoints
curl -X GET http://localhost:3000/api/organisations \
  -H "Authorization: Bearer YOUR_TOKEN"
# Response: {"error":"Unauthorised"}
```

## 🔧 **Quick Fix for Development Testing**

### **Step 1: Create Test Endpoints**
Create these files for development testing:

1. `app/api/test-organisations/route.ts`
2. `app/api/test-properties/route.ts`
3. `app/api/test-reports/route.ts`

### **Step 2: Use Service Role Key**
These endpoints will use the service role key to bypass authentication:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### **Step 3: Test with Real Data**
```bash
curl -X GET http://localhost:3000/api/test-organisations
curl -X GET http://localhost:3000/api/test-properties
```

## 🎯 **Production vs Development**

### **Development (Testing)**
- Use service role key for API testing
- Bypass authentication for easier development
- Create test endpoints with `test-` prefix

### **Production**
- Use proper user authentication
- Require valid user sessions
- Implement proper authorization checks

## 📋 **Next Steps**

1. **Create test endpoints** using service role key
2. **Test with real data** from your Supabase database
3. **Verify API functionality** before implementing authentication
4. **Implement proper auth** for production use

## 🔐 **Authentication Flow for Production**

1. **User signs up/signs in** through web interface
2. **Supabase creates session** with cookies
3. **API routes check session** using `supabase.auth.getSession()`
4. **User permissions verified** against `user_permissions` table
5. **Data returned** based on user's organisation access

## 🛠️ **Tools Created**

- ✅ `test-api-endpoints.sh` - Automated test script
- ✅ `api-test-commands.md` - Manual test commands
- ✅ `/api/test` - Basic API test endpoint
- ✅ `/api/test-auth` - Authentication debug endpoint
- ✅ `supabase-storage-setup.sql` - Storage configuration

## 📞 **Support**

If you need help with:
- Setting up user authentication
- Creating test endpoints
- Configuring Supabase
- Debugging API issues

The API structure is correct - we just need to handle authentication properly for testing! 🎯 