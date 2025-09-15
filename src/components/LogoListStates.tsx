import React from 'react';
import { Loader, Search, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface LogoListStatesProps {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  totalItems: number;
  searchTerm?: string;
  activeFilters?: number;
  className?: string;
}

export const LogoListStates: React.FC<LogoListStatesProps> = ({
  loading,
  error,
  isEmpty,
  totalItems,
  searchTerm,
  activeFilters = 0,
  className = ''
}) => {
  // Loading state
  if (loading) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Logos</h3>
        <p className="text-gray-600">Please wait while we fetch your logo collection...</p>
        
        {/* Loading skeleton */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Logos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state - no logos at all
  if (totalItems === 0 && !searchTerm && activeFilters === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Logos Found</h3>
        <p className="text-gray-600 mb-6">
          Your logo collection is empty. Start by uploading your first logo to get started.
        </p>
        <button
          onClick={() => window.location.href = '/admin/add-logo'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Upload First Logo
        </button>
      </div>
    );
  }

  // No results from search/filters
  if (isEmpty && (searchTerm || activeFilters > 0)) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600 mb-4">
          {searchTerm 
            ? `No logos match your search for "${searchTerm}"`
            : 'No logos match your current filters'
          }
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Try adjusting your search terms or filters:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check your spelling</li>
            <li>Use more general terms</li>
            <li>Remove some filters</li>
            <li>Try different categories</li>
          </ul>
        </div>
      </div>
    );
  }

  // If none of the above states, don't render anything
  return null;
}; 