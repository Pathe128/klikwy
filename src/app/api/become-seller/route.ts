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

    if (!bio || !skills || !experience || !hourlyRate) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Mettre à jour le profil utilisateur pour activer le statut freelance
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio,
        skills: JSON.stringify(skills),
        isFreelancer: true,
        role: 'FREELANCER'
      }
    })

    return NextResponse.json({ 
      message: 'Statut vendeur activé avec succès',
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
