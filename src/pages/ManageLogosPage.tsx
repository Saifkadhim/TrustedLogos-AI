import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Download, Heart, Loader, Trash2, Edit3, X, Save } from 'lucide-react';
import { useLogos, type Logo, type UpdateLogoData } from '../hooks/useLogos-safe';
import { INDUSTRY_CATEGORIES, getIndustryCategoryList, getSubcategoriesForIndustry } from '../utils/industryCategories';
const ManageLogosPage = () => {
  const { 
    logos: allLogos, 
    loading, 
    error: hookError, 
    updateLogo, 
    deleteLogo,
    refreshLogos 
  } = useLogos();

  // Use logos from Supabase
  const [logos, setLogos] = useState<Logo[]>([]);
  
  // Sync with Supabase data
  useEffect(() => {
    setLogos(allLogos);
  }, [allLogos]);

  // Admin panel states
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
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
    secondary_color: '#ffffff'
  });

  // Logo types from the existing data
  const logoTypes = [
    'Wordmarks',
    'Lettermarks', 
    'Pictorial Marks',
    'Abstract Marks',
    'Combination Marks',
    'Emblem Logos',
    'Mascot Logos'
  ];

  // Industry categories
  const industryCategories = getIndustryCategoryList();

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'type', label: 'Type' },
    { value: 'industry', label: 'Industry' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'most-downloaded', label: 'Most Downloaded' }
  ];

  // Filter and sort logos
  const filteredLogos = logos
    .filter(logo => {
      const matchesSearch = logo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           logo.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           logo.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || logo.type === filterType;
      const matchesIndustry = filterIndustry === 'all' || logo.industry === filterIndustry;
      return matchesSearch && matchesType && matchesIndustry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'industry':
          return a.industry.localeCompare(b.industry);
        case 'most-liked':
          return (b.likes || 0) - (a.likes || 0);
        case 'most-downloaded':
          return (b.downloads || 0) - (a.downloads || 0);
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Export logos to CSV
  const exportLogos = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Type,Industry,Primary Color,Secondary Color,Shape,Downloads,Likes,Created\n"
      + filteredLogos.map(logo => 
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
        await deleteLogo(logoId);
        await refreshLogos(); // Refresh the list
      } catch (error) {
        console.error('Error deleting logo:', error);
        alert('Failed to delete logo. Please try again.');
      }
    }
  };

  // Start editing a logo
  const handleEditLogo = (logo: Logo) => {
    setEditingLogo(logo);
    setEditForm({
      name: logo.name,
      type: logo.type,
      industry_category: logo.industry,
      subcategory: logo.subcategory || '',
      logo_shape: logo.shape,
      description: logo.description || '',
      website_url: logo.websiteUrl || '',
      primary_color: logo.primaryColor,
      secondary_color: logo.secondaryColor || '#ffffff'
    });
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
      secondary_color: '#ffffff'
    });
  };

  // Save edited logo
  const handleSaveLogo = async () => {
    if (!editingLogo) return;

    try {
      const updateData: UpdateLogoData = {
        name: editForm.name,
        type: editForm.type,
        industry: editForm.industry_category,
        subcategory: editForm.subcategory || null,
        shape: editForm.logo_shape,
        description: editForm.description || null,
        websiteUrl: editForm.website_url || null,
        primaryColor: editForm.primary_color,
        secondaryColor: editForm.secondary_color
      };

      await updateLogo(editingLogo.id, updateData);
      await refreshLogos();
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Failed to update logo. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Logos</h1>
        <p className="text-gray-600 mt-2">View, search, and manage your logo collection</p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search logos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              {logoTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Industries</option>
              {industryCategories.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

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
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredLogos.length} of {logos.length} logos
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading logos...</p>
        </div>
      )}

      {/* Error State */}
      {hookError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error loading logos: {hookError}</p>
        </div>
      )}

      {/* No Logos State */}
      {!loading && !hookError && filteredLogos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No logos found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' || filterIndustry !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No logos have been uploaded yet'
            }
          </p>
        </div>
      )}

      {/* Logo Grid/List */}
      {!loading && !hookError && filteredLogos.length > 0 && (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredLogos.map((logo) => (
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
                      <span className="text-xs text-gray-500">
                        {new Date(logo.createdAt).toLocaleDateString()}
                      </span>
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
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
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
                    <span className="text-xs text-gray-500">
                      {new Date(logo.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleEditLogo(logo)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      title="Edit logo"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLogo(logo.id, logo.name)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
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

                {/* Logo Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {logoTypes.map((type) => (
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
                    {industryCategories.map((industry) => (
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

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <input
                      type="color"
                      value={editForm.primary_color}
                      onChange={(e) => setEditForm({...editForm, primary_color: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <input
                      type="color"
                      value={editForm.secondary_color}
                      onChange={(e) => setEditForm({...editForm, secondary_color: e.target.value})}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description"
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
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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