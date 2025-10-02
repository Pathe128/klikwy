import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 === TENTATIVE DE CONNEXION ===");
        console.log("📧 Email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Email ou mot de passe manquant");
          return null;
        }

        try {
          console.log("🔍 Recherche utilisateur dans la base...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          console.log("📊 Utilisateur trouvé:", user ? "OUI" : "NON");
          
          if (!user) {
            console.log("❌ Utilisateur non trouvé");
            return null;
          }

          console.log("🔐 Vérification mot de passe hashé...");
          if (!user.hashedPassword) {
            console.log("❌ Aucun mot de passe hashé pour cet utilisateur");
            return null;
          }

          console.log("🔑 Comparaison bcrypt...");
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          console.log("✅ Mot de passe correct:", isCorrectPassword);

          if (!isCorrectPassword) {
            console.log("❌ Mot de passe incorrect");
            return null;
          }

          console.log("🎉 Connexion réussie !");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
          };
        } catch (error) {
          console.error("💥 Erreur lors de l'authentification:", error);
          return null;
        }
      }
    })
  ],
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  
  session: {
    strategy: "jwt",
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/account/dashboard`;
    },
  },
  
  debug: true, // Activez le mode debug
};