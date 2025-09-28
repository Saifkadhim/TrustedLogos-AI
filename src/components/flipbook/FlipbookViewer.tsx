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
  const { pdfDoc, numPages, isLoading, error, renderPage, retry, loadingProgress } = usePdf(pdfUrl);
  
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

  const findSizedAncestor = (el: HTMLElement | null): HTMLElement | null => {
    let current: HTMLElement | null = el;
    while (current) {
      const { clientWidth, clientHeight } = current;
      const rect = current.getBoundingClientRect();
      if ((clientWidth > 0 && clientHeight > 0) || (rect.width > 0 && rect.height > 0)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  };

  const calculateOptimalDimensions = useCallback(() => {
    if (!containerRef.current || !pageAspectRatio) return;
    
    // Prefer the nearest ancestor with a real size
    const sizedAncestor = findSizedAncestor(containerRef.current.parentElement);
    const parentContainer = sizedAncestor || containerRef.current.parentElement;
    if (!parentContainer) return;
    
    // Detect fullscreen mode
    const isFullscreenMode = document.fullscreenElement !== null;
    
    // Determine single vs double page
    const isMobileView = (parentContainer.clientWidth || parentContainer.getBoundingClientRect().width) < 1024;
    setIsSinglePageView(isMobileView);
    const bookAspectRatio = isMobileView ? pageAspectRatio : pageAspectRatio * 2;
    
    // Compute available size with robust fallbacks
    const rect = parentContainer.getBoundingClientRect();
    const containerWidth = parentContainer.clientWidth || rect.width || window.innerWidth;
    const containerHeight = parentContainer.clientHeight || rect.height || window.innerHeight;
    
    const padding = isFullscreenMode ? 20 : 40;
    const availableWidth = Math.max(0, containerWidth - padding);
    const availableHeight = Math.max(0, containerHeight - padding);
    
    // If still zero (e.g., initial mount), fallback to viewport
    const safeWidth = availableWidth > 0 ? availableWidth : Math.max(320, window.innerWidth - padding);
    const safeHeight = availableHeight > 0 ? availableHeight : Math.max(400, window.innerHeight - padding);
    
    let optimalWidth = safeWidth;
    let optimalHeight = optimalWidth / bookAspectRatio;
    
    if (optimalHeight > safeHeight) {
      optimalHeight = safeHeight;
      optimalWidth = optimalHeight * bookAspectRatio;
    }
    
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

    setDimensions({ width: Math.floor(optimalWidth), height: Math.floor(optimalHeight) });
  }, [pageAspectRatio]);

  useEffect(() => {
    const parentElement = containerRef.current?.parentElement;
    if (!parentElement) return;
  
    // Initial calculation
    calculateOptimalDimensions();
  
    // Resize observer on the nearest sized ancestor if available
    const observedEl = findSizedAncestor(parentElement) || parentElement;
    const resizeObserver = new ResizeObserver(() => {
      calculateOptimalDimensions();
    });
    resizeObserver.observe(observedEl);

    // Listen to window resize and fullscreen
    const handleFullscreenChange = () => setTimeout(calculateOptimalDimensions, 50);
    const handleWindowResize = () => setTimeout(calculateOptimalDimensions, 50);

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleWindowResize);
  
    // Fallback timer
    const fallbackTimer = setTimeout(() => {
      if (dimensions.width === 0 && pageAspectRatio) {
        calculateOptimalDimensions();
      }
    }, 500);
  
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleWindowResize);
      clearTimeout(fallbackTimer);
    };
  }, [calculateOptimalDimensions, dimensions.width, pageAspectRatio]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader 
          message="Loading PDF..." 
          progress={loadingProgress}
          showProgress={true}
        />
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
