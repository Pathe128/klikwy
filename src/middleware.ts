import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // La logique de redirection simple
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Routes publiques
        const publicPaths = [
          "/",
          "/auth/login",
          "/auth/register", 
          "/auth/forgot-password",
          "/auth/error",
          "/api/auth",
          "/_next/",
          "/favicon.ico"
        ];

        const isPublicPath = publicPaths.some(path => 
          pathname === path || pathname.startsWith(path)
        );

        // Autoriser les routes publiques et les routes API auth
        if (isPublicPath || pathname.startsWith('/api/auth/')) {
          return true;
        }
        
        // Routes protégées
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};