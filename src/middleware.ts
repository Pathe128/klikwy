import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Rediriger les utilisateurs connectés de la page de connexion/inscription vers la page d'accueil
    if (token && (pathname === "/auth/login" || pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Protection des pages en fonction du type d'utilisateur
    if (token) {
      const userType = token.userType
      
      // Rediriger les freelancers qui essaient d'accéder à la page client
      if (pathname.startsWith("/features/trouver-services") && userType === "freelancer") {
        return NextResponse.redirect(new URL("/features/devenir-freelance", req.url))
      }
      
      // Rediriger les clients qui essaient d'accéder à la page freelance
      if (pathname.startsWith("/features/devenir-freelance") && userType === "client") {
        return NextResponse.redirect(new URL("/features/trouver-services", req.url))
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
        if (pathname.startsWith("/features/trouver-services") || pathname.startsWith("/features/devenir-freelance")) {
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
    "/features/trouver-services/:path*",
    "/features/devenir-freelance/:path*"
  ]
}
