import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware executing for:', request.nextUrl.pathname)
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set(name, value)
          response = NextResponse.next({
            request,
          })
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          request.cookies.set(name, '')
          response = NextResponse.next({
            request,
          })
          response.cookies.set(name, '', options)
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  console.log('👤 Middleware user check:', { hasUser: !!user, path: request.nextUrl.pathname })

  // Only redirect if trying to access protected routes without auth
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    console.log('🚫 Middleware redirecting to login')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  console.log('✅ Middleware allowing request through')
  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
} 