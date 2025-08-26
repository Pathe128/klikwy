import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { userStore } from "@/lib/userStore"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, userType } = await request.json()

    // Validation des données
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    if (userStore.userExists(email)) {
      return NextResponse.json(
        { message: "Un compte avec cet email existe déjà" },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      userType,
      createdAt: new Date().toISOString(),
      emailVerified: false
    }

    userStore.addUser(newUser)

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser
    
    return NextResponse.json(
      { 
        message: "Compte créé avec succès",
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
