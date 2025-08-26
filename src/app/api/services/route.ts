import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'popular'

    const whereClause = category && category !== 'ALL' 
      ? { category: category as any, isActive: true }
      : { isActive: true }

    // Définir l'ordre de tri
    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'recent':
        orderBy = { createdAt: 'desc' }
        break
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'popular':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy,
      take: 50
    })

    // Calculer la note moyenne et formater les données
    const formattedServices = services.map((service: any) => {
      const avgRating = service.reviews.length > 0 
        ? service.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / service.reviews.length
        : 0

      return {
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        currency: service.currency,
        deliveryTime: service.deliveryTime,
        images: service.image ? [service.image] : [],
        seller: {
          id: service.user.id,
          name: service.user.name || 'Utilisateur',
          image: service.user.image || '/placeholder-avatar.jpg',
          location: service.user.location || 'Maroc',
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: service._count.reviews,
          isOnline: true // Simulé pour l'instant
        },
        category: service.category,
        tags: service.tags ? JSON.parse(service.tags) : [],
        createdAt: service.createdAt
      }
    })

    return NextResponse.json(formattedServices)
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      currency = 'MAD',
      category,
      deliveryTime,
      image,
      tags,
      userId
    } = body

    if (!title || !description || !price || !category || !deliveryTime || !userId) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        currency,
        category,
        deliveryTime: parseInt(deliveryTime),
        image,
        tags: tags ? JSON.stringify(tags) : null,
        userId
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du service:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du service' },
      { status: 500 }
    )
  }
}
