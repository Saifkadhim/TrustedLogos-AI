import React, { useState, useEffect } from 'react';
import type { ThumbnailRailProps } from '../../types/flipbook';
import Loader from './Loader';

const ThumbnailRail: React.FC<ThumbnailRailProps> = ({
  numPages,
  currentPage,
  onThumbnailClick,
  renderPage
}) => {
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());
  const [loadingThumbnails, setLoadingThumbnails] = useState<Set<number>>(new Set());

  // Load thumbnails for visible pages
  useEffect(() => {
    const loadVisibleThumbnails = async () => {
      // Load current page and nearby pages
      const pagesToLoad = [
        currentPage,
        currentPage - 1,
        currentPage + 1,
        currentPage - 2,
        currentPage + 2
      ].filter(page => page >= 1 && page <= numPages);

      for (const pageNum of pagesToLoad) {
        if (!thumbnails.has(pageNum) && !loadingThumbnails.has(pageNum)) {
          setLoadingThumbnails(prev => new Set(prev).add(pageNum));
          
          try {
            const imageUrl = await renderPage(pageNum);
            if (imageUrl) {
              setThumbnails(prev => new Map(prev).set(pageNum, imageUrl));
            }
                  } catch (error) {
          // Silent error handling for thumbnail loading failures
        } finally {
            setLoadingThumbnails(prev => {
              const newSet = new Set(prev);
              newSet.delete(pageNum);
              return newSet;
            });
          }
        }
      }
    };

    if (numPages > 0) {
      loadVisibleThumbnails();
    }
  }, [numPages, currentPage, renderPage, thumbnails, loadingThumbnails]);

  if (numPages === 0) return null;

  return (
    <div className="flex gap-2 p-2 overflow-x-auto bg-gray-50 dark:bg-gray-800">
      {Array.from({ length: numPages }, (_, i) => {
        const pageNum = i + 1;
        const thumbnailUrl = thumbnails.get(pageNum);
        const isLoading = loadingThumbnails.has(pageNum);
        const isCurrentPage = currentPage === pageNum;

        return (
          <button
            key={pageNum}
            onClick={() => onThumbnailClick(pageNum)}
            className={`flex-shrink-0 w-16 h-20 rounded border-2 transition-all ${
              isCurrentPage
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <Loader message="" />
              </div>
            ) : thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={`Page ${pageNum}`}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                {pageNum}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThumbnailRail; 