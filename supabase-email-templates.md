# Supabase Email Template Fix

## 🔧 **Current Issue**
Your email template is using `{{ .ConfirmationURL }}` which generates URLs like:
```
https://www.hopin.app/#access_token=...&refresh_token=...&type=recovery
```

This causes fragment-based authentication instead of using your callback route.

## ✅ **Solution: Update Email Templates**

### **Step 1: Go to Supabase Dashboard**
1. Open your Supabase project
2. Go to **Authentication** → **Email Templates**
3. Click on **Confirm signup** template

### **Step 2: Update Confirm Signup Template**
Replace the current template with:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .SiteURL }}/auth/callback?type=signup&token_hash={{ .TokenHash }}&type=email&next=/dashboard">Confirm your email</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .SiteURL }}/auth/callback?type=signup&token_hash={{ .TokenHash }}&type=email&next=/dashboard</p>
```

### **Step 3: Update Reset Password Template**
Go to **Reset password** template and replace with:

```html
<h2>Reset your password</h2>

<p>Follow this link to reset your password:</p>
<p><a href="{{ .SiteURL }}/auth/callback?type=recovery&token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password">Reset your password</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .SiteURL }}/auth/callback?type=recovery&token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password</p>
```

### **Step 4: Update Magic Link Template (if used)**
Go to **Magic Link** template and replace with:

```html
<h2>Magic Link</h2>

<p>Follow this link to sign in:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink&next=/dashboard">Sign in</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink&next=/dashboard</p>
```

## 🔧 **Alternative: Use Custom URL Function**

If you want more control, you can also use:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="https://hopin.app/auth/callback?type=signup&token_hash={{ .TokenHash }}&type=email&next=/dashboard">Confirm your email</a></p>
```

## ✅ **Why This Works**

1. **Uses your callback route** - `/auth/callback` instead of fragment-based auth
2. **Includes proper parameters** - `type=signup`, `token_hash`, etc.
3. **No www. prefix** - Uses your exact domain
4. **Proper redirect flow** - Goes through your callback route

## 🧪 **Test the Fix**

After updating the templates:

1. **Sign up a new user** - Check the confirmation email
2. **Request password reset** - Check the reset email
3. **Verify URLs** - Should be `https://hopin.app/auth/callback?...` not `https://www.hopin.app/#...`

## 📝 **Template Variables Reference**

- `{{ .SiteURL }}` - Your configured site URL (https://hopin.app)
- `{{ .TokenHash }}` - The authentication token
- `{{ .ConfirmationURL }}` - **Avoid this** (causes fragment-based auth)

## 🔍 **Additional Configuration**

Also make sure in **Authentication** → **URL Configuration**:

- **Site URL**: `https://hopin.app`
- **Redirect URLs**: 
  - `https://hopin.app/auth/callback`
  - `https://hopin.app/auth/callback?type=signup`
  - `https://hopin.app/auth/callback?type=recovery` 