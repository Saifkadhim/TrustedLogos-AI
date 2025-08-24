import React, { useState, useMemo } from 'react';
import { Palette, Copy, Download, Heart, Eye, Sparkles, Info } from 'lucide-react';
import { generateCuratedPalettes, COLOR_CATEGORIES, getColorAccessibility, type ColorPalette } from '../utils/colorAnalysis';
import { useLogos } from '../hooks/useLogos-safe';

interface ColorPaletteExplorerProps {
  className?: string;
}

const ColorPaletteExplorer: React.FC<ColorPaletteExplorerProps> = ({ className = '' }) => {
  const { logos } = useLogos();
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);

  // Generate palettes from existing logos
  const colorPalettes = useMemo(() => {
    if (logos.length === 0) return [];
    return generateCuratedPalettes(logos);
  }, [logos]);

  // Filter palettes by category
  const filteredPalettes = useMemo(() => {
    if (activeCategory === 'All') return colorPalettes;
    return colorPalettes.filter(palette => palette.category === activeCategory);
  }, [colorPalettes, activeCategory]);

  // Get available categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(colorPalettes.map(p => p.category))];
    return cats;
  }, [colorPalettes]);

  // Copy color to clipboard
  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  // Download palette as CSS variables
  const downloadPalette = (palette: ColorPalette) => {
    const cssVariables = palette.colors.map((color, index) => 
      `  --color-${palette.name.toLowerCase().replace(/\s+/g, '-')}-${index + 1}: ${color};`
    ).join('\n');
    
    const cssContent = `:root {\n${cssVariables}\n}`;
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (logos.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading color palettes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Color Palette Explorer</h2>
          <p className="text-gray-600">Discover popular color combinations from successful brands</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Palette className="h-4 w-4" />
          <span>{colorPalettes.length} Palettes</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeCategory === category
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Color Psychology Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
          Color Psychology Guide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(COLOR_CATEGORIES).map(([name, info]) => (
            <div key={name} className="text-center">
              <div className="flex space-x-1 mb-2 justify-center">
                {info.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <h4 className="font-medium text-gray-900 text-sm">{name}</h4>
              <p className="text-xs text-gray-500 mt-1">{info.usage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPalettes.map((palette) => (
          <div
            key={palette.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 group"
          >
            {/* Color Swatches */}
            <div className="flex h-24">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 relative cursor-pointer group/color transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => copyColor(color)}
                  title={`Click to copy ${color}`}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/color:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Copy className={`h-4 w-4 text-white opacity-0 group-hover/color:opacity-100 transition-opacity duration-200 ${
                      copiedColor === color ? 'text-green-300' : ''
                    }`} />
                  </div>
                  {copiedColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                        Copied!
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Palette Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{palette.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {palette.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{palette.description}</p>
              
              <div className="text-xs text-gray-500 mb-3">
                <strong>Usage:</strong> {palette.usage}
              </div>

              {/* Color Codes */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {palette.colors.slice(0, 4).map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono text-gray-600">{color}</span>
                  </div>
                ))}
              </div>

              {/* Example Logos */}
              {palette.logos.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Used by:</h4>
                  <div className="flex space-x-2">
                    {palette.logos.slice(0, 3).map((logo, index) => (
                      <div key={index} className="flex-1">
                        {logo.imageUrl ? (
                          <img
                            src={logo.imageUrl}
                            alt={logo.name}
                            className="w-full h-8 object-contain bg-gray-50 rounded border"
                          />
                        ) : (
                          <div
                            className="w-full h-8 rounded border flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: logo.primaryColor }}
                          >
                            {logo.name.charAt(0)}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 text-center mt-1 truncate">
                          {logo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => downloadPalette(palette)}
                    className="flex items-center text-xs text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    CSS
                  </button>
                  <button
                    onClick={() => setSelectedPalette(palette)}
                    className="flex items-center text-xs text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    Details
                  </button>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Heart className="h-3 w-3 mr-1" />
                  {palette.popularity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPalettes.length === 0 && (
        <div className="text-center py-12">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No palettes found</h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      )}

      {/* Palette Detail Modal */}
      {selectedPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedPalette.name}</h3>
                <button
                  onClick={() => setSelectedPalette(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Large Color Display */}
              <div className="flex rounded-lg overflow-hidden mb-6 h-32">
                {selectedPalette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 relative cursor-pointer group"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex flex-col items-center justify-center">
                      <Copy className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="text-white text-sm font-mono mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {color}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Color Accessibility */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Accessibility Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPalette.colors.slice(0, 2).map((color, index) => {
                    const accessibility = getColorAccessibility(color);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-mono text-sm">{color}</span>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">
                            Contrast Ratio: <span className="font-medium">{accessibility.contrast}:1</span>
                          </p>
                          <p className="text-gray-600">
                            WCAG Rating: <span className={`font-medium ${
                              accessibility.rating === 'AAA' ? 'text-green-600' :
                              accessibility.rating === 'AA' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {accessibility.rating}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => downloadPalette(selectedPalette)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSS
                </button>
                <button
                  onClick={() => setSelectedPalette(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteExplorer;