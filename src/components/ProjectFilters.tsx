import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';

interface ProjectFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    category: string;
    sortBy: string;
  }) => void;
  initialFilters?: {
    search?: string;
    status?: string;
    category?: string;
    sortBy?: string;
  };
  categories?: string[];
}

export default function ProjectFilters({ 
  onFilterChange, 
  initialFilters = {}, 
  categories = [] 
}: ProjectFiltersProps) {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [status, setStatus] = useState(initialFilters.status || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const router = useRouter();

  // Appliquer les filtres lorsqu'ils changent
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        status,
        category,
        sortBy,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, category, sortBy, onFilterChange]);

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setSortBy('newest');
  };

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters = search || status || category || sortBy !== 'newest';

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="md:flex md:items-center md:justify-between">
        {/* Barre de recherche */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Rechercher des projets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bouton de filtre mobile */}
        <div className="mt-4 md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            Filtres
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                {[search, status, category, sortBy !== 'newest' ? 1 : 0].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Panneau de filtres mobile */}
      {isMobileFiltersOpen && (
        <div className="mt-4 md:hidden">
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <span className="sr-only">Fermer</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  id="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              {categories.length > 0 && (
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Trier par
                </label>
                <select
                  id="sort"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Plus récent</option>
                  <option value="oldest">Plus ancien</option>
                  <option value="title_asc">Titre (A-Z)</option>
                  <option value="title_desc">Titre (Z-A)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filtres pour les écrans larges */}
      <div className="hidden md:block mt-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-48">
            <label htmlFor="desktop-status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="desktop-status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          {categories.length > 0 && (
            <div className="w-48">
              <label htmlFor="desktop-category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="desktop-category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="w-48">
            <label htmlFor="desktop-sort" className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
              id="desktop-sort"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="title_asc">Titre (A-Z)</option>
              <option value="title_desc">Titre (Z-A)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="self-end">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
