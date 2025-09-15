import React, { forwardRef, useState, useEffect } from 'react';
import type { PageProps } from '../../types/flipbook';
import Loader from './Loader';

const Page = forwardRef<HTMLDivElement, PageProps>(({ pageNum, renderPage }, ref) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    renderPage(pageNum).then(url => {
      if (isMounted && url) {
        setImageUrl(url);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [pageNum, renderPage]);

  return (
    <div 
      ref={ref} 
      className="bg-white dark:bg-gray-700 shadow-md flex items-center justify-center"
      data-density="hard"
      aria-label={`Page ${pageNum}`}
    >
      <div className="w-full h-full">
        {isLoading && <Loader message={`Loading page ${pageNum}...`} />}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={`Page ${pageNum}`} 
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default React.memo(Page); 