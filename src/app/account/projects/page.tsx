"use client"

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Clock, MoreVertical, Edit, Trash2, Briefcase, Loader2, Search } from 'lucide-react';
import Pagination from '@/components/Pagination';
import ProjectFilters from '@/components/ProjectFilters';

// Types
type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  deadline?: string | null;
  budget: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    email?: string;
  };
  // Champs optionnels pour la compatibilité avec l'ancien format
  progress?: number;
};

// Configuration des statuts
const statusConfig = {
  DRAFT: { text: 'Brouillon', bg: 'bg-gray-100 text-gray-800' },
  PUBLISHED: { text: 'Publié', bg: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { text: 'En cours', bg: 'bg-yellow-100 text-yellow-800' },
  COMPLETED: { text: 'Terminé', bg: 'bg-green-100 text-green-800' },
  CANCELLED: { text: 'Annulé', bg: 'bg-red-100 text-red-800' },
} as const;

// Composant de carte de projet
const ProjectCard = ({ 
  project, 
  onEdit, 
  onDelete 
}: { 
  project: Project; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void 
}) => {

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Client: {project.client?.name || 'Non spécifié'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig[project.status]?.bg || 'bg-gray-100 text-gray-800'}`}>
              {statusConfig[project.status]?.text || project.status}
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
            <span>Budget</span>
            <span>{project.budget ? `${project.budget} €` : 'Non spécifié'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ 
                width: project.status === 'COMPLETED' ? '100%' : 
                       project.status === 'IN_PROGRESS' ? '50%' :
                       project.status === 'DRAFT' ? '10%' : '30%' 
              }}
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

// Nombre d'éléments par page
const ITEMS_PER_PAGE = 6;

// Catégories de projets (à remplacer par vos propres catégories)
const PROJECT_CATEGORIES = [
  'Développement Web',
  'Design Graphique',
  'Rédaction',
  'Marketing Digital',
  'Consultance',
  'Autre'
];

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState(0);
  
  // Filtres
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  });
  
  // Charger les projets
  const fetchProjects = useCallback(async () => {
    if (status !== 'authenticated') return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Construire les paramètres de requête
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category }),
        sortBy: filters.sortBy,
      });
      
      // En production, remplacez par un appel API réel
      // const res = await fetch(`/api/projects?${params.toString()}`);
      // const data = await res.json();
      
      // Récupérer les projets depuis l'API
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des projets');
      }
      const allProjects = await response.json();
      
      // Appliquer les filtres côté client
      let filteredProjects = [...allProjects];
      
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProjects = filteredProjects.filter(project => {
          const titleMatch = project.title.toLowerCase().includes(searchLower);
          const clientMatch = project.client?.name?.toLowerCase().includes(searchLower) ?? false;
          const categoryMatch = project.category?.toLowerCase().includes(searchLower) ?? false;
          return titleMatch || clientMatch || categoryMatch;
        });
      }
      
      // Filtre par statut
      if (filters.status) {
        filteredProjects = filteredProjects.filter(
          project => project.status === filters.status
        );
      }
      
      // Filtre par catégorie
      if (filters.category) {
        filteredProjects = filteredProjects.filter(
          project => project.category === filters.category
        );
      }
      
      // Trier les projets
      filteredProjects.sort((a, b) => {
        switch (filters.sortBy) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title_asc':
            return a.title.localeCompare(b.title);
          case 'title_desc':
            return b.title.localeCompare(a.title);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
      
      // Pagination
      const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
      const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      setProjects(paginatedProjects);
      setTotalProjects(filteredProjects.length);
      
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
      setError('Une erreur est survenue lors du chargement des projets. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, status]);
  
  // Formater la date pour l'affichage
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  // Formater le budget pour l'affichage
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Mettre à jour les filtres
  const handleFilterChange = (newFilters: { search: string; status: string; category: string; sortBy: string }) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    
    // Mettre à jour l'URL sans recharger la page
    const params = new URLSearchParams();
    if (updatedFilters.search) params.set('search', updatedFilters.search);
    if (updatedFilters.status) params.set('status', updatedFilters.status);
    if (updatedFilters.category) params.set('category', updatedFilters.category);
    if (updatedFilters.sortBy !== 'newest') params.set('sortBy', updatedFilters.sortBy);
    
    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };
  
  
  // Charger les projets lorsque les filtres changent
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Rediriger si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'tous'>('tous');

  // Gestion des actions sur les projets
  const handleEditProject = (id: string) => {
    router.push(`/account/projects/${id}/edit`);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du projet');
      }
      
      // Mettre à jour la liste des projets
      setProjects(projects.filter(project => project.id !== id));
      
    } catch (err) {
      console.error('Erreur lors de la suppression du projet:', err);
      setError('Impossible de supprimer le projet. Veuillez réessayer.');
    } finally {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await handleDeleteProject(projectToDelete);
    }
  };

  // Filtrer les projets en fonction des critères de recherche
  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchLower) ||
      (project.client?.name?.toLowerCase().includes(searchLower) ?? false);
    
    const matchesStatus = statusFilter === 'tous' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Récupération des projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      if (status !== 'authenticated') return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des projets');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les projets. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [status]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos projets...</p>
        </div>
      </div>
    );
  }

  // Rediriger si non connecté (géré par l'effet)
  if (status === 'unauthenticated') {
    return null;
  }
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
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
                onDelete={handleDeleteClick}
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
