import React, { useState, useCallback, useMemo } from 'react';
import { Palette, Copy, RefreshCw, Download, Heart, Shuffle, Lock, Unlock, Eye, EyeOff, Upload, Image as ImageIcon, X, Search } from 'lucide-react';
import { useColorPalettes } from './hooks/useColorPalettes';

interface Color {
  hex: string;
  name: string;
  locked: boolean;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  liked: boolean;
  likes?: number;
  tags?: string[];
}

const ColorPalettePage = () => {
  const { palettes: dbPalettes, loading, error } = useColorPalettes();
  
  const [currentPalette, setCurrentPalette] = useState<Color[]>([
    { hex: '#FF6B6B', name: 'Coral Red', locked: false },
    { hex: '#4ECDC4', name: 'Turquoise', locked: false },
    { hex: '#45B7D1', name: 'Sky Blue', locked: false },
    { hex: '#96CEB4', name: 'Mint Green', locked: false },
    { hex: '#FFEAA7', name: 'Warm Yellow', locked: false }
  ]);

  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([
    {
      id: '1',
      name: 'Ocean Breeze',
      colors: [
        { hex: '#0077BE', name: 'Ocean Blue', locked: false },
        { hex: '#00A8CC', name: 'Cyan', locked: false },
        { hex: '#7FDBDA', name: 'Light Teal', locked: false },
        { hex: '#A8E6CF', name: 'Mint', locked: false },
        { hex: '#FFD93D', name: 'Sunshine', locked: false }
      ],
      liked: true
    },
    {
      id: '2',
      name: 'Sunset Vibes',
      colors: [
        { hex: '#FF6B35', name: 'Orange Red', locked: false },
        { hex: '#F7931E', name: 'Orange', locked: false },
        { hex: '#FFD23F', name: 'Golden', locked: false },
        { hex: '#EE4B2B', name: 'Scarlet', locked: false },
        { hex: '#C21807', name: 'Dark Red', locked: false }
      ],
      liked: false
    }
  ]);

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'image' | 'explore' | 'saved'>('explore');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<Color[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState('Popular');

  // Filter options
  const colorFilters = [
    { name: 'Red', color: '#EF4444' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Brown', color: '#A3A3A3' },
    { name: 'Yellow', color: '#EAB308' },
    { name: 'Green', color: '#22C55E' },
    { name: 'Turquoise', color: '#06B6D4' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Violet', color: '#8B5CF6' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Gray', color: '#6B7280' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#FFFFFF' }
  ];

  const styleFilters = [
    'Warm', 'Cold', 'Bright', 'Dark', 'Pastel', 'Vintage',
    'Monochromatic', 'Gradient', 'Rainbow', '2 Colors', '3 Colors',
    '4 Colors', '5 Colors', '6 Colors'
  ];

  const topicFilters = [
    'Christmas', 'Halloween', 'Pride', 'Sunset', 'Spring', 'Winter',
    'Summer', 'Autumn', 'Gold', 'Wedding', 'Party', 'Space',
    'Kids', 'Nature', 'City', 'Food', 'Happy', 'Water', 'Relax'
  ];

  const orderOptions = ['Trending', 'Latest', 'Popular'];

  // Convert database palettes to explore format
  const explorePalettes: ColorPalette[] = useMemo(() => {
    return dbPalettes.map(dbPalette => ({
      id: dbPalette.id,
      name: dbPalette.name,
      colors: dbPalette.colors.map((hex, index) => ({
        hex,
        name: `Color ${index + 1}`,
        locked: false
      })),
      liked: false,
      likes: dbPalette.likes,
      tags: dbPalette.tags
    }));
  }, [dbPalettes]);

  // Filter palettes based on search and filters
  const filteredExplorePalettes = useMemo(() => {
    return explorePalettes.filter(palette => {
      // Search query filter
      if (searchQuery && !palette.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !palette.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasMatchingColor = selectedColors.some(filterColor => 
          palette.tags?.some(tag => tag.toLowerCase().includes(filterColor.toLowerCase()))
        );
        if (!hasMatchingColor) return false;
      }

      // Style filter
      if (selectedStyles.length > 0) {
        const hasMatchingStyle = selectedStyles.some(style => 
          palette.tags?.some(tag => tag.toLowerCase().includes(style.toLowerCase()))
        );
        if (!hasMatchingStyle) return false;
      }

      // Topic filter
      if (selectedTopics.length > 0) {
        const hasMatchingTopic = selectedTopics.some(topic => 
          palette.tags?.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
        );
        if (!hasMatchingTopic) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (selectedOrder) {
        case 'Latest':
          return parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]);
        case 'Trending':
          return (b.likes || 0) - (a.likes || 0);
        case 'Popular':
        default:
          return (b.likes || 0) - (a.likes || 0);
      }
    });
  }, [searchQuery, selectedColors, selectedStyles, selectedTopics, selectedOrder]);

  // Handle filter changes
  const handleFilterChange = (filterType: 'colors' | 'styles' | 'topics', value: string) => {
    switch (filterType) {
      case 'colors':
        setSelectedColors(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'styles':
        setSelectedStyles(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'topics':
        setSelectedTopics(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedColors([]);
    setSelectedStyles([]);
    setSelectedTopics([]);
  };

  // Load explore palette
  const loadExplorePalette = (palette: ColorPalette) => {
    setCurrentPalette(palette.colors.map(color => ({ ...color, locked: false })));
    setActiveTab('generator');
  };

  // Save explore palette
  const saveExplorePalette = (palette: ColorPalette) => {
    const newPalette: ColorPalette = {
      ...palette,
      id: Date.now().toString(),
      liked: false
    };
    setSavedPalettes(prev => [newPalette, ...prev]);
  };

  // Color distance calculation for clustering
  const colorDistance = (color1: [number, number, number], color2: [number, number, number]): number => {
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;
    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  // Generate color name based on RGB values
  const generateColorNameFromRGB = (r: number, g: number, b: number): string => {
    const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI;
    const lightness = (r + g + b) / 3;
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    
    let colorName = '';
    let descriptor = '';
    
    // Determine base color name based on hue
    if (saturation < 30) {
      if (lightness < 60) colorName = 'Charcoal';
      else if (lightness < 120) colorName = 'Gray';
      else if (lightness < 200) colorName = 'Silver';
      else colorName = 'White';
    } else {
      const normalizedHue = ((hue % 360) + 360) % 360;
      if (normalizedHue < 15 || normalizedHue >= 345) colorName = 'Red';
      else if (normalizedHue < 45) colorName = 'Orange';
      else if (normalizedHue < 75) colorName = 'Yellow';
      else if (normalizedHue < 105) colorName = 'Lime';
      else if (normalizedHue < 135) colorName = 'Green';
      else if (normalizedHue < 165) colorName = 'Teal';
      else if (normalizedHue < 195) colorName = 'Cyan';
      else if (normalizedHue < 225) colorName = 'Blue';
      else if (normalizedHue < 255) colorName = 'Indigo';
      else if (normalizedHue < 285) colorName = 'Purple';
      else if (normalizedHue < 315) colorName = 'Magenta';
      else colorName = 'Pink';
    }
    
    // Add descriptor based on lightness and saturation
    if (lightness < 80) descriptor = 'Dark';
    else if (lightness > 180) descriptor = 'Light';
    else if (saturation > 100) descriptor = 'Vivid';
    else if (saturation < 50) descriptor = 'Muted';
    else descriptor = 'Rich';
    
    return descriptor ? `${descriptor} ${colorName}` : colorName;
  };

  // K-means clustering for color quantization
  const kMeansColors = (pixels: [number, number, number][], k: number = 5): [number, number, number][] => {
    if (pixels.length === 0) return [];
    
    // Initialize centroids randomly
    let centroids: [number, number, number][] = [];
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push([...randomPixel]);
    }
    
    let iterations = 0;
    const maxIterations = 20;
    
    while (iterations < maxIterations) {
      // Assign pixels to nearest centroid
      const clusters: [number, number, number][][] = Array(k).fill(null).map(() => []);
      
      pixels.forEach(pixel => {
        let minDistance = Infinity;
        let closestCentroid = 0;
        
        centroids.forEach((centroid, index) => {
          const distance = colorDistance(pixel, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = index;
          }
        });
        
        clusters[closestCentroid].push(pixel);
      });
      
      // Update centroids
      const newCentroids: [number, number, number][] = [];
      let hasChanged = false;
      
      clusters.forEach((cluster, index) => {
        if (cluster.length === 0) {
          newCentroids.push(centroids[index]);
        } else {
          const avgR = cluster.reduce((sum, pixel) => sum + pixel[0], 0) / cluster.length;
          const avgG = cluster.reduce((sum, pixel) => sum + pixel[1], 0) / cluster.length;
          const avgB = cluster.reduce((sum, pixel) => sum + pixel[2], 0) / cluster.length;
          
          const newCentroid: [number, number, number] = [avgR, avgG, avgB];
          newCentroids.push(newCentroid);
          
          if (colorDistance(centroids[index], newCentroid) > 1) {
            hasChanged = true;
          }
        }
      });
      
      centroids = newCentroids;
      
      if (!hasChanged) break;
      iterations++;
    }
    
    // Sort centroids by cluster size (most dominant colors first)
    const clustersWithSizes = centroids.map((centroid, index) => {
      const clusterSize = pixels.filter(pixel => {
        let minDistance = Infinity;
        let closestIndex = 0;
        
        centroids.forEach((c, i) => {
          const distance = colorDistance(pixel, c);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        });
        
        return closestIndex === index;
      }).length;
      
      return { centroid, size: clusterSize };
    });
    
    return clustersWithSizes
      .sort((a, b) => b.size - a.size)
      .map(item => item.centroid);
  };

  // Generate random hex color
  const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  // Generate color name based on hex
  const generateColorName = (hex: string): string => {
    const colorNames = [
      'Ruby', 'Emerald', 'Sapphire', 'Coral', 'Mint', 'Lavender', 'Peach', 'Teal',
      'Crimson', 'Azure', 'Jade', 'Amber', 'Rose', 'Violet', 'Indigo', 'Chartreuse',
      'Magenta', 'Cyan', 'Maroon', 'Navy', 'Olive', 'Silver', 'Gold', 'Bronze'
    ];
    
    const descriptors = [
      'Deep', 'Light', 'Bright', 'Dark', 'Soft', 'Vivid', 'Pale', 'Rich',
      'Warm', 'Cool', 'Muted', 'Bold', 'Gentle', 'Intense', 'Subtle', 'Electric'
    ];

    const randomName = colorNames[Math.floor(Math.random() * colorNames.length)];
    const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
    
    return `${randomDescriptor} ${randomName}`;
  };

  // Generate new palette
  const generateNewPalette = useCallback(() => {
    setCurrentPalette(prev => prev.map(color => 
      color.locked 
        ? color 
        : { 
            hex: generateRandomColor(), 
            name: generateColorName(''), 
            locked: false 
          }
    ));
  }, []);

  // Generate single color
  const generateSingleColor = (index: number) => {
    if (currentPalette[index].locked) return;
    
    setCurrentPalette(prev => prev.map((color, i) => 
      i === index 
        ? { hex: generateRandomColor(), name: generateColorName(''), locked: false }
        : color
    ));
  };

  // Toggle color lock
  const toggleColorLock = (index: number) => {
    setCurrentPalette(prev => prev.map((color, i) => 
      i === index ? { ...color, locked: !color.locked } : color
    ));
  };

  // Copy color to clipboard
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Save current palette
  const savePalette = () => {
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name: `Palette ${savedPalettes.length + 1}`,
      colors: [...currentPalette],
      liked: false
    };
    setSavedPalettes(prev => [newPalette, ...prev]);
  };

  // Load saved palette
  const loadPalette = (palette: ColorPalette) => {
    setCurrentPalette(palette.colors.map(color => ({ ...color, locked: false })));
    setActiveTab('generator');
  };

  // Toggle palette like
  const togglePaletteLike = (paletteId: string) => {
    setSavedPalettes(prev => prev.map(palette => 
      palette.id === paletteId 
        ? { ...palette, liked: !palette.liked }
        : palette
    ));
  };

  // Delete saved palette
  const deletePalette = (paletteId: string) => {
    setSavedPalettes(prev => prev.filter(palette => palette.id !== paletteId));
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        extractColorsFromImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract colors from image (simplified version - in real app would use canvas/image processing)
  const extractColorsFromImage = async (imageUrl: string) => {
    setIsExtracting(true);
    
    try {
      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });
      
      // Create canvas and get image data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Resize image for faster processing (max 200px on longest side)
      const maxSize = 200;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels: [number, number, number][] = [];
      
      // Sample pixels (every 4th pixel for performance)
      for (let i = 0; i < imageData.data.length; i += 16) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const alpha = imageData.data[i + 3];
        
        // Skip transparent pixels
        if (alpha > 128) {
          pixels.push([r, g, b]);
        }
      }
      
      if (pixels.length === 0) {
        throw new Error('No valid pixels found in image');
      }
      
      // Extract dominant colors using k-means clustering
      const dominantColors = kMeansColors(pixels, 5);
      
      // Convert to Color objects
      const extractedColors: Color[] = dominantColors.map(([r, g, b]) => ({
        hex: rgbToHex(r, g, b),
        name: generateColorNameFromRGB(r, g, b),
        locked: false
      }));
      
      setExtractedPalette(extractedColors);
      
    } catch (error) {
      console.error('Error extracting colors:', error);
      
      // Fallback to sample colors if extraction fails
      const fallbackColors = [
        { hex: '#87CEEB', name: 'Sky Blue', locked: false },
        { hex: '#FF6B9D', name: 'Sunset Pink', locked: false },
        { hex: '#4682B4', name: 'Steel Blue', locked: false },
        { hex: '#FFB347', name: 'Peach Orange', locked: false },
        { hex: '#2F4F4F', name: 'Dark Slate', locked: false }
      ];
      
      setExtractedPalette(fallbackColors);
    } finally {
      setIsExtracting(false);
    }
  };

  // Use extracted palette
  const useExtractedPalette = () => {
    setCurrentPalette(extractedPalette.map(color => ({ ...color, locked: false })));
    setActiveTab('generator');
  };

  // Clear uploaded image
  const clearImage = () => {
    setUploadedImage(null);
    setExtractedPalette([]);
  };

  // Export palette as PNG image with color values
  const exportPalette = () => {
    const width = 1200;
    const height = 630;
    const padding = 40;
    const stripeGap = 8;
    const stripeHeight = 360;
    const numColors = Math.max(1, currentPalette.length);
    const stripeWidth = (width - padding * 2 - stripeGap * (numColors - 1)) / numColors;

    const getContrastColor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance > 0.6 ? '#111827' : '#ffffff';
    };

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 34px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Color Palette', padding, padding);

    // Draw color stripes with hex overlay
    currentPalette.forEach((color, index) => {
      const x = padding + index * (stripeWidth + stripeGap);
      const y = padding + 50; // leave room for title

      // Stripe
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, y, stripeWidth, stripeHeight);

      // Hex overlay
      ctx.fillStyle = getContrastColor(color.hex);
      ctx.font = 'bold 26px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(color.hex.toUpperCase(), x + stripeWidth / 2, y + stripeHeight / 2);

      // Name label under stripe
      if (color.name) {
        ctx.fillStyle = '#111827';
        ctx.font = '18px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(color.name, x + stripeWidth / 2, y + stripeHeight + 16);
      }
    });

    // Footer note
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('trustedlogos — generated palette', width - padding, height - padding);

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `palette-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Palette className="h-6 w-6 text-purple-600 mr-2" />
              Color Palette Generator
            </h1>
            <p className="text-gray-600 mt-1">
              Create beautiful color combinations for your designs
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'explore'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'image'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              From Image
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'generator'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'saved'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Saved ({savedPalettes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {activeTab === 'generator' ? (
          <div className="max-w-6xl mx-auto">
            {/* Current Palette Display */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="flex h-64">
                {currentPalette.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 relative group cursor-pointer transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => generateSingleColor(index)}
                  >
                    {/* Lock Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleColorLock(index);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-30"
                    >
                      {color.locked ? (
                        <Lock className="h-4 w-4 text-white" />
                      ) : (
                        <Unlock className="h-4 w-4 text-white" />
                      )}
                    </button>

                    {/* Color Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <div className="text-white">
                        <div className="font-medium text-sm mb-1">{color.name}</div>
                        <div className="text-xs opacity-90 font-mono">{color.hex}</div>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(color.hex);
                      }}
                      className="absolute top-3 left-3 p-2 bg-black bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-30"
                    >
                      {copiedColor === color.hex ? (
                        <span className="text-white text-xs font-medium">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4 text-white" />
                      )}
                    </button>

                    {/* Locked Indicator */}
                    {color.locked && (
                      <div className="absolute inset-0 border-4 border-yellow-400 border-dashed pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                onClick={generateNewPalette}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Generate New Palette
              </button>

              <button
                onClick={savePalette}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Heart className="h-5 w-5 mr-2" />
                Save Palette
              </button>

              <button
                onClick={exportPalette}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Image
              </button>
            </div>

            {/* Color Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {currentPalette.map((color, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg mb-3 border border-gray-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="space-y-1">
                      <div className="font-medium text-sm text-gray-900">{color.name}</div>
                      <div className="font-mono text-xs text-gray-600">{color.hex}</div>
                      <div className="font-mono text-xs text-gray-500">
                        RGB({parseInt(color.hex.slice(1, 3), 16)}, {parseInt(color.hex.slice(3, 5), 16)}, {parseInt(color.hex.slice(5, 7), 16)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Click on any color to regenerate just that color</li>
                <li>• Use the lock icon to keep colors you like while generating new ones</li>
                <li>• Save palettes you love for future reference</li>
                <li>• Export palettes as JSON to use in your design tools</li>
              </ul>
            </div>
          </div>
        ) : activeTab === 'image' ? (
          /* Image to Palette */
          <div className="max-w-6xl mx-auto">
            {!uploadedImage ? (
              /* Upload Area */
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Extract Colors from Image
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload an image and we'll automatically extract a beautiful color palette from it
                  </p>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Image
                    </div>
                  </label>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              /* Image Analysis */
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Uploaded Image</h3>
                    <button
                      onClick={clearImage}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="relative max-w-2xl mx-auto">
                      <img
                        src={uploadedImage}
                        alt="Uploaded for color extraction"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                      {isExtracting && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="bg-white rounded-lg p-4 flex items-center">
                            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin mr-2" />
                            <span className="text-gray-900 font-medium">Extracting colors...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extracted Palette */}
                {extractedPalette.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Extracted Color Palette</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Colors automatically extracted from your image
                      </p>
                    </div>
                    
                    {/* Palette Display */}
                    <div className="flex h-32">
                      {extractedPalette.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 relative group cursor-pointer transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyToClipboard(color.hex)}
                        >
                          {/* Color Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                            <div className="text-white">
                              <div className="font-medium text-xs mb-1">{color.name}</div>
                              <div className="text-xs opacity-90 font-mono">{color.hex}</div>
                            </div>
                          </div>

                          {/* Copy Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(color.hex);
                            }}
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-30"
                          >
                            {copiedColor === color.hex ? (
                              <span className="text-white text-xs font-medium">✓</span>
                            ) : (
                              <Copy className="h-3 w-3 text-white" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Click any color to copy its hex code
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            const newPalette: ColorPalette = {
                              id: Date.now().toString(),
                              name: `Image Palette ${savedPalettes.length + 1}`,
                              colors: extractedPalette,
                              liked: false
                            };
                            setSavedPalettes(prev => [newPalette, ...prev]);
                          }}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Save Palette
                        </button>
                        <button
                          onClick={useExtractedPalette}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          <Palette className="h-4 w-4 mr-2" />
                          Use in Generator
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* How it Works */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    How Image Color Extraction Works
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-800 font-bold text-xs">1</span>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Upload Image</div>
                        <div className="text-blue-700">Choose any image with colors you love</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-800 font-bold text-xs">2</span>
                      </div>
                      <div>
                        <div className="font-medium mb-1">AI Analysis</div>
                        <div className="text-blue-700">Our AI identifies dominant colors</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-blue-800 font-bold text-xs">3</span>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Perfect Palette</div>
                        <div className="text-blue-700">Get a harmonious 5-color palette</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'explore' ? (
          /* Explore Palettes */
          <div className="w-full">
            {/* Search Bar - Full Width to Match Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {/* Search Input - Takes most space */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search with colors, topics, styles or hex values..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                  
                  {/* Order Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                    <select
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white min-w-[120px]"
                    >
                      {orderOptions.map((order) => (
                        <option key={order} value={order}>{order}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Clear Filters Button */}
                  {(searchQuery || selectedColors.length > 0 || selectedStyles.length > 0 || selectedTopics.length > 0) && (
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 whitespace-nowrap border border-red-200"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filters Row - Collapsible */}
              <div className="border-t border-gray-200 p-6 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colors Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {colorFilters.map((colorFilter) => (
                      <button
                        key={colorFilter.name}
                        onClick={() => handleFilterChange('colors', colorFilter.name)}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          selectedColors.includes(colorFilter.name)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: colorFilter.color }}
                        />
                        {colorFilter.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Styles Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {styleFilters.map((style) => (
                      <button
                        key={style}
                        onClick={() => handleFilterChange('styles', style)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                          selectedStyles.includes(style)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topics Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {topicFilters.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleFilterChange('topics', topic)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                          selectedTopics.includes(topic)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredExplorePalettes.length} Color Palettes
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Discover beautiful color combinations from the community
                </p>
              </div>
            </div>

            {/* Palettes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExplorePalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  {/* Palette Preview */}
                  <div className="flex h-32 cursor-pointer" onClick={() => loadExplorePalette(palette)}>
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 relative group-hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: color.hex }}
                      >
                        {/* Color hex on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <span className="text-white text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {color.hex}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Palette Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">{palette.name}</h3>
                      <div className="flex items-center text-gray-500">
                        <Heart className="h-4 w-4 mr-1" />
                        <span className="text-xs">
                          {palette.likes && palette.likes > 1000 
                            ? `${(palette.likes / 1000).toFixed(1)}K`
                            : palette.likes
                          }
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {palette.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {(palette.tags?.length || 0) > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{(palette.tags?.length || 0) - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadExplorePalette(palette)}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors duration-200"
                      >
                        Use Palette
                      </button>
                      <button
                        onClick={() => saveExplorePalette(palette)}
                        className="px-3 py-2 text-gray-600 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredExplorePalettes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No palettes found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters to find more palettes.</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Saved Palettes */
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Palette Preview */}
                  <div className="flex h-32">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>

                  {/* Palette Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{palette.name}</h3>
                      <button
                        onClick={() => togglePaletteLike(palette.id)}
                        className={`p-1 rounded transition-colors duration-200 ${
                          palette.liked
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${palette.liked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex space-x-1 mb-3">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-gray-200 cursor-pointer hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} - ${color.hex}`}
                          onClick={() => copyToClipboard(color.hex)}
                        />
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => loadPalette(palette)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deletePalette(palette.id)}
                        className="px-3 py-2 text-red-600 text-sm border border-red-200 rounded hover:bg-red-50 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {savedPalettes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved palettes</h3>
                <p className="text-gray-500 mb-4">Create and save your first color palette to see it here.</p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Start Creating
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPalettePage;