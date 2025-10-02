import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  basePath,
  queryParams = {}
}: PaginationProps) {
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Moins de pages que le maximum visible, on les affiche toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculer les pages à afficher autour de la page courante
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Ajouter les points de suspension si nécessaire
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Ajouter les pages autour de la page courante
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Ajouter les points de suspension si nécessaire
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Construire l'URL avec les paramètres de requête
  const buildUrl = (page: number) => {
    const params = new URLSearchParams({
      ...queryParams,
      page: page.toString(),
    });
    return `${basePath}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={buildUrl(Math.max(1, currentPage - 1))}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
        >
          Précédent
        </Link>
        <Link
          href={buildUrl(Math.min(totalPages, currentPage + 1))}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
        >
          Suivant
        </Link>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> sur{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Link
              href={buildUrl(Math.max(1, currentPage - 1))}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
            >
              <span className="sr-only">Précédent</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Link>

            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span 
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }
              
              const pageNum = page as number;
              const isCurrent = pageNum === currentPage;
              
              return (
                <Link
                  key={pageNum}
                  href={buildUrl(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    isCurrent 
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' 
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                  }`}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {pageNum}
                </Link>
              );
            })}

            <Link
              href={buildUrl(Math.min(totalPages, currentPage + 1))}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
            >
              <span className="sr-only">Suivant</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
