import React, { useState } from 'react';
import { Search, Filter, Grid, List, Download, Heart, Eye, Star, Type, Palette, Tag, Copy, Share2, Bookmark, Zap, Sparkles, Clock, TrendingUp, Award } from 'lucide-react';

const FontsPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const [fontSize, setFontSize] = useState(32);
  const [favoritesFonts, setFavoritesFonts] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Sample font data - in a real app, this would come from an API
  const fonts = [
    {
      id: 1,
      name: 'Black North',
      designer: 'Letterhand Studio',
      category: 'Display',
      style: 'Bold',
      tags: ['modern', 'bold', 'display', 'headlines'],
      license: 'Personal Use Free',
      downloads: 15420,
      likes: 892,
      rating: 4.8,
      preview: 'BLACK NORTH',
      description: 'A bold, modern display font perfect for headlines and branding',
      formats: ['TTF', 'OTF', 'WOFF'],
      weights: ['Regular', 'Bold'],
      characters: 'A-Z, a-z, 0-9, punctuation',
      featured: true
    },
    {
      id: 2,
      name: 'Creamy Sugar',
      designer: 'Aesthetica Studio',
      category: 'Script',
      style: 'Handwritten',
      tags: ['script', 'handwritten', 'elegant', 'feminine'],
      license: 'Personal Use Free',
      downloads: 12350,
      likes: 756,
      rating: 4.6,
      preview: 'Creamy Sugar',
      description: 'An elegant handwritten script font with flowing curves',
      formats: ['TTF', 'OTF'],
      weights: ['Regular'],
      characters: 'A-Z, a-z, 0-9, punctuation',
      featured: false
    },
    {
      id: 3,
      name: 'Coffee Healing',
      designer: 'Isolotype',
      category: 'Script',
      style: 'Brush',
      tags: ['brush', 'casual', 'organic', 'natural'],
      license: 'Personal Use Free',
      downloads: 9876,
      likes: 543,
      rating: 4.5,
      preview: 'Coffee Healing',
      description: 'A casual brush script font with organic, natural feel',
      formats: ['TTF', 'WOFF'],
      weights: ['Regular'],
      characters: 'A-Z, a-z, 0-9, punctuation',
      featured: false
    },
    {
      id: 4,
      name: 'Sellena Brush',
      designer: 'Muksaicreative',
      category: 'Script',
      style: 'Brush',
      tags: ['brush', 'artistic', 'expressive', 'creative'],
      license: 'Personal Use Free',
      downloads: 8765,
      likes: 432,
      rating: 4.4,
      preview: 'Sellena Brush',
      description: 'An artistic brush script with expressive strokes',
      formats: ['TTF', 'OTF'],
      weights: ['Regular'],
      characters: 'A-Z, a-z, 0-9, punctuation',
      featured: false
    },
    {
      id: 5,
      name: 'Drip October',
      designer: 'Creativetacos',
      category: 'Display',
      style: 'Decorative',
      tags: ['decorative', 'drip', 'unique', 'artistic'],
      license: 'Personal Use Free',
      downloads: 7654,
      likes: 321,
      rating: 4.3,
      preview: 'Drip October',
      description: 'A unique decorative font with dripping effect',
      formats: ['TTF'],
      weights: ['Regular'],
      characters: 'A-Z, a-z, 0-9, punctuation',
      featured: false
    },
    {
      id: 6,
      name: 'Modern Sans Pro',
      designer: 'Type Foundry',
      category: 'Sans Serif',
      style: 'Modern',
      tags: ['sans-serif', 'modern', 'clean', 'professional'],
      license: 'Commercial License',
      downloads: 25430,
      likes: 1234,
      rating: 4.9,
      preview: 'Modern Sans Pro',
      description: 'A clean, modern sans-serif font family for professional use',
      formats: ['TTF', 'OTF', 'WOFF', 'WOFF2'],
      weights: ['Light', 'Regular', 'Medium', 'Bold', 'Black'],
      characters: 'A-Z, a-z, 0-9, punctuation, symbols',
      featured: true
    },
    {
      id: 7,
      name: 'Vintage Serif',
      designer: 'Classic Types',
      category: 'Serif',
      style: 'Vintage',
      tags: ['serif', 'vintage', 'classic', 'elegant'],
      license: 'Personal Use Free',
      downloads: 11200,
      likes: 678,
      rating: 4.7,
      preview: 'Vintage Serif',
      description: 'A classic vintage serif font with timeless elegance',
      formats: ['TTF', 'OTF'],
      weights: ['Regular', 'Bold'],
      characters: 'A-Z, a-z, 0-9, punctuation',
      featured: false
    },
    {
      id: 8,
      name: 'Tech Mono',
      designer: 'Code Fonts',
      category: 'Monospace',
      style: 'Technical',
      tags: ['monospace', 'code', 'technical', 'programming'],
      license: 'Open Source',
      downloads: 18900,
      likes: 945,
      rating: 4.8,
      preview: 'Tech Mono',
      description: 'A technical monospace font perfect for coding and development',
      formats: ['TTF', 'OTF', 'WOFF'],
      weights: ['Light', 'Regular', 'Bold'],
      characters: 'A-Z, a-z, 0-9, punctuation, symbols',
      featured: true
    }
  ];

  const categories = [
    'All', 'Sans Serif', 'Serif', 'Script', 'Display', 'Monospace', 'Handwritten', 'Decorative'
  ];

  const styles = [
    'All', 'Modern', 'Vintage', 'Bold', 'Light', 'Elegant', 'Casual', 'Technical', 'Artistic', 'Brush', 'Handwritten'
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'downloads', label: 'Most Downloads' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  // Filter and sort fonts
  const filteredFonts = React.useMemo(() => {
    let filtered = fonts.filter(font => {
      const matchesCategory = selectedCategory === 'all' || font.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStyle = selectedStyle === 'all' || font.style.toLowerCase() === selectedStyle.toLowerCase();
      const matchesSearch = font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           font.designer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           font.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFavorites = !showFavoritesOnly || favoritesFonts.includes(font.name);
      
      return matchesCategory && matchesStyle && matchesSearch && matchesFavorites;
    });

    // Sort fonts
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => b.id - a.id);
      case 'downloads':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'alphabetical':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default: // popular
        return filtered.sort((a, b) => b.likes - a.likes);
    }
  }, [fonts, selectedCategory, selectedStyle, searchTerm, sortBy, favoritesFonts, showFavoritesOnly]);

  const toggleFavorite = (fontName: string) => {
    setFavoritesFonts(prev => 
      prev.includes(fontName) 
        ? prev.filter(name => name !== fontName)
        : [...prev, fontName]
    );
  };

  const copyFontName = (fontName: string) => {
    navigator.clipboard.writeText(fontName);
  };

  const downloadFont = (font: any) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${font.name}`);
  };

  const featuredFonts = fonts.filter(font => font.featured);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Type className="h-6 w-6 text-purple-600 mr-2" />
              Font Library
            </h1>
            <p className="text-gray-600 mt-1">
              Discover and download beautiful fonts for your projects ({filteredFonts.length} fonts)
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">✨ Premium Collection</span>
          </div>
        </div>
      </div>

      {/* Featured Fonts Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Award className="h-6 w-6 mr-2" />
            Featured Fonts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredFonts.slice(0, 3).map((font) => (
              <div key={font.id} className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                  {font.preview}
                </div>
                <h3 className="font-semibold">{font.name}</h3>
                <p className="text-sm opacity-90">by {font.designer}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">{font.rating}</span>
                  <span className="text-sm opacity-75">• {font.downloads.toLocaleString()} downloads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>{category}</option>
              ))}
            </select>
          </div>

          {/* Style Filter */}
          <div>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {styles.map(style => (
                <option key={style} value={style.toLowerCase()}>{style}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Favorites Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center px-3 py-2 text-sm border rounded-lg transition-colors duration-200 ${
              showFavoritesOnly
                ? 'border-red-300 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`h-4 w-4 mr-1 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites ({favoritesFonts.length})
          </button>

          {/* View Mode */}
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Preview:</span>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm w-64"
              placeholder="Type your preview text..."
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Size:</span>
            <input
              type="range"
              min="16"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-500 w-8">{fontSize}px</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Fonts Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredFonts.map((font) => (
            <div
              key={font.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
                viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Font Preview */}
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div 
                      className="text-center text-gray-900 font-bold leading-tight"
                      style={{ 
                        fontSize: `${fontSize}px`,
                        fontFamily: 'serif' // In a real app, this would be the actual font
                      }}
                    >
                      {previewText}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{font.name}</h3>
                        <p className="text-sm text-gray-600">by {font.designer}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(font.name)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            favoritesFonts.includes(font.name)
                              ? 'text-red-600 bg-red-50 hover:bg-red-100'
                              : 'text-gray-400 hover:text-red-600 hover:bg-gray-50'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favoritesFonts.includes(font.name) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => copyFontName(font.name)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => downloadFont(font)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{font.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {font.category}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {font.style}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          font.license === 'Personal Use Free' 
                            ? 'bg-green-100 text-green-700' 
                            : font.license === 'Open Source'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {font.license}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                          {font.rating}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {font.likes}
                        </span>
                        <span className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {font.downloads.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs">
                        {font.formats.join(', ')} • {font.weights.join(', ')}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {font.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-32 h-16 bg-gray-50 rounded flex items-center justify-center">
                      <span 
                        className="font-bold text-gray-900"
                        style={{ fontFamily: 'serif', fontSize: '18px' }}
                      >
                        Aa
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{font.name}</h3>
                      <p className="text-sm text-gray-600">by {font.designer}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {font.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {font.license}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                        {font.rating}
                      </span>
                      <span className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {font.downloads.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFavorite(font.name)}
                        className={`p-2 rounded transition-colors duration-200 ${
                          favoritesFonts.includes(font.name)
                            ? 'text-red-600'
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${favoritesFonts.includes(font.name) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => copyFontName(font.name)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadFont(font)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredFonts.length === 0 && (
          <div className="text-center py-12">
            <Type className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fonts found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStyle('all');
                setShowFavoritesOnly(false);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Font Categories Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 text-purple-600 mr-2" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedCategory === category.toLowerCase()
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="font-medium">{category}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {fonts.filter(f => f.category.toLowerCase() === category.toLowerCase()).length} fonts
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontsPage;