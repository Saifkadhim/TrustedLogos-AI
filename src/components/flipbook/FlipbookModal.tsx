import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import FlipbookViewer from './FlipbookViewer';
import FlipbookControls from './FlipbookControls';
import ThumbnailRail from './ThumbnailRail';
import { usePdf } from '../../hooks/usePdf';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { FlipbookViewerProps, FlipbookViewerActions, ReadingDirection, OutlineItem } from '../../types/flipbook';

interface FlipbookModalProps extends FlipbookViewerProps {
  // Additional props specific to the modal
}

const FlipbookModal: React.FC<FlipbookModalProps> = ({ 
  pdfUrl, 
  title, 
  onClose, 
  enableWatermark = true, 
  readingDirection = 'ltr', 
  initialPage = 1,
  theme = 'light'
}) => {
  const { numPages, renderPage, getOutline } = usePdf(pdfUrl);
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(1); // Default zoom at 100% for better fullscreen fit
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  
  // State for panning
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const flipbookContainerRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<FlipbookViewerActions>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(flipbookContainerRef);
  
  // Persist last viewed page for this PDF
  const [lastViewedPage, setLastViewedPage] = useLocalStorage(`flipbook-page-${pdfUrl}`, initialPage);

  useEffect(() => {
    const fetchOutline = async () => {
      const toc = await getOutline();
      setOutline(toc);
    };
    fetchOutline();
  }, [getOutline]);

  useEffect(() => {
    setLastViewedPage(currentPage);
  }, [currentPage, setLastViewedPage]);

  // Try to enter fullscreen automatically on open
  useEffect(() => {
    let cleaned = false;

    const requestFs = async () => {
      try {
        if (!document.fullscreenElement && flipbookContainerRef.current) {
          await flipbookContainerRef.current.requestFullscreen();
        }
      } catch (e) {
        // Browser likely blocked due to no user gesture; fallback below
      }
    };

    // Attempt immediately
    requestFs();

    // Fallback: on first user interaction, request fullscreen
    const onFirstInteract = () => {
      if (!document.fullscreenElement && flipbookContainerRef.current) {
        flipbookContainerRef.current.requestFullscreen().catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      window.removeEventListener('pointerdown', onFirstInteract, true);
      window.removeEventListener('keydown', onFirstInteract, true);
      window.removeEventListener('touchstart', onFirstInteract, true);
    };

    window.addEventListener('pointerdown', onFirstInteract, true);
    window.addEventListener('keydown', onFirstInteract, true);
    window.addEventListener('touchstart', onFirstInteract, true);

    // Also clean up when we do enter fullscreen
    const onFsChange = () => {
      if (document.fullscreenElement) cleanup();
    };
    document.addEventListener('fullscreenchange', onFsChange);

    return () => {
      cleanup();
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, []);

  // Sync current page with flipbook when it changes externally
  useEffect(() => {
    if (flipbookRef.current && numPages > 0) {
      // Ensure the flipbook starts at the correct page
      const targetPage = Math.max(1, Math.min(currentPage, numPages));
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      }
    }
  }, [numPages, currentPage]);

  // Preload nearby pages for better performance
  useEffect(() => {
    if (!numPages || numPages === 0) return;

    const preloadPages = async () => {
      const pagesToPreload = [];
      
      // Preload current page and nearby pages
      const preloadRange = 2; // Preload 2 pages before and after current page
      
      for (let i = Math.max(1, currentPage - preloadRange); 
           i <= Math.min(numPages, currentPage + preloadRange); 
           i++) {
        if (i !== currentPage) { // Current page is already loading/loaded
          pagesToPreload.push(i);
        }
      }
      
      // Preload with lower priority
      pagesToPreload.forEach((pageNum, index) => {
        setTimeout(() => {
          renderPage(pageNum, 0.5); // Lower priority for preloading
        }, index * 100); // Stagger the preloading
      });
    };

    // Delay preloading to not interfere with current page loading
    const preloadTimer = setTimeout(preloadPages, 500);
    
    return () => clearTimeout(preloadTimer);
  }, [currentPage, numPages, renderPage]);

  const navigateToPage = (targetPage: number) => {
    if (currentPage !== targetPage && targetPage >= 1 && targetPage <= numPages) {
      setCurrentPage(targetPage);
      
      // Reset view state on page change
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
      
      // Navigate flipbook to target page
      if (flipbookRef.current) {
        try {
          flipbookRef.current.turnToPage(targetPage);
        } catch (error) {
          // Silent error handling for navigation failures
        }
      }
    }
  };
  
  const handleTocItemClick = useCallback((page: number) => {
    navigateToPage(page);
    setShowToc(false);
  }, []);

  const handleZoomChange = (direction: 'in' | 'out') => {
    // Allow zooming out to 50%
    const newZoom = direction === 'in' ? Math.min(zoom + 0.2, 3) : Math.max(zoom - 0.2, 0.5);
    setZoom(newZoom);
    // When zooming out to the default level or smaller, reset the pan offset
    if (newZoom <= 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  };
  
  const handleCenterView = () => {
    // Center view resets to 100% (fit to container)
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };
  
  const handleToggleFullscreen = () => {
    toggleFullscreen();
    // Reset zoom and pan when toggling fullscreen for better UX
    setTimeout(() => {
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    }, 100);
  };

  const handleToggleEmbed = () => {
    setShowEmbedModal(s => !s);
  };

  const handlePrevPage = () => {
    if (readingDirection === 'ltr') {
      flipbookRef.current?.flipPrev();
    } else {
      flipbookRef.current?.flipNext();
    }
  };

  const handleNextPage = () => {
    if (readingDirection === 'ltr') {
      flipbookRef.current?.flipNext();
    } else {
      flipbookRef.current?.flipPrev();
    }
  };

  // Panning Event Handlers
  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom <= 1) return;
    
    // Stop the event from propagating to the underlying flipbook
    e.stopPropagation();

    if (e.cancelable) e.preventDefault();
    setIsPanning(true);
    const point = 'touches' in e ? e.touches[0] : e;
    panStartRef.current = { x: point.clientX - panOffset.x, y: point.clientY - panOffset.y };
  };

  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning || zoom <= 1) return;
    if (e.cancelable) e.preventDefault();

    const mainElement = (e.currentTarget as HTMLElement);
    const point = 'touches' in e ? e.touches[0] : e;
    if (!point) return;

    // Calculate how much the content overhangs the container
    const contentWidth = mainElement.offsetWidth;
    const contentHeight = mainElement.offsetHeight;
    const maxPanX = Math.max(0, (contentWidth * zoom - contentWidth) / 2);
    const maxPanY = Math.max(0, (contentHeight * zoom - contentHeight) / 2);

    // Calculate new raw offset
    let newX = point.clientX - panStartRef.current.x;
    let newY = point.clientY - panStartRef.current.y;
    
    // Clamp the offset to the boundaries
    newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
    newY = Math.max(-maxPanY, Math.min(maxPanY, newY));

    setPanOffset({ x: newX, y: newY });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4" onClick={() => {
      // As an extra safeguard, try entering fullscreen if user clicks the backdrop
      if (!document.fullscreenElement && flipbookContainerRef.current) {
        flipbookContainerRef.current.requestFullscreen().catch(() => {});
      }
    }}>
      <div 
        ref={flipbookContainerRef}
        className={`bg-white dark:bg-gray-900 shadow-2xl w-full overflow-hidden flex flex-col ${
          isFullscreen 
            ? 'h-full max-w-full max-h-full rounded-none' 
            : 'h-[95vh] max-w-[95vw] rounded-lg'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <main 
          className={`flex-1 overflow-hidden relative min-h-0`}
        >
          {/* Zoom/Pan wrapper */}
          <div
            className="w-full h-full"
            style={{ 
              transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.3s ease-in-out',
              cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
              userSelect: isPanning ? 'none' : 'auto',
            }}
            onMouseDownCapture={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            onTouchStartCapture={handlePanStart}
            onTouchMove={handlePanMove}
            onTouchEnd={handlePanEnd}
          >
            <FlipbookViewer
              ref={flipbookRef}
              pdfUrl={pdfUrl}
              title={title}
              onClose={onClose}
              enableWatermark={enableWatermark}
              readingDirection={readingDirection}
              initialPage={currentPage}
              theme={theme}
              onPageChange={navigateToPage}
            />
          </div>
        </main>

        {/* Thumbnail Rail */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showThumbnails && numPages > 0 ? 'max-h-32' : 'max-h-0'}`}>
          <ThumbnailRail
            numPages={numPages}
            currentPage={currentPage}
            onThumbnailClick={navigateToPage}
            renderPage={renderPage}
          />
        </div>

        {/* Controls */}
        <FlipbookControls
          currentPage={currentPage}
          totalPages={numPages}
          onPageChange={navigateToPage}
          onZoomChange={handleZoomChange}
          onCenterView={handleCenterView}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
          onToggleThumbnails={() => setShowThumbnails(s => !s)}
          onToggleEmbed={handleToggleEmbed}
          hasToc={outline.length > 0}
          onToggleToc={() => setShowToc(s => !s)}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />

        {/* Table of Contents */}
        {showToc && (
          <div className="absolute top-16 left-4 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Table of Contents</h3>
            </div>
            <div className="p-2">
              {outline.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleTocItemClick(item.pageNumber)}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Embed Modal */}
        {showEmbedModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Embed Flipbook</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Copy this code to embed the flipbook on your website:
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs font-mono text-gray-800 dark:text-gray-200 mb-4 overflow-x-auto">
                {`<iframe src="${window.location.origin}/flipbook?pdf=${encodeURIComponent(pdfUrl)}" width="100%" height="600" frameborder="0"></iframe>`}
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlipbookModal; 
