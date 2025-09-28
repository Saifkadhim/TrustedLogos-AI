import { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { OutlineItem } from '../types/flipbook';

// Configure PDF.js worker to match the exact API version
console.log('PDF.js API version:', pdfjsLib.version);

// Always use the API version to ensure they match
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

console.log('PDF.js worker configured for version:', pdfjsLib.version);
console.log('Worker URL:', pdfjsLib.GlobalWorkerOptions.workerSrc);

// Add a timestamp to force cache refresh during development
if (import.meta.env.DEV) {
  const timestamp = Date.now();
  pdfjsLib.GlobalWorkerOptions.workerSrc += `?v=${timestamp}`;
  console.log('Development mode: Added cache-busting timestamp');
}

// LRU Cache implementation for performance optimization
class LruCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Increased cache sizes for better performance
const pageCache = new LruCache<string, string>(100); // Cache up to 100 rendered pages
const outlineCache = new LruCache<string, OutlineItem[]>(10); // Cache outlines for 10 PDFs

// Priority queue for page rendering
class PageRenderQueue {
  private queue: Array<{ pageNum: number; priority: number; resolve: (url: string | null) => void }> = [];
  private processing = false;

  add(pageNum: number, priority: number): Promise<string | null> {
    return new Promise((resolve) => {
      this.queue.push({ pageNum, priority, resolve });
      this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      // This will be handled by the actual renderPage function
      item.resolve(null);
      
      // Small delay to prevent blocking the UI
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this.processing = false;
  }
}

interface usePdfResult {
  pdfDoc: any | null;
  numPages: number;
  isLoading: boolean;
  error: Error | null;
  renderPage: (pageNum: number, priority?: number) => Promise<string | null>;
  getOutline: () => Promise<OutlineItem[]>;
  retry: () => void;
  loadingProgress: number;
}

export function usePdf(url: string | null): usePdfResult {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setPdfDoc(null);
    setLoadingProgress(0);
    pageCache.clear(); // Clear cache on retry
    setRetryCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      try {
        // Fetch PDF with progress tracking
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;

        const reader = response.body?.getReader();
        const chunks: Uint8Array[] = [];

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            if (total > 0) {
              setLoadingProgress(Math.round((loaded / total) * 50)); // First 50% for download
            }
          }
        }

        // Combine chunks
        const arrayBuffer = new Uint8Array(loaded);
        let position = 0;
        for (const chunk of chunks) {
          arrayBuffer.set(chunk, position);
          position += chunk.length;
        }

        setLoadingProgress(75); // 75% for parsing

        const loadingTask = pdfjsLib.getDocument({ 
          data: arrayBuffer.buffer,
          // Optimize PDF.js settings
          verbosity: 0, // Reduce console output
          maxImageSize: 16777216, // 16MB max image size
          disableFontFace: false,
          disableRange: false,
          disableStream: false
        });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setLoadingProgress(100);
        setIsLoading(false);
      } catch (e: any) {
        setError(e);
        setIsLoading(false);
        setLoadingProgress(0);
      }
    };

    loadPdf();

    return () => {
      setPdfDoc(null);
      setLoadingProgress(0);
      // Clean up blob URLs to prevent memory leaks
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url, retryCount]);

  const renderPage = useCallback(async (pageNum: number, priority: number = 1): Promise<string | null> => {
    if (!pdfDoc) return null;

    const cacheKey = `${url}-p${pageNum}`;
    const cachedPage = pageCache.get(cacheKey);
    if (cachedPage) {
      return cachedPage;
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      
      // Adaptive scaling based on viewport size and device pixel ratio
      const devicePixelRatio = window.devicePixelRatio || 1;
      const baseScale = Math.min(devicePixelRatio * 1.5, 2); // Cap at 2x for performance
      
      // Reduce scale for mobile devices to improve performance
      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? Math.min(baseScale, 1.5) : baseScale;
      
      const viewport = page.getViewport({ scale });
      
      // Use OffscreenCanvas if available for better performance
      let canvas: HTMLCanvasElement | OffscreenCanvas;
      let context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
      
      if (typeof OffscreenCanvas !== 'undefined' && !isMobile) {
        canvas = new OffscreenCanvas(viewport.width, viewport.height);
        context = canvas.getContext('2d')!;
      } else {
        canvas = document.createElement('canvas');
        context = (canvas as HTMLCanvasElement).getContext('2d')!;
        (canvas as HTMLCanvasElement).height = viewport.height;
        (canvas as HTMLCanvasElement).width = viewport.width;
      }

      if (!context) return null;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        // Optimize rendering
        intent: 'display',
        enableWebGL: false, // Disable WebGL for compatibility
        renderInteractiveForms: false,
        transform: null,
        background: 'white'
      };

      await page.render(renderContext).promise;
      
      // Convert to data URL with optimized quality
      let dataUrl: string;
      if (canvas instanceof OffscreenCanvas) {
        const blob = await canvas.convertToBlob({ 
          type: 'image/jpeg', 
          quality: 0.85 // Balanced quality/size ratio
        });
        dataUrl = URL.createObjectURL(blob);
      } else {
        dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      }
      
      pageCache.put(cacheKey, dataUrl);
      return dataUrl;

    } catch (e) {
      console.warn(`Failed to render page ${pageNum}:`, e);
      return null;
    }
  }, [pdfDoc, url]);
  
  const getOutline = useCallback(async (): Promise<OutlineItem[]> => {
    if (!pdfDoc || !url) return [];
    
    const cacheKey = `${url}-outline`;
    const cachedOutline = outlineCache.get(cacheKey);
    if (cachedOutline) {
      return cachedOutline;
    }

    try {
      const outline = await pdfDoc.getOutline();
      if (!outline) return [];

      const processItems = async (items: any[]): Promise<OutlineItem[]> => {
        if (!items) return [];
        const processedList: OutlineItem[] = [];

        for (const item of items) {
          let pageNumber = 1;
          if (item.dest) {
            try {
              // dest can be a string (named destination) or an array (explicit destination)
              const dest = typeof item.dest === 'string'
                ? await pdfDoc.getDestination(item.dest)
                : item.dest;
              
              if (dest && dest[0]) {
                // The first element of the destination array is the page reference
                const pageIndex = await pdfDoc.getPageIndex(dest[0]);
                pageNumber = pageIndex + 1;
              }
                    } catch (e) {
          // Silent error handling for outline item resolution
        }
          }

          processedList.push({
            title: item.title,
            pageNumber: pageNumber,
            items: await processItems(item.items),
          });
        }
        return processedList;
      };

      const processedOutline = await processItems(outline);
      outlineCache.put(cacheKey, processedOutline);
      return processedOutline;
    } catch (e) {
      return [];
    }
  }, [pdfDoc, url]);

  return {
    pdfDoc,
    numPages: pdfDoc?.numPages || 0,
    isLoading,
    error,
    renderPage,
    getOutline,
    retry,
    loadingProgress,
  };
} 
