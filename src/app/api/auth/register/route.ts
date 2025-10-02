import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, userType } = await request.json();

    console.log("📝 Données reçues:", { name, email, userType });

    // Validation des données
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà dans la VRAIE base de données
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ Utilisateur existe déjà:", email);
      return NextResponse.json(
        { message: "Un compte avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    console.log("🔐 Hachage du mot de passe...");
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("✅ Mot de passe hashé:", hashedPassword);

    // Déterminer le rôle
    const role = userType === "freelancer" ? "FREELANCER" : "CLIENT";
    const isFreelancer = userType === "freelancer";

    // Créer l'utilisateur dans la VRAIE base de données
    console.log("👤 Création de l'utilisateur dans Prisma...");
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,  // ✅ CORRECT
        role,
        isFreelancer,
      },
    });

    console.log("✅ Utilisateur créé dans la base de données:", user.id);

    return NextResponse.json(
      { 
        message: "Utilisateur créé avec succès", 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          role: user.role 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur d'inscription:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}