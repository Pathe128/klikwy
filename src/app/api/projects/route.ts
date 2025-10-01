import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const whereClause = status 
      ? { clientId: session.user.id, status: status as any }
      : { clientId: session.user.id }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, budget, deadline, category } = body

    // Validation des données
    if (!title || !description || !budget) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Les champs titre, description et budget sont obligatoires' 
        },
        { status: 400 }
      )
    }

    // Validation du budget
    const budgetValue = parseFloat(budget)
    if (isNaN(budgetValue) || budgetValue <= 0) {
      return NextResponse.json(
        { success: false, error: 'Le budget doit être un nombre positif' },
        { status: 400 }
      )
    }

    // Validation de la date limite
    let deadlineDate = null
    if (deadline) {
      deadlineDate = new Date(deadline)
      if (isNaN(deadlineDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Format de date invalide' },
          { status: 400 }
        )
      }
    }

    // Création du projet avec le statut par défaut
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        budget: budgetValue,
        deadline: deadlineDate,
        status: 'DRAFT',
        client: {
          connect: { id: session.user.id }
        },
        // Le champ category est ajouté uniquement s'il est défini
        ...(category && { category })
      },
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        deadline: true,
        status: true,
        createdAt: true,
        // Inclure la catégorie si elle existe
        ...(category && { category: true }),
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Convertir les dates en chaînes ISO pour la réponse JSON
    const projectWithDates = {
      ...project,
      deadline: project.deadline ? new Date(project.deadline).toISOString() : null,
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : null
    }

    return NextResponse.json({
      success: true,
      message: 'Votre projet a été créé avec succès',
      data: projectWithDates
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error)
    
    // Gestion des erreurs spécifiques à Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { success: false, error: 'Un projet similaire existe déjà' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { success: false, error: 'Utilisateur non trouvé' },
          { status: 404 }
        )
      }
      
      // Autres erreurs Prisma
      if (error.message.includes('Invalid `prisma.project.create()')) {
        return NextResponse.json(
          { success: false, error: 'Données de projet invalides' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue lors de la création du projet. Veuillez réessayer.' 
      },
      { status: 500 }
    )
  }
}
