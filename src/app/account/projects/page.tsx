"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Filter, Clock, CheckCircle, XCircle, MoreVertical, Edit, Trash2, Briefcase } from 'lucide-react'

type ProjectStatus = 'en_cours' | 'termine' | 'en_attente' | 'annule'

type Project = {
  id: string
  title: string
  client: string
  status: ProjectStatus
  deadline: string
  budget: string
  progress: number
}

const ProjectCard = ({ project, onEdit, onDelete }: { project: Project, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
  const statusConfig = {
    en_cours: { text: 'En cours', bg: 'bg-yellow-100 text-yellow-800' },
    termine: { text: 'Terminé', bg: 'bg-green-100 text-green-800' },
    en_attente: { text: 'En attente', bg: 'bg-blue-100 text-blue-800' },
    annule: { text: 'Annulé', bg: 'bg-red-100 text-red-800' },
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Client: {project.client}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig[project.status].bg}`}>
              {statusConfig[project.status].text}
            </span>
            <div className="relative group">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button 
                  onClick={() => onEdit(project.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </button>
                <button 
                  onClick={() => onDelete(project.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progression</span>
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>Échéance: {project.deadline}</span>
          </div>
          <div className="font-medium">{project.budget}</div>
        </div>
        <div className="mt-4">
          <Link 
            href={`/account/projects/${project.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Voir les détails du projet →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'tous'>('tous')
  const [projects, setProjects] = useState<Project[]>([])

  // Données de démonstration
  useEffect(() => {
    const demoProjects: Project[] = [
      {
        id: '1',
        title: 'Site e-commerce',
        client: 'Boutique Mode',
        status: 'en_cours',
        deadline: '15/10/2023',
        budget: '1,200 €',
        progress: 65
      },
      {
        id: '2',
        title: 'Application mobile',
        client: 'Startup Tech',
        status: 'en_attente',
        deadline: '30/10/2023',
        budget: '2,500 €',
        progress: 0
      },
      {
        id: '3',
        title: 'Refonte de site web',
        client: 'Agence Créative',
        status: 'termine',
        deadline: '01/10/2023',
        budget: '800 €',
        progress: 100
      },
      {
        id: '4',
        title: 'Logo et identité visuelle',
        client: 'Café du Coin',
        status: 'annule',
        deadline: '10/09/2023',
        budget: '500 €',
        progress: 30
      },
    ]

    setProjects(demoProjects)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'tous' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEditProject = (id: string) => {
    router.push(`/account/projects/${id}/edit`)
  }

  const handleDeleteProject = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        // Ici, vous devriez appeler votre API pour supprimer le projet
        // await fetch(`/api/projects/${id}`, { method: 'DELETE' })
        
        // Mise à jour de l'état local
        setProjects(projects.filter(project => project.id !== id))
      } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error)
        alert('Une erreur est survenue lors de la suppression du projet')
      }
    }
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
            <p className="mt-2 text-gray-600">
              Gérez tous vos projets en un seul endroit
            </p>
          </div>
          <button 
            onClick={() => router.push('/account/projects/new')}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau projet
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2"
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                id="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md h-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'tous')}
              >
                <option value="tous">Tous les statuts</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="en_attente">En attente</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <Briefcase className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun projet trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'tous' 
                ? 'Aucun projet ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre premier projet.'}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => router.push('/account/projects/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Nouveau projet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
