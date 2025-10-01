"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Types
type Project = {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  category?: string;
  type?: string;
  visibility: 'public' | 'private';
  budget?: string | number;
  deadline?: string;
  requirements?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  client?: {
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

// Fonction pour simuler la récupération d'un projet
const getProject = (projectId: string): Project | null => {
  // En production, vous devriez faire un appel API ici
  // Exemple :
  // const res = await fetch(`/api/projects/${projectId}`);
  // return await res.json();
  
  // Simulation de données pour le développement
  const mockProjects: Project[] = [
    {
      id: 'proj-1759184313114',
      title: 'Site e-commerce',
      description: 'Création d\'un site e-commerce complet avec système de paiement intégré.',
      status: 'in_progress',
      category: 'Développement Web',
      type: 'Site e-commerce',
      visibility: 'public',
      budget: 5000,
      deadline: '2024-12-31',
      requirements: 'Le site doit être responsive et prendre en charge les paiements en ligne.',
      tags: ['ecommerce', 'react', 'nodejs'],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z',
      client: {
        id: 'client-123',
        name: 'Boutique Mode',
        email: 'contact@boutiquemode.com'
      }
    },
    // Ajoutez d'autres projets de test si nécessaire
  ];

  return mockProjects.find(project => project.id === projectId) || null;
};

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Récupération du projet (simulé pour l'exemple)
  const project = getProject(params.id);

  // Redirection si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Affichage pendant le chargement
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Exigences</h3>
                      <p className="text-gray-700 whitespace-pre-line">
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
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                    <p className="mt-1">{project.category}</p>
                  </div>
                )}

                {project.type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type de projet</h3>
                    <p className="mt-1">{project.type}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Visibilité</h3>
                  <p className="mt-1 capitalize">{project.visibility}</p>
                </div>
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
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium">Tags</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
