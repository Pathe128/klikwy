import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { bio, skills, experience, portfolio, hourlyRate, availability } = body

    if (!bio || !skills || !hourlyRate) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà comme vendeur
    const existingSeller = await prisma.user.findUnique({
      where: { id: session.user.id, isFreelancer: true }
    })

    if (existingSeller) {
      return NextResponse.json(
        { error: 'Vous êtes déjà enregistré en tant que vendeur' },
        { status: 400 }
      )
    }

    // Mettre à jour le profil utilisateur pour activer le statut freelance
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio,
        skills: Array.isArray(skills) ? JSON.stringify(skills) : JSON.stringify([skills]),
        experience: experience || 'Débutant',
        portfolio: portfolio || '',
        hourlyRate: parseFloat(hourlyRate) || 0,
        availability: availability || 'FULL_TIME',
        isFreelancer: true,
        role: 'FREELANCER',
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isFreelancer: true,
        bio: true,
        skills: true,
        experience: true,
        portfolio: true,
        hourlyRate: true,
        availability: true
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Votre profil vendeur a été créé avec succès',
      user: updatedUser 
    }, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de l\'activation du statut vendeur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'activation du statut vendeur' },
      { status: 500 }
    )
  }
}
