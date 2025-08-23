import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Eye, Download, Star, Heart, Loader, Edit3, Trash2 } from 'lucide-react';
import { useLogos, type Logo, type UpdateLogoData } from '../hooks/useLogos-safe';
import { INDUSTRY_CATEGORIES, getIndustryCategoryList } from '../utils/industryCategories';

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
  const [editingLogo, setEditingLogo] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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
                      <button
                        onClick={() => handleDeleteLogo(logo.id, logo.name)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Delete logo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
    </div>
  );
};

export default ManageLogosPage;