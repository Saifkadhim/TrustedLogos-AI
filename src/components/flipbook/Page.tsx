import React, { forwardRef, useState, useEffect, useRef } from 'react';
import type { PageProps } from '../../types/flipbook';
import Loader from './Loader';

const Page = forwardRef<HTMLDivElement, PageProps>(({ pageNum, renderPage }, ref) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Use intersection observer for lazy loading with a robust fallback
  useEffect(() => {
    let fallbackTimer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
          if (fallbackTimer) window.clearTimeout(fallbackTimer);
        }
      },
      {
        root: null,
        rootMargin: '200px', // Load earlier to avoid blank content
        threshold: 0.01
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // Fallback: if the observer never fires (e.g., transformed container), load anyway
    fallbackTimer = window.setTimeout(() => setShouldLoad(true), 400);

    return () => {
      observer.disconnect();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    let isMounted = true;
    setIsLoading(true);

    // Use higher priority for visible pages
    const priority = 1;
    
    renderPage(pageNum, priority).then(url => {
      if (isMounted && url) {
        setImageUrl(url);
      }
      if (isMounted) {
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pageNum, renderPage, shouldLoad]);

  return (
    <div 
      ref={ref} 
      className="bg-white dark:bg-gray-700 shadow-md flex items-center justify-center relative"
      data-density="hard"
      aria-label={`Page ${pageNum}`}
    >
      <div 
        ref={observerRef}
        className="w-full h-full flex items-center justify-center"
      >
        {!shouldLoad && (
          <div className="text-gray-500 text-sm">
            Page {pageNum}
          </div>
        )}
        {shouldLoad && isLoading && (
          <Loader message={`Loading page ${pageNum}...`} />
        )}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={`Page ${pageNum}`} 
            className="w-full h-full object-contain"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default React.memo(Page); 