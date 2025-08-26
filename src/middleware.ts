import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Redirect authenticated users to appropriate service pages
    if (token && (pathname === "/auth/login" || pathname === "/auth/register" || pathname === "/")) {
      const userType = token.userType
      
      if (userType === "client") {
        return NextResponse.redirect(new URL("/trouver-services", req.url))
      } else if (userType === "freelancer") {
        return NextResponse.redirect(new URL("/vendre-services", req.url))
      }
    }

    // Protect service pages - redirect to appropriate page based on user type
    if (token) {
      const userType = token.userType
      
      if (pathname === "/trouver-services" && userType === "freelancer") {
        return NextResponse.redirect(new URL("/vendre-services", req.url))
      }
      
      if (pathname === "/vendre-services" && userType === "client") {
        return NextResponse.redirect(new URL("/trouver-services", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to auth pages for non-authenticated users
        if (pathname.startsWith("/auth/")) {
          return true
        }
        
        // Allow access to home page
        if (pathname === "/") {
          return true
        }
        
        // Require authentication for service pages
        if (pathname.startsWith("/trouver-services") || pathname.startsWith("/vendre-services")) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/trouver-services/:path*",
    "/vendre-services/:path*"
  ]
}
