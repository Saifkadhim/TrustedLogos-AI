import React from 'react';
import { Copy, Download, Heart } from 'lucide-react';

interface BrandColor {
  hex: string;
  name?: string;
}

interface BrandPaletteCardProps {
  brandName: string;
  logoUrl?: string;
  colors: BrandColor[];
  onCopyPalette?: () => void;
  onDownload?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  className?: string;
}

const BrandPaletteCard: React.FC<BrandPaletteCardProps> = ({
  brandName,
  logoUrl,
  colors,
  onCopyPalette,
  onDownload,
  onLike,
  isLiked = false,
  className = ""
}) => {
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  const copyAllColors = () => {
    const colorString = colors.map(c => c.hex).join(', ');
    navigator.clipboard.writeText(colorString);
    onCopyPalette?.();
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group ${className}`}>
      {/* Brand Header */}
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{brandName}</h3>
        
        {/* Logo Display */}
        <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${brandName} logo`}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-gray-400 text-sm">No logo available</div>
          )}
        </div>
      </div>

      {/* Color Palette */}
      <div className="px-6 pb-6">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 h-16 cursor-pointer hover:scale-105 transition-transform duration-200 relative group/color"
              style={{ backgroundColor: color.hex }}
              onClick={() => copyToClipboard(color.hex)}
              title={`${color.name || 'Color'}: ${color.hex} - Click to copy`}
            >
              {/* Copy indicator on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/color:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <Copy className="h-4 w-4 text-white opacity-0 group-hover/color:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          ))}
        </div>

        {/* Color Codes */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-600 mb-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="text-center py-1 px-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => copyToClipboard(color.hex)}
            >
              {color.hex.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={copyAllColors}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Copy all colors"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy All
            </button>
            
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                title="Download palette"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            )}
          </div>

          {onLike && (
            <button
              onClick={onLike}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isLiked
                  ? 'text-red-500 hover:text-red-600 bg-red-50'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title={isLiked ? "Unlike" : "Like"}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandPaletteCard; 