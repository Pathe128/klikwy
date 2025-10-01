"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Briefcase, Clock, CheckCircle, DollarSign, Star } from 'lucide-react'

type StatsCardProps = {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-blue-50 text-blue-600">
        {icon}
      </div>
    </div>
    {trend && (
      <p className="mt-2 text-sm text-green-600">
        {trend} par rapport au mois dernier
      </p>
    )}
  </div>
)

type ProjectCardProps = {
  title: string
  status: 'en cours' | 'terminé' | 'en attente'
  progress: number
  deadline: string
  budget: string
}

const ProjectCard = ({ title, status, progress, deadline, budget }: ProjectCardProps) => {
  const statusColors = {
    'en cours': 'bg-yellow-100 text-yellow-800',
    'terminé': 'bg-green-100 text-green-800',
    'en attente': 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div>Échéance: {deadline}</div>
        <div className="font-medium">{budget}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      setIsLoading(false)
    }
  }, [status, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-gray-600">
            Bienvenue, {session?.user?.name || 'utilisateur'} ! Voici un aperçu de votre activité.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Projets en cours" 
            value="3" 
            icon={<Briefcase className="h-6 w-6" />} 
            trend="+1"
          />
          <StatsCard 
            title="Heures travaillées" 
            value="42h" 
            icon={<Clock className="h-6 w-6" />} 
            trend="+12%"
          />
          <StatsCard 
            title="Projets terminés" 
            value="15" 
            icon={<CheckCircle className="h-6 w-6" />} 
          />
          <StatsCard 
            title="Revenus" 
            value="2,450 €" 
            icon={<DollarSign className="h-6 w-6" />} 
            trend="+8%"
          />
        </div>

        {/* Projets récents */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Vos projets récents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard 
              title="Site e-commerce"
              status="en cours"
              progress={65}
              deadline="15/10/2023"
              budget="1,200 €"
            />
            <ProjectCard 
              title="Application mobile"
              status="en attente"
              progress={0}
              deadline="30/10/2023"
              budget="2,500 €"
            />
            <ProjectCard 
              title="Refonte de site web"
              status="terminé"
              progress={100}
              deadline="01/10/2023"
              budget="800 €"
            />
          </div>
        </div>

        {/* Avis récents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Vos derniers avis</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">il y a 2 jours</span>
              </div>
              <p className="font-medium">Excellent travail !</p>
              <p className="text-gray-600 mt-1">
                Le développeur a fait un travail exceptionnel sur notre site web. Je recommande vivement !
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <Star className="h-5 w-5 text-gray-300" />
                </div>
                <span className="ml-2 text-sm text-gray-500">il y a 1 semaine</span>
              </div>
              <p className="font-medium">Très satisfait</p>
              <p className="text-gray-600 mt-1">
                Livraison dans les temps et travail de qualité. Je reviendrai pour d'autres projets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
