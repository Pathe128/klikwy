"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Briefcase, MessageSquare, Star, Plus, Filter } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  deliveryTime: number
  image: string | null
  user: {
    name: string | null
    image: string | null
  }
  reviews: { rating: number }[]
  _count: { reviews: number }
}

interface Order {
  id: string
  title: string
  description: string
  budget: number
  status: string
  createdAt: string
  client: {
    name: string | null
    image: string | null
  }
  freelancer?: {
    name: string | null
    image: string | null
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'marketplace')
  const [services, setServices] = useState<Service[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [myServices, setMyServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const categories = [
    { key: 'ALL', label: 'Tous' },
    { key: 'REDACTION', label: 'Rédaction' },
    { key: 'TRADUCTION', label: 'Traduction' },
    { key: 'DESIGN_GRAPHIQUE', label: 'Design' },
    { key: 'LOGO_BRANDING', label: 'Logo' },
    { key: 'POSTS_RESEAUX_SOCIAUX', label: 'Social Media' },
    { key: 'DEVELOPPEMENT_WEB', label: 'Dev Web' },
    { key: 'RETOUCHE_PHOTO', label: 'Photo' },
    { key: 'MONTAGE_VIDEO', label: 'Vidéo' },
    { key: 'MARKETING_DIGITAL', label: 'Marketing' }
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (session?.user?.id) {
      loadDashboardData()
    }
  }, [session, status, router, activeTab, selectedCategory])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'marketplace') {
        const response = await fetch(`/api/services?category=${selectedCategory}`)
        if (response.ok) {
          const data = await response.json()
          setServices(data)
        }
      } else if (activeTab === 'orders') {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } else if (activeTab === 'seller' && session?.user?.id) {
        const response = await fetch(`/api/services?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          setMyServices(data)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D3B66]"></div>
      </div>
    )
  }

  const getAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos services, commandes et projets</p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'marketplace'
                  ? 'border-[#F72585] text-[#0D3B66]'
                  : 'border-transparent text-gray-500 hover:text-[#0D3B66]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-[#F72585] text-[#0D3B66]'
                  : 'border-transparent text-gray-500 hover:text-[#0D3B66]'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Mes commandes
            </button>
            {session?.user?.userType === 'freelancer' && (
              <button
                onClick={() => setActiveTab('seller')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'seller'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Star className="w-4 h-4 inline mr-2" />
                Espace vendeur
              </button>
            )}
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-[#F72585] text-[#0D3B66]'
                  : 'border-transparent text-gray-500 hover:text-[#0D3B66]'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Messages
            </button>
          </nav>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Marketplace */}
          {activeTab === 'marketplace' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Services disponibles</h2>
                <div className="flex items-center space-x-3">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D3B66] mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement des services...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{getAverageRating(service.reviews)}</span>
                          <span className="text-sm text-gray-500">({service._count.reviews})</span>
                        </div>
                        <span className="text-sm text-gray-500">{service.deliveryTime}j</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#0D3B66]">{service.price} {service.currency}</span>
                        <button className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#F72585] transition-colors">
                          Commander
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Commandes */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes commandes</h2>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D3B66] mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement des commandes...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune commande pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{order.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{order.description}</p>
                          <div className="flex items-center space-x-4 mt-3">
                            <span className="text-lg font-bold text-[#0D3B66]">{order.budget} MAD</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Espace vendeur */}
          {activeTab === 'seller' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes services</h2>
                <button
                  onClick={() => router.push('/create-service')}
                  className="bg-[#0D3B66] text-white px-4 py-2 rounded-lg hover:bg-[#F72585] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau service
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D3B66] mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement de vos services...</p>
                </div>
              ) : myServices.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de service</p>
                  <button
                    onClick={() => router.push('/create-service')}
                    className="bg-[#0D3B66] text-white px-6 py-2 rounded-lg hover:bg-[#F72585] transition-colors"
                  >
                    Créer mon premier service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myServices.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{getAverageRating(service.reviews)}</span>
                          <span className="text-sm text-gray-500">({service._count.reviews})</span>
                        </div>
                        <span className="text-sm text-gray-500">{service.deliveryTime}j</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#0D3B66]">{service.price} {service.currency}</span>
                        <button className="text-[#0D3B66] hover:text-[#F72585] text-sm font-medium">
                          Modifier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Fonctionnalité de messagerie en cours de développement</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
