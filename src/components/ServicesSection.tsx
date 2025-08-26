"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Clock, User } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  deliveryTime: number
  rating: number
  reviewCount: number
  seller: {
    name: string
    image: string
  }
}

const categories = [
  { id: 'all', name: 'Tous les services' },
  { id: 'REDACTION', name: 'Rédaction' },
  { id: 'TRADUCTION', name: 'Traduction' },
  { id: 'DESIGN', name: 'Design graphique' },
  { id: 'LOGO', name: 'Logo & Branding' },
  { id: 'SOCIAL_MEDIA', name: 'Réseaux sociaux' },
  { id: 'WEB_DEV', name: 'Développement web' },
  { id: 'PHOTO', name: 'Retouche photo' },
  { id: 'VIDEO', name: 'Montage vidéo' }
]

// Services d'exemple avec vraies images
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Je rédigerai des articles de blog SEO optimisés',
    description: 'Articles de qualité professionnelle pour votre blog',
    price: 150,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
    category: 'REDACTION',
    deliveryTime: 3,
    rating: 4.9,
    reviewCount: 127,
    seller: {
      name: 'Sarah M.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '2',
    title: 'Je créerai un logo professionnel pour votre marque',
    description: 'Design de logo unique et moderne',
    price: 200,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
    category: 'LOGO',
    deliveryTime: 2,
    rating: 5.0,
    reviewCount: 89,
    seller: {
      name: 'Ahmed K.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    title: 'Je développerai votre site web responsive',
    description: 'Site web moderne et optimisé mobile',
    price: 800,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: 'WEB_DEV',
    deliveryTime: 7,
    rating: 4.8,
    reviewCount: 156,
    seller: {
      name: 'Youssef B.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '4',
    title: 'Je créerai des posts créatifs pour vos réseaux sociaux',
    description: 'Designs attractifs pour Instagram, Facebook, LinkedIn',
    price: 120,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    category: 'SOCIAL_MEDIA',
    deliveryTime: 2,
    rating: 4.7,
    reviewCount: 203,
    seller: {
      name: 'Fatima Z.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '5',
    title: 'Je traduirai vos documents français-anglais-arabe',
    description: 'Traduction professionnelle et certifiée',
    price: 80,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
    category: 'TRADUCTION',
    deliveryTime: 1,
    rating: 4.9,
    reviewCount: 94,
    seller: {
      name: 'Karim L.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '6',
    title: 'Je retoucherai vos photos comme un pro',
    description: 'Retouche photo professionnelle et correction couleurs',
    price: 100,
    image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=300&fit=crop',
    category: 'PHOTO',
    deliveryTime: 2,
    rating: 4.8,
    reviewCount: 178,
    seller: {
      name: 'Nadia H.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '7',
    title: 'Je monterai votre vidéo promotionnelle',
    description: 'Montage vidéo professionnel avec effets et musique',
    price: 300,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
    category: 'VIDEO',
    deliveryTime: 5,
    rating: 4.9,
    reviewCount: 67,
    seller: {
      name: 'Omar T.',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face'
    }
  },
  {
    id: '8',
    title: 'Je créerai votre identité visuelle complète',
    description: 'Logo, charte graphique, cartes de visite',
    price: 450,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
    category: 'DESIGN',
    deliveryTime: 4,
    rating: 5.0,
    reviewCount: 112,
    seller: {
      name: 'Leila A.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face'
    }
  }
]

export default function fServicesSection() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    filterServices()
  }, [selectedCategory])

  const filterServices = () => {
    if (selectedCategory === 'all') {
      setServices(mockServices)
    } else {
      const filtered = mockServices.filter(service => service.category === selectedCategory)
      setServices(filtered)
    }
  }

  const handleOrderService = (serviceId: string) => {
    console.log('Commander le service:', serviceId)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Services populaires
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez nos microservices les plus demandés
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#F72585] text-white'
                  : 'bg-white text-gray-700 hover:bg-[#F72585] border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              {/* Image du service */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4">
                {/* Vendeur */}
                <div className="flex items-center gap-2 mb-3">
                  <Image
                    src={service.seller.image}
                    alt={service.seller.name}
                    width={28}
                    height={28}
                    className="rounded-full border-2 border-gray-100"
                  />
                  <span className="text-sm font-medium text-gray-700">{service.seller.name}</span>
                </div>

                {/* Titre */}
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {service.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-900">
                    {service.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({service.reviewCount})
                  </span>
                </div>

                {/* Prix et délai */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{service.deliveryTime} jour{service.deliveryTime > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {service.price} MAD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun service */}
        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Aucun service trouvé dans cette catégorie
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Essayez de sélectionner une autre catégorie
            </p>
          </div>
        )}

        {/* Bouton voir plus */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
            Voir tous les services
          </button>
        </div>
      </div>
    </section>
  )
}
