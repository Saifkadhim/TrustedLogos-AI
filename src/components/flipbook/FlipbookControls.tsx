import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize, 
  Minimize,
  Image as ImageIcon,
  Code,
  BookOpen,
  X
} from 'lucide-react';
import type { FlipbookControlsProps } from '../../types/flipbook';

const ControlButton: React.FC<React.PropsWithChildren<{ 
  onClick: () => void; 
  title: string;
  disabled?: boolean;
}>> = ({ onClick, title, disabled = false, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-150 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={title}
  >
    {children}
  </button>
);

const FlipbookControls: React.FC<FlipbookControlsProps> = ({
  currentPage, 
  totalPages, 
  onPageChange, 
  onZoomChange, 
  onCenterView, 
  onToggleFullscreen,
  isFullscreen, 
  onToggleThumbnails, 
  onToggleEmbed,
  hasToc, 
  onToggleToc, 
  onPrevPage, 
  onNextPage
}) => {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let page = parseInt(inputValue, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    onPageChange(page);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  if (totalPages === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md p-2 flex items-center justify-between text-gray-700 dark:text-gray-300 relative">
      <div className="flex items-center space-x-2">
        <ControlButton onClick={onToggleThumbnails} title="Toggle Thumbnails">
          <ImageIcon size={20} />
        </ControlButton>
        {hasToc && (
          <ControlButton onClick={onToggleToc} title="Toggle Table of Contents">
            <BookOpen size={20} />
          </ControlButton>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center space-x-4">
        <ControlButton 
          onClick={onPrevPage} 
          title="Previous Page"
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={24} />
        </ControlButton>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Page</span>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleInputKeyPress}
            className="w-12 text-center bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Current page, ${currentPage} of ${totalPages}`}
          />
          <span className="text-sm">of {totalPages}</span>
        </div>

        <ControlButton 
          onClick={onNextPage} 
          title="Next Page"
          disabled={currentPage >= totalPages}
        >
          <ChevronRight size={24} />
        </ControlButton>

        <input
          type="range"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
          className="w-32 md:w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          aria-label="Page scrubber"
        />
      </div>

      <div className="flex items-center space-x-2">
        <ControlButton onClick={() => onZoomChange('out')} title="Zoom Out">
          <ZoomOut size={20} />
        </ControlButton>
        <ControlButton onClick={() => onZoomChange('in')} title="Zoom In">
          <ZoomIn size={20} />
        </ControlButton>
        <ControlButton onClick={onCenterView} title="Center View">
          <RotateCcw size={20} />
        </ControlButton>
        <ControlButton onClick={onToggleEmbed} title="Embed Flipbook">
          <Code size={20} />
        </ControlButton>
        <ControlButton onClick={onToggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </ControlButton>
      </div>
    </div>
  );
};

export default FlipbookControls; 