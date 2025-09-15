import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Page from './Page';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';
import { usePdf } from '../../hooks/usePdf';
import type { FlipbookViewerProps, FlipbookViewerActions } from '../../types/flipbook';

const FlipbookViewer = forwardRef<FlipbookViewerActions, FlipbookViewerProps>(({ 
  pdfUrl, 
  title, 
  onClose, 
  enableWatermark = true, 
  readingDirection = 'ltr', 
  initialPage = 1,
  theme = 'light',
  onPageChange
}, ref) => {
  const { pdfDoc, numPages, isLoading, error, renderPage, retry } = usePdf(pdfUrl);
  
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isSinglePageView, setIsSinglePageView] = useState(window.innerWidth < 1024);
  const [pageAspectRatio, setPageAspectRatio] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    flipPrev: () => {
      if (flipBookRef.current?.pageFlip()) {
        flipBookRef.current.pageFlip().flipPrev();
      }
    },
    flipNext: () => {
      if (flipBookRef.current?.pageFlip()) {
        flipBookRef.current.pageFlip().flipNext();
      }
    },
    turnToPage: (pageIndex: number) => {
      if (flipBookRef.current?.pageFlip()) {
        // Ensure pageIndex is within bounds and convert to 0-based index
        const safeIndex = Math.max(0, Math.min(pageIndex - 1, numPages - 1));
        flipBookRef.current.pageFlip().turnToPage(safeIndex);
      }
    },
  }));

  useEffect(() => {
    if (pdfDoc) {
      const getAspectRatio = async () => {
        try {
          const page = await pdfDoc.getPage(1);
          const viewport = page.getViewport({ scale: 1 });
          setPageAspectRatio(viewport.width / viewport.height);
        } catch (e) {
          // Fallback to a standard US Letter ratio
          setPageAspectRatio(8.5 / 11);
        }
      };
      getAspectRatio();
    }
  }, [pdfDoc]);

  const calculateOptimalDimensions = useCallback(() => {
    if (!containerRef.current || !pageAspectRatio) return;
    
    const parentContainer = containerRef.current.parentElement;
    if (!parentContainer) return;
    
    const isMobileView = parentContainer.clientWidth < 1024;
    setIsSinglePageView(isMobileView);
    
    // Calculate book aspect ratio (single page vs. double page spread)
    const bookAspectRatio = isMobileView ? pageAspectRatio : pageAspectRatio * 2;
    
    const containerWidth = parentContainer.clientWidth;
    const containerHeight = parentContainer.clientHeight;
    
    // Account for padding and margins
    const availableWidth = containerWidth - 40;
    const availableHeight = containerHeight - 40;
    
    // Calculate optimal dimensions
    let optimalWidth = availableWidth;
    let optimalHeight = optimalWidth / bookAspectRatio;
    
    // Adjust if height exceeds available space
    if (optimalHeight > availableHeight) {
      optimalHeight = availableHeight;
      optimalWidth = optimalHeight * bookAspectRatio;
    }
    
    // Apply minimum size constraints
    const MIN_WIDTH = 300;
    const MIN_HEIGHT = 400;
    
    if (optimalWidth < MIN_WIDTH) {
      optimalWidth = MIN_WIDTH;
      optimalHeight = optimalWidth / bookAspectRatio;
    }
    
    if (optimalHeight < MIN_HEIGHT) {
      optimalHeight = MIN_HEIGHT;
      optimalWidth = optimalHeight * bookAspectRatio;
    }
    
    // Ensure dimensions don't exceed available space
    optimalWidth = Math.min(optimalWidth, availableWidth);
    optimalHeight = Math.min(optimalHeight, availableHeight);
    
    setDimensions({ width: optimalWidth, height: optimalHeight });
  }, [pageAspectRatio]);

  useEffect(() => {
    const parentElement = containerRef.current?.parentElement;
    if (!parentElement) return;
  
    // Initial dimension calculation
    calculateOptimalDimensions();
  
    // Use ResizeObserver to detect when the container size changes
    const resizeObserver = new ResizeObserver(() => {
      calculateOptimalDimensions();
    });
  
    resizeObserver.observe(parentElement);
  
    // Fallback: if dimensions are still 0 after 1 second, set default dimensions
    const fallbackTimer = setTimeout(() => {
      if (dimensions.width === 0 && pageAspectRatio) {
        const parentContainer = containerRef.current?.parentElement;
        if (parentContainer) {
          const containerWidth = parentContainer.clientWidth;
          const containerHeight = parentContainer.clientHeight;
          
          // Calculate fallback dimensions that fit the container
          const availableWidth = Math.max(300, containerWidth - 40);
          const availableHeight = Math.max(400, containerHeight - 40);
          
          let fallbackWidth = availableWidth;
          let fallbackHeight = fallbackWidth / pageAspectRatio;
          
          // Adjust if height exceeds available space
          if (fallbackHeight > availableHeight) {
            fallbackHeight = availableHeight;
            fallbackWidth = fallbackHeight * pageAspectRatio;
          }
          
          setDimensions({ width: fallbackWidth, height: fallbackHeight });
        } else {
          // Ultimate fallback if no parent
          const defaultWidth = 800;
          const defaultHeight = defaultWidth / pageAspectRatio;
          setDimensions({ width: defaultWidth, height: defaultHeight });
        }
      }
    }, 1000);
  
    return () => {
      resizeObserver.unobserve(parentElement);
      clearTimeout(fallbackTimer);
    };
  }, [calculateOptimalDimensions, dimensions.width, pageAspectRatio]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader message="Loading PDF..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorDisplay 
          message={error.message || 'Error loading PDF'} 
          onRetry={retry} 
          retryText="Retry" 
        />
      </div>
    );
  }

  if (!pdfDoc) {
    return null;
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative">
      {dimensions.width > 0 ? (
        <div 
          style={{ 
            width: `${dimensions.width}px`, 
            height: `${dimensions.height}px`,
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          className="flex items-center justify-center"
        >
          <HTMLFlipBook
            ref={flipBookRef}
            width={isSinglePageView ? dimensions.width : dimensions.width / 2}
            height={dimensions.height}
            size="stretch"
            minWidth={Math.min(300, dimensions.width * 0.8)}
            maxWidth={Math.max(1000, dimensions.width)}
            minHeight={Math.min(400, dimensions.height * 0.8)}
            maxHeight={Math.max(1500, dimensions.height)}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            className="shadow-xl"
            flippingTime={800}
            drawShadow={true}
            usePortrait={isSinglePageView}
            startZIndex={0}
            autoSize={false}
            startPage={initialPage - 1}
            style={{
              width: '100%',
              height: '100%'
            }}
            clickEventForward={false}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            onFlip={(e: { data: number }) => {
              if (onPageChange) {
                const newPage = e.data + 1;
                onPageChange(newPage);
              }
            }}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page key={i} pageNum={i + 1} renderPage={renderPage} />
            ))}
          </HTMLFlipBook>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Calculating dimensions...</p>
        </div>
      )}
      {enableWatermark && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-600 bg-white/50 dark:bg-black/50 px-2 py-1 rounded">
          TrustedLogos
        </div>
      )}
    </div>
  );
});

FlipbookViewer.displayName = 'FlipbookViewer';

export default FlipbookViewer; 
