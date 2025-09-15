import { useState, useEffect, useCallback } from 'react';
import type { OutlineItem } from '../types/flipbook';

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
}

// Cache instances for performance
const pageCache = new LruCache<string, string>(50); // Cache up to 50 rendered pages
const outlineCache = new LruCache<string, OutlineItem[]>(5); // Cache outlines for 5 PDFs

interface usePdfResult {
  pdfDoc: any | null;
  numPages: number;
  isLoading: boolean;
  error: Error | null;
  renderPage: (pageNum: number) => Promise<string | null>;
  getOutline: () => Promise<OutlineItem[]>;
  retry: () => void;
}

export function usePdf(url: string | null): usePdfResult {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setPdfDoc(null);
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
      try {
        // Fetch PDF from URL first, then pass to PDF.js
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setIsLoading(false);
      } catch (e: any) {
        setError(e);
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      setPdfDoc(null);
      // Clean up blob URLs to prevent memory leaks
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url, retryCount]);

  const renderPage = useCallback(async (pageNum: number): Promise<string | null> => {
    if (!pdfDoc) return null;

    const cacheKey = `${url}-p${pageNum}`;
    const cachedPage = pageCache.get(cacheKey);
    if (cachedPage) {
      return cachedPage;
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      const scale = 2; // High-DPI rendering for crisp display
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      pageCache.put(cacheKey, dataUrl);
      return dataUrl;

    } catch (e) {
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
  };
} 
