"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
  type?: string;
  visibility?: 'public' | 'private';
  requirements?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    email?: string;
  };
};

// Composant Badge simple pour l'exemple
const Badge = ({ 
  variant = 'default', 
  children,
  className = '' 
}: { 
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  children: React.ReactNode;
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Composant Card simple pour l'exemple
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-semibold ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-50 px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  [key: string]: any;
}) => {
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  return (
    <button 
      className={`px-4 py-2 rounded-md text-sm font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Fonction pour récupérer un projet depuis l'API
const fetchProject = async (projectId: string): Promise<Project | null> => {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erreur API:', await response.text());
      return null;
    }
    
    const data = await response.json();
    console.log('Données du projet reçues:', data);
    return data;
  } catch (error) {
    console.error('Erreur fetchProject:', error);
    return null;
  }
};

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Récupération du projet
  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true);
        const projectData = await fetchProject(params.id);
        setProject(projectData);
        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger le projet. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      loadProject();
    }
  }, [params.id, status]);

  // Redirection si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Affichage pendant le chargement
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Si le projet n'existe pas
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h1>
          <p className="text-gray-600 mb-6">Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link 
            href="/account/projects" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à mes projets
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="info">En cours</Badge>;
      case 'completed':
        return <Badge variant="success">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="error">Annulé</Badge>;
      case 'draft':
      default:
        return <Badge variant="secondary">Brouillon</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/account/projects" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à mes projets
          </Link>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Détails du projet</h1>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => router.push(`/account/projects/${project.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button>Exporter en PDF</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte d'information du projet */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h2 className="text-xl font-semibold">{project.title}</h2>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Créé le {formatDate(project.createdAt)}
                      {project.updatedAt && ` • Dernière mise à jour le ${formatDate(project.updatedAt)}`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {project.description}
                  </p>

                  {project.requirements && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900">Exigences</h3>
                      <p className="text-sm text-gray-600">
                        {project.requirements}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section des documents */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">Documents</h2>
                <p className="text-sm text-gray-500">Tous les fichiers liés à ce projet</p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500">Aucun document pour le moment</p>
                  <Button variant="outline" className="mt-2">
                    Téléverser un fichier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* Statut et dates */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium">Détails</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                  <div className="mt-1">
                    {getStatusBadge(project.status)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date d'échéance</h3>
                  <div className="mt-1 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{project.deadline ? formatDate(project.deadline) : 'Non définie'}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                  <p className="mt-1">
                    {project.budget ? `${project.budget} €` : 'Non spécifié'}
                  </p>
                </div>

                {project.category && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">Catégorie</h3>
                    <p className="text-sm text-gray-600">{project.category}</p>
                  </div>
                )}

                {project.type && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">Type</h3>
                    <p className="text-sm text-gray-600">{project.type}</p>
                  </div>
                )}

                {project.visibility && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900">Visibilité</h3>
                    <p className="text-sm text-gray-600 capitalize">{project.visibility}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client */}
            {project.client && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium">Client</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {project.client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{project.client.name}</h3>
                      {project.client.email && (
                        <p className="text-sm text-gray-500">{project.client.email}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
