import React, { useState, useRef } from 'react';
import { Plus, Save, Trash2, Edit3, Eye, Copy, Download, Upload, Palette, Grid, List, Filter, Search, Star, Heart, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useColorPalettes, type ColorPalette, type CreateColorPaletteData, type UpdateColorPaletteData } from '../hooks/useColorPalettes';

const ColorPaletteAdminPage = () => {
  const { 
    palettes, 
    loading, 
    error, 
    addPalette, 
    updatePalette, 
    deletePalette,
    refreshPalettes 
  } = useColorPalettes(true); // Enable admin mode to fetch all palettes

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPalette, setEditingPalette] = useState<ColorPalette | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Form states for creating/editing palettes
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colors: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'],
    category: 'Other',
    tags: '',
    isPublic: true
  });

  const categories = [
    'Nature', 'Business', 'Creative', 'Vintage', 'Modern', 'Pastel', 
    'Bold', 'Monochrome', 'Gradient', 'Seasonal', 'Cultural', 'Other'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'downloads', label: 'Most Downloads' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  // Filter and sort palettes
  const filteredPalettes = React.useMemo(() => {
    let filtered = palettes.filter(palette => {
      const matchesCategory = filterCategory === 'all' || palette.category === filterCategory;
      const matchesSearch = palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           palette.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           palette.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    // Sort palettes
    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popular':
        return filtered.sort((a, b) => b.likes - a.likes);
      case 'downloads':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'alphabetical':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default: // newest
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [palettes, filterCategory, searchTerm, sortBy]);

  const handleCreatePalette = async () => {
    try {
      const paletteData: CreateColorPaletteData = {
        name: formData.name,
        description: formData.description,
        colors: formData.colors,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic: formData.isPublic
      };

      await addPalette(paletteData);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create palette:', error);
      alert('Failed to create palette: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEditPalette = (palette: ColorPalette) => {
    setEditingPalette(palette);
    setFormData({
      name: palette.name,
      description: palette.description || '',
      colors: [...palette.colors],
      category: palette.category,
      tags: palette.tags.join(', '),
      isPublic: palette.isPublic
    });
    setShowCreateModal(true);
  };

  const handleUpdatePalette = async () => {
    try {
      if (!editingPalette) return;
      
      const paletteData: UpdateColorPaletteData = {
        id: editingPalette.id,
        name: formData.name,
        description: formData.description,
        colors: formData.colors,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic: formData.isPublic
      };

      await updatePalette(paletteData);
      setShowCreateModal(false);
      setEditingPalette(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update palette:', error);
      alert('Failed to update palette: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeletePalette = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this palette?')) {
      try {
        await deletePalette(id);
      } catch (error) {
        console.error('Failed to delete palette:', error);
        alert('Failed to delete palette: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      colors: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'],
      category: 'Other',
      tags: '',
      isPublic: true
    });
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...formData.colors];
    newColors[index] = color;
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    if (formData.colors.length < 10) {
      setFormData(prev => ({ 
        ...prev, 
        colors: [...prev.colors, '#000000'] 
      }));
    }
  };

  const removeColor = (index: number) => {
    if (formData.colors.length > 2) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, colors: newColors }));
    }
  };

  const copyPaletteColors = (colors: string[]) => {
    const colorString = colors.join(', ');
    navigator.clipboard.writeText(colorString);
  };

  // Removed CSV export per request

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Palette className="h-6 w-6 text-purple-600 mr-2" />
              Color Palette Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage color palettes for the explore section ({filteredPalettes.length} palettes)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Export CSV removed per request */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Palette
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search palettes..."
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Palettes Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredPalettes.map((palette) => (
            <div
              key={palette.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
                viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Color Preview */}
                  <div className="h-24 flex">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 cursor-pointer hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Palette Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{palette.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{palette.description}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => copyPaletteColors(palette.colors)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Copy colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditPalette(palette)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                          title="Edit palette"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePalette(palette.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete palette"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {palette.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          palette.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {palette.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {palette.likes}
                        </span>
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {palette.downloads}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {palette.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {palette.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{palette.tags.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex h-12 w-24 rounded overflow-hidden">
                      {palette.colors.slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{palette.name}</h3>
                      <p className="text-sm text-gray-600">{palette.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {palette.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {palette.colors.length} colors
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {palette.likes}
                      </span>
                      <span className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {palette.downloads}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyPaletteColors(palette.colors)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditPalette(palette)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePalette(palette.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {filteredPalettes.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No palettes found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Create Your First Palette
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPalette ? 'Edit Palette' : 'Create New Palette'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPalette(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palette Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Ocean Breeze"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe the palette and its intended use..."
                  />
                </div>

                {/* Colors */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Colors ({formData.colors.length})
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={addColor}
                        disabled={formData.colors.length >= 10}
                        className="text-sm text-purple-600 hover:text-purple-700 disabled:text-gray-400"
                      >
                        + Add Color
                      </button>
                      {/* Create from image (fast) */}
                      <button
                        type="button"
                        className="text-sm px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        Create from image
                      </button>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          try {
                            // Draw image to canvas
                            const img = new Image();
                            await new Promise((resolve, reject) => {
                              img.onload = resolve;
                              img.onerror = reject;
                              img.src = url;
                            });
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            const targetW = 320;
                            const targetH = Math.max(1, Math.round((img.height / img.width) * targetW));
                            canvas.width = targetW;
                            canvas.height = targetH;
                            if (!ctx) return;
                            ctx.drawImage(img, 0, 0, targetW, targetH);
                            const imageData = ctx.getImageData(0, 0, targetW, targetH);
                            const pixels = [] as [number, number, number][];
                            for (let i = 0; i < imageData.data.length; i += 16) {
                              const r = imageData.data[i];
                              const g = imageData.data[i + 1];
                              const b = imageData.data[i + 2];
                              const a = imageData.data[i + 3];
                              if (a > 200) pixels.push([r, g, b]);
                            }
                            if (pixels.length === 0) return;
                            // Simple k-means (k=5)
                            const k = 5;
                            const centroids: [number, number, number][] = [];
                            for (let i = 0; i < k; i++) {
                              const p = pixels[Math.floor(Math.random() * pixels.length)];
                              centroids.push([p[0], p[1], p[2]]);
                            }
                            const distance = (a: [number, number, number], b: [number, number, number]) => {
                              const dr = a[0] - b[0];
                              const dg = a[1] - b[1];
                              const db = a[2] - b[2];
                              return dr * dr + dg * dg + db * db;
                            };
                            for (let iter = 0; iter < 6; iter++) {
                              const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);
                              for (const p of pixels) {
                                let best = 0, bestD = Infinity;
                                for (let c = 0; c < k; c++) {
                                  const d = distance(p, centroids[c]);
                                  if (d < bestD) { bestD = d; best = c; }
                                }
                                clusters[best].push(p);
                              }
                              for (let c = 0; c < k; c++) {
                                const cluster = clusters[c];
                                if (cluster.length === 0) continue;
                                let r = 0, g = 0, b = 0;
                                for (const p of cluster) { r += p[0]; g += p[1]; b += p[2]; }
                                centroids[c] = [Math.round(r / cluster.length), Math.round(g / cluster.length), Math.round(b / cluster.length)];
                              }
                            }
                            // Convert to hex
                            const toHex = (n: number) => n.toString(16).padStart(2, '0');
                            const hexColors = centroids.map(([r, g, b]) => `#${toHex(r)}${toHex(g)}${toHex(b)}`);
                            // Update form colors (unique and first 5)
                            const unique = Array.from(new Set(hexColors)).slice(0, 5);
                            setFormData(prev => ({ ...prev, colors: unique.length >= 5 ? unique : [...unique, ...prev.colors].slice(0, 5) }));
                          } finally {
                            URL.revokeObjectURL(url);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="relative">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                          className="w-full h-12 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                          className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                        />
                        {formData.colors.length > 2 && (
                          <button
                            onClick={() => removeColor(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., blue, ocean, cool, calming"
                  />
                </div>

                {/* Visibility */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Make this palette public</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPalette(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingPalette ? handleUpdatePalette : handleCreatePalette}
                    disabled={!formData.name.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingPalette ? 'Update Palette' : 'Create Palette'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteAdminPage;