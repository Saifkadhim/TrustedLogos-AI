import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLogos, type LogoFilters } from './hooks/useLogos-safe';
import LogoModal from './components/LogoModal';
import { INDUSTRY_CATEGORIES } from './utils/industryCategories';
import SEO from './components/SEO';
import { useSearchParams } from 'react-router-dom';

// Helper function to safely render HTML content
const renderHTML = (html: string) => {
  return { __html: html };
};

const AllImagesPage = () => {
  const { 
    logos: allLogos, 
    loading, 
    error, 
    incrementDownloads, 
    incrementLikes,
    fetchLogosWithFilters,
    totalLogos 
  } = useLogos();

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 98; // 7 columns × 14 rows = 98 logos per page

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogoTypes, setSelectedLogoTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Server-side filtering state
  const [filteredLogos, setFilteredLogos] = useState<any[]>([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [filteredHasMore, setFilteredHasMore] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // Filter dropdown visibility state
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [colorFilterOpen, setColorFilterOpen] = useState(false);
  const [shapeFilterOpen, setShapeFilterOpen] = useState(false);

  const [searchParams] = useSearchParams();
  
  // Modal state
  const [selectedLogo, setSelectedLogo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle URL parameters for category selection
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      const validCategories = INDUSTRY_CATEGORIES.map(c => c.name);
      if (validCategories.includes(decodedCategory)) {
        setActiveCategory(decodedCategory);
        setActiveSubcategory('All');
      }
    }
  }, [searchParams]);

  // Modal handlers
  const openModal = (logo: any) => {
    setSelectedLogo(logo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLogo(null);
    setIsModalOpen(false);
  };

  const handleDownload = async (logoId: string) => {
    try {
      await incrementDownloads(logoId);

    } catch (error) {
      // Handle download error silently
    }
  };

  const handleLike = async (logoId: string) => {
    try {
      await incrementLikes(logoId);

    } catch (error) {
      // Handle like error silently
    }
  };

  // Server-side filtering function
  const applyFilters = useCallback(async (page: number = 1) => {
    setFilterLoading(true);
    // Close all filter dropdowns
    setTypeFilterOpen(false);
    setColorFilterOpen(false);
    setShapeFilterOpen(false);
    
    try {
      const filters: LogoFilters = {
        searchQuery: searchQuery || undefined,
        selectedTypes: selectedLogoTypes.length > 0 ? selectedLogoTypes : undefined,
        selectedColors: selectedColors.length > 0 ? selectedColors : undefined,
        selectedShapes: selectedShapes.length > 0 ? selectedShapes : undefined,
        activeCategory: activeCategory !== 'All' ? activeCategory : undefined,
        activeSubcategory: activeSubcategory !== 'All' ? activeSubcategory : undefined,
        sortBy: 'created_at'
      };

      const result = await fetchLogosWithFilters(filters, page, itemsPerPage);
      
      setFilteredLogos(result.logos);
      setFilteredTotal(result.total);
      setFilteredHasMore(result.hasMore);
      setCurrentPage(page);
      
    } catch (error) {
      // Handle filter error silently
      setFilteredLogos([]);
      setFilteredTotal(0);
      setFilteredHasMore(false);
    } finally {
      setFilterLoading(false);
    }
  }, [searchQuery, selectedLogoTypes, selectedColors, selectedShapes, activeCategory, activeSubcategory, itemsPerPage, fetchLogosWithFilters]);

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters(1); // Reset to first page when filters change
  }, [selectedLogoTypes, selectedColors, selectedShapes, activeCategory, activeSubcategory, applyFilters]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters(1);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, applyFilters]);

  // Apply initial filters when component mounts
  useEffect(() => {
    // Only apply filters if we're not loading
    if (!loading) {
      applyFilters(1);
    }
  }, [loading, applyFilters]);

  // Close filter dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown')) {
        setTypeFilterOpen(false);
        setColorFilterOpen(false);
        setShapeFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Standardized logo types for filtering
  const uniqueTypes = [
    'Wordmarks',
    'Lettermarks', 
    'Pictorial Marks',
    'Abstract Marks',
    'Combination Marks',
    'Emblem Logos',
    'Mascot Logos'
  ];
  const COLOR_TAG_OPTIONS = [
    'Red','Orange','Brown','Yellow','Green','Turquoise','Blue','Violet','Pink','Gray','Black','White'
  ];
  const colorNameToHex: Record<string, string> = {
    Red: '#EF4444',
    Orange: '#F97316',
    Brown: '#A3A3A3',
    Yellow: '#EAB308',
    Green: '#22C55E',
    Turquoise: '#06B6D4',
    Blue: '#3B82F6',
    Violet: '#8B5CF6',
    Pink: '#EC4899',
    Gray: '#6B7280',
    Black: '#000000',
    White: '#FFFFFF'
  };
  const uniqueShapes = useMemo(() => {
    const shapes = [...new Set(allLogos.map(logo => logo.shape))];
    // Fallback to common shapes if none are available
    return shapes.length > 0 ? shapes : ['Circle', 'Square', 'Rectangle', 'Triangle', 'Organic', 'Geometric', 'Abstract'];
  }, [allLogos]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTotal / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTotal);

  // Handle filter changes
  const handleFilterChange = (filterType: 'type' | 'color' | 'shape', value: string) => {
    switch (filterType) {
      case 'type':
        setSelectedLogoTypes(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        setTypeFilterOpen(false);
        break;
      case 'color':
        setSelectedColors(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        setColorFilterOpen(false);
        break;
      case 'shape':
        setSelectedShapes(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        setShapeFilterOpen(false);
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedLogoTypes([]);
    setSelectedColors([]);
    setSelectedShapes([]);
    setActiveCategory('All');
    setActiveSubcategory('All');
    setSearchQuery('');
    // Close all filter dropdowns
    setTypeFilterOpen(false);
    setColorFilterOpen(false);
    setShapeFilterOpen(false);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      applyFilters(page);
    }
  };

  const [goToInput, setGoToInput] = useState<string>('');

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  const visiblePages = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    const showCount = 5; // number of middle buttons

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    if (start > 2) pages.push('ellipsis');

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push('ellipsis');

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  // Category tabs
  const categoryTabs = useMemo(() => ['All', ...INDUSTRY_CATEGORIES.map(c => c.name)], []);
  const subcategoryTabs = useMemo(() => {
    if (activeCategory === 'All') return [] as string[];
    const cat = INDUSTRY_CATEGORIES.find(c => c.name === activeCategory);
    return cat ? ['All', ...cat.subcategories.map(s => s.name)] : [];
  }, [activeCategory]);

  if (loading && allLogos.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading logos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SEO 
        title="Browse Thousands of Professional Logos | Logo Gallery"
        description="Explore our comprehensive logo gallery featuring thousands of professional logos from all industries. Search by type, color, shape, and industry. Perfect for logo design inspiration and brand identity research."
        keywords={['logo gallery', 'professional logos', 'logo design inspiration', 'brand logos', 'company logos', 'logo search', 'logo database', 'logo examples', 'branding inspiration', 'logo collection']}
        canonical="https://trustedlogos.netlify.app/brands-logos"
        ogTitle="Browse Thousands of Professional Logos | Logo Gallery"
        ogDescription="Explore our comprehensive logo gallery featuring thousands of professional logos from all industries. Perfect for logo design inspiration and brand identity research."
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Category Tabs - Horizontally scrollable on mobile */}
          <div className="horizontal-scroll sm:flex sm:flex-wrap gap-1 sm:gap-2 mb-3 bg-gray-100 rounded-lg p-1 sm:p-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveCategory(tab); setActiveSubcategory('All'); }}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  activeCategory === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {subcategoryTabs.length > 0 && (
            <div className="horizontal-scroll sm:flex sm:flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 bg-gray-50 rounded-lg p-1 sm:p-2 border border-gray-200">
              {subcategoryTabs.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                    activeSubcategory === sub
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}



          {/* Filters Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar - Full width on mobile */}
              <div className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search logos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base touch-manipulation"
                  />
                </div>
              </div>

              {/* Filters Row - Better mobile layout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  {/* Logo Type Filter */}
                  <div className="relative filter-dropdown w-full sm:w-auto">
                    <button
                      onClick={() => setTypeFilterOpen(!typeFilterOpen)}
                      className="flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base touch-manipulation w-full sm:w-auto min-w-[120px]"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Type
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {typeFilterOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {uniqueTypes.map((type) => (
                            <label key={type} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedLogoTypes.includes(type)}
                                onChange={() => handleFilterChange('type', type)}
                                className="rounded"
                              />
                              <span className="text-sm">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Color Filter */}
                  <div className="relative filter-dropdown w-full sm:w-auto">
                    <button
                      onClick={() => setColorFilterOpen(!colorFilterOpen)}
                      className="flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base touch-manipulation w-full sm:w-auto min-w-[120px]"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Color
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {colorFilterOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {COLOR_TAG_OPTIONS.map((name) => (
                            <label key={name} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedColors.includes(name)}
                                onChange={() => handleFilterChange('color', name)}
                                className="rounded"
                              />
                              <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: colorNameToHex[name] }} />
                              <span className="text-sm">{name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shape Filter */}
                  <div className="relative filter-dropdown w-full sm:w-auto">
                    <button
                      onClick={() => setShapeFilterOpen(!shapeFilterOpen)}
                      className="flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base touch-manipulation w-full sm:w-auto min-w-[120px]"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Shape
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {shapeFilterOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {uniqueShapes.map((shape) => (
                            <label key={shape} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedShapes.includes(shape)}
                                onChange={() => handleFilterChange('shape', shape)}
                                className="rounded"
                              />
                              <span className="text-sm">{shape}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 sm:p-2 rounded-lg transition-colors duration-200 touch-manipulation ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 sm:p-2 rounded-lg transition-colors duration-200 touch-manipulation ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedLogoTypes.length > 0 || selectedColors.length > 0 || selectedShapes.length > 0 || searchQuery) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {filterLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Applying filters...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">Error loading logos: {error}</p>
            </div>
          )}

          {/* No Logos State */}
          {!filterLoading && filteredTotal === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logos found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
              <button
                onClick={clearAllFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          )}

          

          {/* Logo Grid/List */}
          {!filterLoading && filteredTotal > 0 && (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid mobile-grid-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4' 
                : 'space-y-3'
            }`}>
              {filteredLogos.map((logo) => (
                <div
                  key={logo.id}
                  className={`${
                    viewMode === 'grid'
                      ? 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group'
                      : 'bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200 cursor-pointer group'
                  }`}
                  onClick={() => openModal(logo)}
                >
                  <div className={viewMode === 'grid' ? 'flex flex-col' : 'flex items-center space-x-3'}>
                    <div className={viewMode === 'grid' ? 'aspect-square bg-gray-50 flex items-center justify-center p-4' : ''}>
                      {logo.imageUrl ? (
                        <img
                          src={logo.imageUrl}
                          alt={logo.name}
                          className={viewMode === 'grid' ? 'max-w-full max-h-full object-contain' : 'w-8 h-8 object-contain'}
                        />
                      ) : (
                        <div className={`${
                          viewMode === 'grid' 
                            ? 'w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200'
                            : 'w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm'
                        }`}
                          style={{ backgroundColor: logo.primaryColor }}
                        >
                          {logo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={viewMode === 'grid' ? 'p-1 sm:p-2 md:p-3' : 'flex-1'}>
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 truncate">
                        {logo.name}
                      </h4>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredTotal > 0 && totalPages > 1 && (
            <div className="mt-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              {/* Mobile-friendly layout */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results info */}
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  Showing <span className="font-medium">{startIndex + 1}-{endIndex}</span> of{' '}
                  <span className="font-medium">{filteredTotal}</span> logos
                </div>

                {/* Page navigation controls */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1 || filterLoading}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentPage === 1 || filterLoading
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {visiblePages.map((p, idx) =>
                    p === 'ellipsis' ? (
                      <span key={`el-${idx}`} className="px-2 text-gray-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          currentPage === p
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages || filterLoading}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      currentPage === totalPages || filterLoading
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Jump to page - Separate row for better mobile UX */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center sm:justify-end">
                <div className="flex items-center text-sm text-gray-600 gap-2">
                  <span>Go to page:</span>
                  <input
                    value={goToInput}
                    onChange={(e) => setGoToInput(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const n = Math.max(1, Math.min(totalPages, parseInt(goToInput || '0', 10)));
                        if (!Number.isNaN(n)) goToPage(n);
                      }
                    }}
                    placeholder="Page"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                  />
                  <button
                    onClick={() => {
                      const n = Math.max(1, Math.min(totalPages, parseInt(goToInput || '0', 10)));
                      if (!Number.isNaN(n)) goToPage(n);
                    }}
                    className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!goToInput}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logo Modal */}
      <LogoModal
        logo={selectedLogo}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={handleDownload}
        onLike={handleLike}
      />
    </div>
  );
};

export default AllImagesPage;