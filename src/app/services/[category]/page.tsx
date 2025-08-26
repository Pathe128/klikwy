"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, Filter, Grid, List } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  price: number
  currency: string
  deliveryTime: number
  images: string[]
  seller: {
    id: string
    name: string
    image: string
    location: string
    rating: number
    reviewCount: number
    isOnline: boolean
  }
  category: string
  tags: string[]
  createdAt: string
}

const categoryNames: { [key: string]: string } = {
  'redaction': 'Rédaction',
  'traduction': 'Traduction',
  'design': 'Design graphique',
  'logo': 'Logo & Branding',
  'social-media': 'Posts réseaux sociaux',
  'web-dev': 'Développement web',
  'photo': 'Retouche photo',
  'video': 'Montage vidéo'
}

export default function ServiceCategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [category, sortBy])

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/services?category=${category}&sort=${sortBy}`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServices = services.filter(service => 
    service.price >= priceRange[0] && service.price <= priceRange[1]
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D3B66]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la catégorie */}
      <div className="bg-gradient-to-r from-[#0D3B66] to-[#F72585] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              {categoryNames[category] || 'Services'}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Découvrez les meilleurs freelances spécialisés en {categoryNames[category]?.toLowerCase()}
            </p>
            <div className="flex items-center justify-center gap-4 text-white">
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                {filteredServices.length} services disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre d'outils */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F72585] focus:border-[#F72585]"
            >
              <option value="popular">Plus populaires</option>
              <option value="recent">Plus récents</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#0D3B66] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#0D3B66] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filtres latéraux */}
          {showFilters && (
            <div className="w-64 bg-white rounded-lg border border-gray-200 p-6 h-fit">
              <h3 className="font-semibold text-gray-900 mb-4">Filtres</h3>
              
              {/* Filtre prix */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (MAD)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{priceRange[0]} MAD</span>
                    <span>{priceRange[1]} MAD</span>
                  </div>
                </div>
              </div>

              {/* Autres filtres */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Délai de livraison
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">24h</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">3 jours</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">7 jours</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Liste des services */}
          <div className="flex-1">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun service trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez d'ajuster vos filtres ou revenez plus tard.
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/service/${service.id}`}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {/* Image du service */}
                    <div className="relative h-48">
                      <Image
                        src={service.images[0] || '/placeholder-service.jpg'}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-[#0D3B66]">
                          {service.price} {service.currency}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Profil du vendeur */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <Image
                            src={service.seller.image || '/placeholder-avatar.jpg'}
                            alt={service.seller.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          {service.seller.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {service.seller.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {service.seller.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.seller.rating}</span>
                          <span className="text-xs text-gray-500">({service.seller.reviewCount})</span>
                        </div>
                      </div>

                      {/* Titre et description */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          {service.deliveryTime} jour{service.deliveryTime > 1 ? 's' : ''}
                        </div>
                        <span className="font-semibold text-[#0D3B66]">
                          À partir de {service.price} MAD
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
