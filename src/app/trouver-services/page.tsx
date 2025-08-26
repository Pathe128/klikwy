"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, Filter, Star, MapPin, Clock, Euro } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Service {
  id: string
  title: string
  description: string
  price: string
  rating: number
  location: string
  provider: string
  category: string
  image?: string
}

const mockServices: Service[] = [
  {
    id: "1",
    title: "Développement Web React/Next.js",
    description: "Création d'applications web modernes avec React et Next.js. Interface responsive et optimisée.",
    price: "À partir de 500€",
    rating: 4.9,
    location: "Paris, France",
    provider: "Marie Dupont",
    category: "Développement"
  },
  {
    id: "2",
    title: "Design UI/UX & Branding",
    description: "Conception d'interfaces utilisateur modernes et création d'identité visuelle complète.",
    price: "À partir de 300€",
    rating: 4.8,
    location: "Lyon, France",
    provider: "Thomas Martin",
    category: "Design"
  },
  {
    id: "3",
    title: "Rédaction Web & SEO",
    description: "Rédaction de contenu optimisé pour le référencement naturel et les conversions.",
    price: "À partir de 150€",
    rating: 4.7,
    location: "Marseille, France",
    provider: "Sophie Bernard",
    category: "Marketing"
  }
]

export default function TrouverServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredServices, setFilteredServices] = useState(mockServices)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/login")
      return
    }

    // Vérifier si l'utilisateur est bien un client
    if (session.user?.userType === "freelancer") {
      router.push("/vendre-services")
      return
    }
  }, [session, status, router])

  useEffect(() => {
    let filtered = mockServices

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(service =>
        service.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setFilteredServices(filtered)
  }, [searchTerm, selectedCategory])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const categories = ["all", "Développement", "Design", "Marketing", "Rédaction", "Traduction"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Trouvez le service parfait
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bienvenue {session.user?.name} ! Découvrez des freelances talentueux pour tous vos projets.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                <option value="all">Toutes catégories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              {/* Service Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
                <div className="text-6xl text-blue-900/20">
                  {service.category === "Développement" && "💻"}
                  {service.category === "Design" && "🎨"}
                  {service.category === "Marketing" && "📈"}
                </div>
              </div>

              <div className="p-6">
                {/* Category Badge */}
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                  {service.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Provider Info */}
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {service.provider.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {service.provider}
                  </span>
                </div>

                {/* Rating and Location */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-900">
                      {service.rating}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="ml-1 text-sm">{service.location}</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-900 font-semibold">
                    <Euro className="h-4 w-4" />
                    <span className="ml-1">{service.price}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-900 to-pink-500 hover:from-blue-800 hover:to-pink-600">
                    Contacter
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Clock className="h-6 w-6 mb-1" />
              Mes demandes
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Star className="h-6 w-6 mb-1" />
              Mes favoris
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <MapPin className="h-6 w-6 mb-1" />
              Services près de moi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
