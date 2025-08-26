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
    const type = searchParams.get('type') // 'client' or 'freelancer'

    let whereClause: any = {}

    if (type === 'freelancer') {
      whereClause.freelancerId = session.user.id
    } else {
      whereClause.clientId = session.user.id
    }

    if (status) {
      whereClause.status = status
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            name: true,
            image: true
          }
        },
        freelancer: {
          select: {
            name: true,
            image: true
          }
        },
        service: {
          select: {
            title: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { serviceId, title, description, budget, deadline } = body

    if (!serviceId || !title || !description || !budget) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    // Vérifier que le service existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { user: true }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      )
    }

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        title,
        description,
        budget: parseFloat(budget),
        deadline: deadline ? new Date(deadline) : null,
        clientId: session.user.id,
        freelancerId: service.userId,
        serviceId: serviceId
      },
      include: {
        client: {
          select: {
            name: true,
            image: true
          }
        },
        freelancer: {
          select: {
            name: true,
            image: true
          }
        },
        service: {
          select: {
            title: true,
            category: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
