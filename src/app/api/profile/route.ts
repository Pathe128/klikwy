import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authOptions'
import { prisma } from '@/lib/prisma'

// Types pour les données de l'utilisateur
interface UserData {
  id: string
  name: string | null
  email: string
  image?: string | null
  bio?: string | null
  skills?: string | null
  phone?: string | null
  location?: string | null
  role: string
  isFreelancer: boolean
  experience?: string | null
  portfolio?: string | null
  hourlyRate?: number | null
  availability?: string | null
  createdAt: Date
  updatedAt: Date
}

// Type pour la réponse de l'API
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    // Récupérer l'utilisateur avec tous les champs de base
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    }) as UserData | null

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Formater les données pour le frontend
    const formattedUser: UserData = {
      ...user,
      skills: user.skills || null,
      experience: user.experience || null,
      portfolio: user.portfolio || null,
      hourlyRate: user.hourlyRate || null,
      availability: user.availability || null
    }

    return NextResponse.json({
      success: true,
      data: formattedUser
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue lors de la récupération du profil' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      bio, 
      skills, 
      phone, 
      location,
      experience,
      portfolio,
      hourlyRate,
      availability
    } = body

    // Validation des données
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Le nom est obligatoire' },
        { status: 400 }
      )
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      name: name.trim(),
      bio: bio || null,
      phone: phone || null,
      location: location || null,
      updatedAt: new Date()
    }

    // Gérer les compétences (peuvent être une chaîne ou un tableau)
    if (skills) {
      updateData.skills = Array.isArray(skills) 
        ? JSON.stringify(skills) 
        : JSON.stringify(skills.split(',').map((s: string) => s.trim()).filter(Boolean))
    }

    // Champs optionnels pour les freelancers
    if (experience) updateData.experience = experience
    if (portfolio) updateData.portfolio = portfolio
    if (hourlyRate) updateData.hourlyRate = parseFloat(hourlyRate) || 0
    if (availability) updateData.availability = availability

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData
    }) as UserData

    // Formater les compétences pour le frontend
    const formattedUser = {
      ...updatedUser,
      skills: updatedUser.skills ? JSON.parse(updatedUser.skills) : []
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: formattedUser
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { success: false, error: 'Cette adresse email est déjà utilisée' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue lors de la mise à jour du profil' 
      },
      { status: 500 }
    )
  }
}
