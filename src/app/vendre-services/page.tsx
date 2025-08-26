"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Plus, Edit, Eye, Trash2, DollarSign, Users, TrendingUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Service {
  id: string
  title: string
  description: string
  price: string
  category: string
  status: "active" | "paused" | "draft"
  views: number
  orders: number
  createdAt: string
}

const mockUserServices: Service[] = [
  {
    id: "1",
    title: "Développement d'application React",
    description: "Je développe des applications web modernes avec React, Next.js et TypeScript.",
    price: "À partir de 800€",
    category: "Développement",
    status: "active",
    views: 156,
    orders: 12,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Audit et optimisation SEO",
    description: "Audit complet de votre site web et optimisation pour les moteurs de recherche.",
    price: "À partir de 300€",
    category: "Marketing",
    status: "active",
    views: 89,
    orders: 7,
    createdAt: "2024-02-01"
  }
]

export default function VendreServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState(mockUserServices)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/login")
      return
    }

    // Vérifier si l'utilisateur est bien un freelancer
    if (session.user?.userType === "client") {
      router.push("/trouver-services")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const totalViews = services.reduce((sum, service) => sum + service.views, 0)
  const totalOrders = services.reduce((sum, service) => sum + service.orders, 0)
  const activeServices = services.filter(service => service.status === "active").length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-pink-600 mb-2">
              Vendre mes services
            </h1>
            <p className="text-xl text-gray-600">
              Bienvenue {session.user?.name} ! Gérez vos services et développez votre activité.
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-pink-500 to-blue-900 hover:from-pink-600 hover:to-blue-800"
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer un service
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Services actifs</p>
                <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vues totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalViews > 0 ? Math.round((totalOrders / totalViews) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Mes services</h2>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun service créé
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par créer votre premier service pour attirer des clients.
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-pink-500 to-blue-900 hover:from-pink-600 hover:to-blue-800"
              >
                <Plus className="h-5 w-5 mr-2" />
                Créer mon premier service
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {services.map((service) => (
                <div key={service.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {service.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === "active" 
                            ? "bg-green-100 text-green-800"
                            : service.status === "paused"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {service.status === "active" ? "Actif" : 
                           service.status === "paused" ? "En pause" : "Brouillon"}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {service.price}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {service.views} vues
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {service.orders} commandes
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Créé le {new Date(service.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Plus className="h-6 w-6 mb-1" />
              Nouveau service
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 mb-1" />
              Statistiques
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-1" />
              Mes clients
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <DollarSign className="h-6 w-6 mb-1" />
              Revenus
            </Button>
          </div>
        </div>

        {/* Create Service Modal Placeholder */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Créer un nouveau service</h3>
              <p className="text-gray-600 mb-4">
                Cette fonctionnalité sera bientôt disponible. Vous pourrez créer et gérer vos services directement depuis cette interface.
              </p>
              <Button 
                onClick={() => setShowCreateForm(false)}
                className="w-full"
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
