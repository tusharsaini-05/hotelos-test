import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Configure which paths should be protected
const protectedPaths = ["/dashboard", "/profile", "/settings", "/admin", "/hotel-setup", "/hotels/settings", "/booking"]

// Paths that should be accessible to logged in users (redirect to dashboard if logged in)
const authRoutes = ["/login", "/signup", "/forgot-password"]

// Public paths that don't need authentication
const publicPaths = ["/", "/api", "/_next", "/favicon.ico"]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public paths, API routes, and static files
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  try {
    // Get the token (if it exists)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    console.log("Middleware - Path:", pathname)
    console.log("Middleware - Token exists:", !!token)
    console.log("Middleware - User ID:", token?.uid || token?.sub)

    // Check if the path is a protected route
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

    // Check if the path is an auth route (login, signup)
    const isAuthPath = authRoutes.some((path) => pathname.startsWith(path))

    // If the path is protected and the user is not logged in,
    // redirect to the login page
    if (isProtectedPath && !token) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      console.log("Middleware - Redirecting to login:", url.toString())
      return NextResponse.redirect(url)
    }

    // If the user is logged in and trying to access auth pages,
    // redirect to the dashboard
    if (isAuthPath && token) {
      console.log("Middleware - Redirecting authenticated user to dashboard")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Allow the request to continue
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
