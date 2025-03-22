import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Configure which paths should be protected
const protectedPaths = [
  '/',
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  '/hotel-setup',
  '/hotels/settings'
]

// Paths that should be accessible to logged in users (redirect to dashboard if logged in)
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token (if it exists)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if the path is a protected route
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // Check if the path is an auth route (login, signup)
  const isAuthPath = authRoutes.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  // If the path is protected and the user is not logged in,
  // redirect to the login page
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url)
    // Add the current path as a "callbackUrl" param to redirect after login
    url.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // If the user is logged in and trying to access auth pages,
  // redirect to the dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}