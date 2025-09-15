export type Theme = 'light' | 'dark';
export type ReadingDirection = 'ltr' | 'rtl';

export interface FlipbookViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
  enableWatermark?: boolean;
  readingDirection?: ReadingDirection;
  initialPage?: number;
  theme?: Theme;
  onPageChange?: (page: number) => void;
}

export interface FlipbookViewerActions {
  flipPrev: () => void;
  flipNext: () => void;
  turnToPage: (pageIndex: number) => void;
}

export interface OutlineItem {
  title: string;
  pageNumber: number;
  items: OutlineItem[];
}

export interface FlipbookControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onZoomChange: (direction: 'in' | 'out') => void;
  onCenterView: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onToggleThumbnails: () => void;
  onToggleEmbed: () => void;
  hasToc: boolean;
  onToggleToc: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export interface ThumbnailRailProps {
  numPages: number;
  currentPage: number;
  onThumbnailClick: (page: number) => void;
  renderPage: (pageNum: number) => Promise<string | null>;
}

export interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  outline: OutlineItem[];
  onItemClick: (page: number) => void;
}

export interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
}

export interface PageProps {
  pageNum: number;
  renderPage: (pageNum: number) => Promise<string | null>;
}

export interface LoaderProps {
  message?: string;
}

export interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  retryText?: string;
}

// Note: pdfjsLib is already declared globally in the main FlipbookViewer component 