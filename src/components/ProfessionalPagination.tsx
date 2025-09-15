import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading?: boolean;
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const ProfessionalPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  className = ''
}) => {
  const [jumpToPage, setJumpToPage] = useState<string>('');

  // Don't render if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  // Calculate start and end items for current page
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const generatePageNumbers = () => {
    const pages: Array<number | 'ellipsis'> = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Show pages 2-5, then ellipsis, then last page
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page, ellipsis, then last 4 pages
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current page ±1, ellipsis, last page
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpToPage('');
    }
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Left side - Items info and page size selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Items info */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems.toLocaleString()}</span> results
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side - Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Jump to page */}
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <label htmlFor="jump-page" className="text-sm text-gray-600">
            Go to:
          </label>
          <input
            id="jump-page"
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            disabled={loading}
            className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Page"
          />
          <button
            type="submit"
            disabled={loading || !jumpToPage}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Go
          </button>
        </form>

        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="p-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === 'ellipsis' ? (
                <span className="px-3 py-2 text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="p-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}; 