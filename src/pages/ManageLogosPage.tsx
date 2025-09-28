import React, { useState, useEffect, useRef } from 'react';
import { Grid, List, Download, Heart, Trash2, Edit3, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { type Logo, type UpdateLogoData } from '../hooks/useLogos-safe';
import { useServerSideLogos } from '../hooks/useServerSideLogos';
import { getIndustryCategoryList, getSubcategoriesForIndustry } from '../utils/industryCategories';
import ColorSwatch from '../components/ColorSwatch';
import AIDescriptionHelper from '../components/AIDescriptionHelper';

import { ProfessionalPagination } from '../components/ProfessionalPagination';
import { EnhancedSearchFilters } from '../components/EnhancedSearchFilters';
import { LogoListStates } from '../components/LogoListStates';
import RichTextEditor from '../components/RichTextEditor';

// Helper function to safely render HTML content
const renderHTML = (html: string) => {
  return { __html: html };
};

const ManageLogosPage = () => {
  const { 
    logos,
    total,
    currentPage,
    pageSize,
    totalPages,
    hasNext,
    hasPrev,
    loading,
    error,
    filters,
    goToPage,
    changePageSize,
    updateFilters,
    clearFilters,
    refresh,
    updateLogoInState,
    updateLogo,
    removeLogoFromState,
    deleteLogo,
    isEmpty,
    startItem,
    endItem
  } = useServerSideLogos();

  // Admin panel states
  const [viewMode, setViewMode] = useState('grid');
  
  // Editing states
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    type: '',
    industry_category: '',
    subcategory: '',
    logo_shape: '',
    description: '',
    website_url: '',
    primary_color: '#000000',
    secondary_color: '#ffffff',
    show_in_brand_palettes: false,
    tags: '',
    brand_colors: [] as string[] // Added for brand colors
  });
  
    // Image upload states
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image file selection
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Image file size must be less than 5MB.');
        return;
      }
      
      setSelectedImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset image upload states
  const resetImageUpload = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  } | null>(null);

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  // Shape options for edit form
  const shapeOptions = [
    'Circular',
    'Square', 
    'Rectangular',
    'Triangular',
    'Organic',
    'Geometric',
    'Script',
    'Other'
  ];

  // Count active filters for display
  const activeFiltersCount = (filters.search ? 1 : 0) + 
    filters.type.length + 
    filters.industry.length + 
    filters.shape.length + 
    filters.colors.length;

  // Export logos to CSV (exports current page results)
  const exportLogos = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Type,Industry,Primary Color,Secondary Color,Shape,Downloads,Likes,Created\n"
      + logos.map(logo => 
          `"${logo.name}","${logo.type}","${logo.industry}","${logo.primaryColor}","${logo.secondaryColor || ''}","${logo.shape}","${logo.downloads || 0}","${logo.likes || 0}","${new Date(logo.createdAt).toLocaleDateString()}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trustedlogos_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete logo with confirmation
  const handleDeleteLogo = async (logoId: string, logoName: string) => {
    if (window.confirm(`Are you sure you want to delete "${logoName}"? This action cannot be undone.`)) {
      try {
        const success = await deleteLogo(logoId);
        if (success) {
    
          showNotification('success', `"${logoName}" has been deleted successfully`);
        } else {
          showNotification('error', 'Failed to delete logo. Please check the console for details.');
        }
      } catch (error) {
        // Handle delete error silently
        showNotification('error', 'Failed to delete logo. Please try again.');
      }
    }
  };

  // Start editing a logo
  const handleEditLogo = (logo: Logo) => {
    try {
      setEditingLogo(logo);
      setEditForm({
        name: logo.name || '',
        type: logo.type || '',
        industry_category: logo.industry || '',
        subcategory: logo.subcategory || '',
        logo_shape: logo.shape || '',
        description: logo.information || '',
        website_url: logo.designerUrl || '',
        primary_color: logo.primaryColor || '#000000',
        secondary_color: logo.secondaryColor || '#ffffff',
        show_in_brand_palettes: logo.showInBrandPalettes || false,
        tags: logo.tags ? logo.tags.join(', ') : '',
        brand_colors: logo.brandColors || [] // Initialize brand_colors
      });
      
      // Reset image upload states
      resetImageUpload();

    } catch (error) {
      // Handle edit error silently
      alert('Error opening edit form. Please try again.');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingLogo(null);
    setEditForm({
      name: '',
      type: '',
      industry_category: '',
      subcategory: '',
      logo_shape: '',
      description: '',
      website_url: '',
      primary_color: '#000000',
      secondary_color: '#ffffff',
      show_in_brand_palettes: false,
      tags: '',
      brand_colors: [] // Reset brand_colors
    });
    
    // Reset image upload states
    resetImageUpload();
  };

  // Save edited logo
  const handleSaveLogo = async () => {
    if (!editingLogo) {
      // No logo selected
      return;
    }

    try {
      const updateData = {
        id: editingLogo.id,
        name: editForm.name,
        type: editForm.type,
        industry: editForm.industry_category,
        subcategory: editForm.subcategory || undefined,
        shape: editForm.logo_shape,
        information: editForm.description || undefined,
        designerUrl: editForm.website_url || undefined,
        primaryColor: editForm.primary_color,
        secondaryColor: editForm.secondary_color,
        showInBrandPalettes: editForm.show_in_brand_palettes,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        brandColors: editForm.brand_colors, // Update brandColors
        imageFile: selectedImageFile || undefined
      };
      
      // Update logo in database
      const success = await updateLogo(updateData);
      
      if (success) {
        showNotification('success', `"${editForm.name}" has been updated successfully${selectedImageFile ? ' with new image' : ''}`);
        handleCancelEdit();
      } else {
        showNotification('error', 'Failed to update logo. Please check the console for details.');
      }
    } catch (error) {
      // Handle update error silently
      alert(`Failed to update logo. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Logos</h1>
            <p className="text-gray-600 mt-2">
              View, search, and manage your logo collection
              <span className="ml-2 inline-flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                🕒 Default: Newest uploads shown first
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">


          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}



      {/* Enhanced Search and Filters */}
      <EnhancedSearchFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        loading={loading}
        className="mb-6"
      />

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Export */}
            <button
              onClick={exportLogos}
              className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>

            {/* View Mode */}
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600">
            Showing {logos.length} of {total.toLocaleString()} total logos
            {filters.sortBy === 'created_at' && filters.sortOrder === 'desc' && (
              <span className="ml-2 text-green-600 font-medium">• Newest First</span>
            )}
          </div>
        </div>
      </div>

      {/* Logo List States */}
      <LogoListStates
        loading={loading}
        error={error}
        isEmpty={isEmpty}
        totalItems={total}
        searchTerm={filters.search}
        activeFilters={activeFiltersCount}
        className="mb-6"
      />

      {/* Logo Grid/List */}
      {!loading && !error && logos.length > 0 && (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
            : 'space-y-4'
        }`}>
          {logos.map((logo) => (
            <div key={logo.id} className={`${
              viewMode === 'grid'
                ? 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200'
                : 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200'
            }`}>
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View */}
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                    {logo.imageUrl ? (
                      <img
                        src={logo.imageUrl}
                        alt={logo.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-300">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                                      <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate" title={logo.name}>
                        {logo.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{logo.type}</p>
                      <p className="text-sm text-gray-500 truncate">{logo.industry}</p>
                      {logo.information && (
                        <div className="mt-2 text-xs text-gray-600 line-clamp-3">
                          <div 
                            dangerouslySetInnerHTML={renderHTML(logo.information)}
                            className="prose prose-xs max-w-none"
                          />
                        </div>
                      )}

                      {/* Tags */}
                      {logo.tags && logo.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {logo.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {logo.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{logo.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: logo.primaryColor }}
                          title={logo.primaryColor}
                        />
                        {logo.secondaryColor && (
                          <div
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: logo.secondaryColor }}
                            title={logo.secondaryColor}
                          />
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Heart className="h-3 w-3 mr-1" />
                          {logo.likes || 0}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Download className="h-3 w-3 mr-1" />
                          {logo.downloads || 0}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          Uploaded: {new Date(logo.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(logo.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditLogo(logo)}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                          title="Edit logo"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLogo(logo.id, logo.name)}
                          disabled={loading}
                          className={`text-red-500 hover:text-red-700 transition-colors duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete logo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-16 w-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {logo.imageUrl ? (
                        <img
                          src={logo.imageUrl}
                          alt={logo.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-300">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{logo.name}</h3>
                      <p className="text-sm text-gray-600">{logo.type} • {logo.industry}</p>
                      {logo.information && (
                        <div className="mt-1 text-xs text-gray-600 line-clamp-2">
                          <div 
                            dangerouslySetInnerHTML={renderHTML(logo.information)}
                            className="prose prose-xs max-w-none"
                          />
                        </div>
                      )}
                      
                      {/* Tags */}
                      {logo.tags && logo.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {logo.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                          {logo.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{logo.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded border border-gray-300"
                            style={{ backgroundColor: logo.primaryColor }}
                            title={logo.primaryColor}
                          />
                          <span className="text-xs text-gray-500">{logo.primaryColor}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Heart className="h-3 w-3 mr-1" />
                          {logo.likes || 0}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Download className="h-3 w-3 mr-1" />
                          {logo.downloads || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(logo.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(logo.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditLogo(logo)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      title="Edit logo"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLogo(logo.id, logo.name)}
                      disabled={loading}
                      className={`text-red-500 hover:text-red-700 transition-colors duration-200 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete logo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Professional Pagination */}
      <ProfessionalPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        loading={loading}
        className="mt-8"
      />

      {/* Edit Modal */}
      {editingLogo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Logo</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Logo Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Logo Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image</label>
                  
                  {/* Current Image Preview */}
                  {editingLogo?.imageUrl && !imagePreviewUrl && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-2">Current Image:</div>
                      <div className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                        <img 
                          src={editingLogo.imageUrl} 
                          alt={editingLogo.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* New Image Preview */}
                  {imagePreviewUrl && (
                    <div className="mb-3">
                      <div className="text-xs text-green-600 mb-2">New Image Preview:</div>
                      <div className="w-32 h-32 border border-green-300 rounded-lg flex items-center justify-center bg-green-50 overflow-hidden">
                        <img 
                          src={imagePreviewUrl} 
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {selectedImageFile ? 'Change Image' : 'Upload New Image'}
                    </button>
                    
                    {selectedImageFile && (
                      <button
                        type="button"
                        onClick={resetImageUpload}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {selectedImageFile && (
                    <div className="mt-2 text-xs text-gray-600">
                      Selected: {selectedImageFile.name} ({(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  
                  <div className="mt-1 text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
                  </div>
                </div>

                {/* Logo Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {['Wordmarks', 'Lettermarks', 'Pictorial Marks', 'Abstract Marks', 'Combination Marks', 'Emblem Logos', 'Mascot Logos'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Industry Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry Category</label>
                  <select
                    value={editForm.industry_category}
                    onChange={(e) => {
                      setEditForm({...editForm, industry_category: e.target.value, subcategory: ''});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select industry</option>
                    {getIndustryCategoryList().map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                {editForm.industry_category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                    <select
                      value={editForm.subcategory}
                      onChange={(e) => setEditForm({...editForm, subcategory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select subcategory (optional)</option>
                      {getSubcategoriesForIndustry(editForm.industry_category).map((sub) => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Logo Shape */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Shape</label>
                  <select
                    value={editForm.logo_shape}
                    onChange={(e) => setEditForm({...editForm, logo_shape: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select shape</option>
                    {shapeOptions.map((shape) => (
                      <option key={shape} value={shape}>{shape}</option>
                    ))}
                  </select>
                </div>

                {/* Brand Colors Palette */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors (up to 6)</label>
                  <div className="space-y-3">
                    {/* Editor rows */}
                    {(Array.isArray((editForm as any).brand_colors) ? (editForm as any).brand_colors : []).map((hex: string, index: number) => (
                      <div key={index} className="grid grid-cols-5 gap-3 items-center">
                        <input
                          type="color"
                          value={hex || '#000000'}
                          onChange={(e) => {
                            const next = [ ...((editForm as any).brand_colors || []) ];
                            next[index] = e.target.value;
                            setEditForm({ ...(editForm as any), brand_colors: next });
                          }}
                          className="h-10 w-full border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={hex || ''}
                          onChange={(e) => {
                            const value = e.target.value.trim();
                            const next = [ ...((editForm as any).brand_colors || []) ];
                            next[index] = value;
                            setEditForm({ ...(editForm as any), brand_colors: next });
                          }}
                          placeholder="#000000"
                          className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = [ ...((editForm as any).brand_colors || []) ].filter((_, i) => i !== index);
                            setEditForm({ ...(editForm as any), brand_colors: next });
                          }}
                          className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const next = [ ...((editForm as any).brand_colors || []) ];
                          if (next.length < 6) {
                            next.push('#000000');
                            setEditForm({ ...(editForm as any), brand_colors: next });
                          }
                        }}
                        className="px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                      >
                        + Add Color
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          // Initialize if empty using current primary/secondary as a starting point
                          const seeds = [] as string[];
                          if (editForm.primary_color) seeds.push(editForm.primary_color);
                          if (editForm.secondary_color) seeds.push(editForm.secondary_color);
                          setEditForm({ ...(editForm as any), brand_colors: (editForm as any).brand_colors?.length ? (editForm as any).brand_colors : seeds });
                        }}
                        className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Use Primary/Secondary as start
                      </button>
                    </div>

                    <div className="text-xs text-gray-500">
                      Tip: You can add up to 6 colors. Click color box to pick or paste hex.
                    </div>
                  </div>
                </div>

                {/* Company Background & Logo Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Company Background & Logo Description</label>
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      ✅ Rich Text Editor
                    </div>
                  </div>
                  
                  <RichTextEditor
                    value={editForm.description}
                    onChange={(description) => setEditForm({...editForm, description})}
                    placeholder="Company information, logo history, design analysis, and strengths. Use the toolbar above to format your text with headings, lists, bold, italic, and more."
                    className="mb-4"
                  />
                  
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
                    💡 <strong>Rich Text Editor:</strong> Use the toolbar above to format your description with headings, lists, bold text, colors, and more. Your formatting will be preserved.
                  </div>
                  
                  {/* AI Description Helper */}
                  <AIDescriptionHelper
                    logoName={editForm.name}
                    currentDescription={editForm.description}
                    onDescriptionGenerated={(description) => setEditForm({...editForm, description})}
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={editForm.website_url}
                    onChange={(e) => setEditForm({...editForm, website_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., modern, tech, blue, minimalist"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter tags separated by commas to help users find this logo
                  </p>
                </div>

                {/* Brand Palettes Visibility */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="show_in_brand_palettes"
                      checked={editForm.show_in_brand_palettes}
                      onChange={(e) => setEditForm({...editForm, show_in_brand_palettes: e.target.checked})}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label htmlFor="show_in_brand_palettes" className="text-sm font-medium text-blue-900 cursor-pointer">
                        Show in Brand Palettes Page
                      </label>
                      <p className="text-xs text-blue-700 mt-1">
                        When enabled, this logo will appear in the <strong>/brand-palettes</strong> page for users to discover brand color inspirations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLogo}
                  disabled={loading}
                  className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? (selectedImageFile ? 'Uploading Image...' : 'Saving...') : 'Save Changes'}
                </button>
              </div>
                                      </div>
                     </div>
        </div>
      )}


    </div>
  );
};

export default ManageLogosPage;