'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Briefcase, Clock, DollarSign, MapPin } from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string
  category: string
  budget: string
  deadline: string
  status: string
  client: string
  clientImage: string
  createdAt: string
  progress: number
}

export default function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Récupérer les projets depuis le stockage local
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects)
        // Trier par date de création (du plus récent au plus ancien)
        const sortedProjects = parsedProjects.sort((a: Project, b: Project) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        // Prendre les 6 premiers projets
        setProjects(sortedProjects.slice(0, 6))
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error)
      }
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return null // Ne rien afficher s'il n'y a pas de projets
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'developpement-web': 'bg-blue-100 text-blue-800',
      'design': 'bg-purple-100 text-purple-800',
      'redaction': 'bg-green-100 text-green-800',
      'marketing': 'bg-yellow-100 text-yellow-800',
      'video-animation': 'bg-red-100 text-red-800',
      'business': 'bg-indigo-100 text-indigo-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0D3B66] mb-4">Projets récents</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les derniers projets publiés par nos clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-r from-[#0D3B66] to-[#F72585] flex items-center justify-center">
                <Briefcase className="h-16 w-16 text-white opacity-20" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/projets/${project.id}`} className="hover:underline">
                    <h3 className="text-xl font-bold text-[#0D3B66] line-clamp-2">{project.title}</h3>
                  </Link>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(project.category)}`}>
                    {project.category.replace('-', ' ')}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-[#0D3B66]" />
                    <span>Budget: {project.budget || 'Non spécifié'}</span>
                  </div>
                  {project.deadline && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-[#0D3B66]" />
                      <span>Échéance: {formatDate(project.deadline)}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#0D3B66]" />
                    <span>À distance</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Publié le {formatDate(project.createdAt)}</span>
                    <span>{project.client}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#0D3B66] to-[#F72585] h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <Link 
                  href={`/projets/${project.id}`}
                  className="block text-center w-full bg-[#0D3B66] hover:bg-[#0a2e4d] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Voir le projet
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/projets"
            className="inline-flex items-center text-[#0D3B66] hover:text-[#F72585] font-medium"
          >
            Voir tous les projets
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
