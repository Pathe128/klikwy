import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

// Extension du type User de NextAuth pour inclure le rôle
// Cela permet d'utiliser les types personnalisés avec TypeScript
declare module "next-auth" {
  interface User {
    role?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Utilisation de Prisma comme adaptateur
  adapter: PrismaAdapter(prisma),
  
  // Configuration des fournisseurs d'authentification
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  
  // Pages personnalisées
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error"
  },
  
  // Configuration de la session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  
  // Callbacks
  callbacks: {
    // Callback pour le JWT
    async jwt({ token, user, account }) {
      // Ajout des informations utilisateur au token
      if (user) {
        token.role = user.role || 'CLIENT';
      }
      return token;
    },
    
    // Callback pour la session
    async session({ session, token }) {
      // Ajout des informations du token à la session
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    
    // Callback lors de la connexion
    async signIn({ user, account, profile }) {
      // Pour l'instant, on accepte toutes les connexions
      // Vous pouvez ajouter ici une logique supplémentaire si nécessaire
      return true;
    },
    
    // Redirection après connexion/déconnexion
    async redirect({ url, baseUrl }) {
      // Permet d'utiliser des URLs relatives pour les redirections
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Permet d'utiliser des URLs absolues du même domaine
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  
  // Activation du mode debug en développement
  debug: process.env.NODE_ENV === "development",
  
  // Clé secrète pour le chiffrement
  secret: process.env.NEXTAUTH_SECRET
};