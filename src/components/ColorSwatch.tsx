import React, { useState } from 'react';
import { Check } from 'lucide-react';

// The 11 standard colors from /brands-logos filtering
export const STANDARD_COLORS = [
  { hex: '#000000', name: 'Black' },
  { hex: '#A66037', name: 'Brown' },
  { hex: '#E88C30', name: 'Orange' },
  { hex: '#E8E230', name: 'Yellow' },
  { hex: '#16C72E', name: 'Green' },
  { hex: '#30C9E8', name: 'Cyan' },
  { hex: '#4030E8', name: 'Blue' },
  { hex: '#8930E8', name: 'Purple' },
  { hex: '#E8308C', name: 'Pink' },
  { hex: '#E83A30', name: 'Red' },
  { hex: '#E86830', name: 'Orange-Red' }
];

interface ColorSwatchProps {
  selectedColor: string;
  onChange: (color: string) => void;
  label: string;
  allowCustom?: boolean;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  selectedColor, 
  onChange, 
  label, 
  allowCustom = true 
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor);

  // Check if selected color is one of the standard colors
  const isStandardColor = STANDARD_COLORS.some(color => color.hex === selectedColor);

  const handleColorSelect = (colorHex: string) => {
    onChange(colorHex);
    setShowCustomInput(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      
      {/* Standard Color Swatches */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">Choose from standard colors:</p>
        <div className="grid grid-cols-6 gap-2">
          {STANDARD_COLORS.map((color) => (
            <button
              key={color.hex}
              type="button"
              onClick={() => handleColorSelect(color.hex)}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                selectedColor === color.hex 
                  ? 'border-gray-900 ring-2 ring-blue-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColor === color.hex && (
                <Check 
                  className={`h-5 w-5 mx-auto ${
                    color.hex === '#000000' || color.hex === '#4030E8' || color.hex === '#8930E8'
                      ? 'text-white' 
                      : 'text-black'
                  }`} 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Option */}
      {allowCustom && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showCustomInput ? 'Hide custom color' : 'Use custom color'}
            </button>
            {!isStandardColor && !showCustomInput && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Custom color selected
              </span>
            )}
          </div>

          {showCustomInput && (
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onChange(e.target.value);
                }}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Selected Color Preview */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-gray-600">Selected:</span>
        <div 
          className="w-6 h-6 rounded border border-gray-300"
          style={{ backgroundColor: selectedColor }}
        ></div>
        <span className="text-xs font-mono text-gray-600">{selectedColor}</span>
      </div>
    </div>
  );
};

export default ColorSwatch;