import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Star,
  Smartphone,
  Shirt,
  Utensils,
  Car,
  Film,
  Building2,
  Eye
} from 'lucide-react';
import { useBrandGuidelines } from '../hooks/useBrandGuidelines';
import FlipbookViewer from '../components/FlipbookViewer';
import SEO from '../components/SEO';

const BrandGuidelinesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'popular' | 'recent'>('name');
  const [selectedGuideline, setSelectedGuideline] = useState<{ pdfUrl: string; title: string } | null>(null);

  // Use the real hook to fetch brand guidelines
  const { brandGuidelines, categories, loading, error, fetchBrandGuidelines } = useBrandGuidelines();

  // Fetch data on component mount only once
  useEffect(() => {
    fetchBrandGuidelines();
  }, []); // Empty dependency array - only run once on mount

  // Get featured guidelines (public and featured)
  const featuredGuidelines = brandGuidelines.filter(bg => bg.is_public && bg.is_featured);

  // Filter and sort guidelines (only public ones)
  const filteredGuidelines = brandGuidelines
    .filter(guideline => guideline.is_public) // Only show public guidelines
    .filter(guideline => {
      const matchesSearch = guideline.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guideline.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             (guideline.category && guideline.category.name === selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.brand_name.localeCompare(b.brand_name);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'recent':
          return (b.year_founded || 0) - (a.year_founded || 0);
        default:
          return 0;
      }
    });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality will be implemented later
    console.log('Searching for:', searchTerm);
  };

  // Handle category filter
  const handleCategoryFilter = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Tech': return <Smartphone className="h-4 w-4" />;
      case 'Fashion': return <Shirt className="h-4 w-4" />;
      case 'Food & Beverage': return <Utensils className="h-4 w-4" />;
      case 'Automotive': return <Car className="h-4 w-4" />;
      case 'Media & Entertainment': return <Film className="h-4 w-4" />;
      case 'Corporates': return <Building2 className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <>
      <SEO 
        title="Brand Guidelines Library - Explore Iconic Brand Books"
        description="Flip through official brand books and see how global companies define their logos, colors, and typography. Discover Nike, Apple, Coca-Cola and more brand guidelines."
        keywords={['brand guidelines', 'brand books', 'logo design', 'brand identity', 'design system', 'brand standards']}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Explore the Rules Behind the World's Most Iconic Brands
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Flip through official brand books and see how global companies define their logos, colors, and typography.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by brand name or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white rounded-lg shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Browse All Guidelines
                </button>
                <button
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Explore by Category
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Brands Section */}
        {featuredGuidelines.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Featured Brand Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGuidelines.map((guideline) => (
                <div
                  key={guideline.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 text-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{guideline.brand_name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guideline.industry}</p>
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                    <BookOpen className="h-4 w-4" />
                    Open Flipbook
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters & Categories Section */}
        <div id="categories" className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedCategory === category.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getCategoryIcon(category.name)}
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sort & View Controls */}
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'popular' | 'recent')}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">A-Z (Alphabetical)</option>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading brand guidelines...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <span className="text-red-800">Error: {error}</span>
              </div>
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && (
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredGuidelines.length} brand guideline{filteredGuidelines.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          )}

          {/* Brand Guidelines Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGuidelines.map((guideline) => (
                <div
                  key={guideline.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden p-6 text-center"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  
                  {/* Brand Info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{guideline.brand_name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{guideline.title}</p>
                  
                  {/* Category Badge */}
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-opacity-10`} style={{ backgroundColor: `${guideline.category?.color || '#6B7280'}20`, color: guideline.category?.color || '#6B7280' }}>
                    {getCategoryIcon(guideline.category?.name || '')}
                    {guideline.category?.name || 'Uncategorized'}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {guideline.tags?.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <span>👁️ {guideline.views || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>⬇️ {guideline.downloads || 0}</span>
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => setSelectedGuideline({
                      pdfUrl: guideline.pdf_url,
                      title: `${guideline.brand_name} - ${guideline.title}`
                    })}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    📖 Open Flipbook
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredGuidelines.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No brand guidelines found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                  : 'No brand guidelines available in this category.'
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Flipbook Viewer Modal */}
      {selectedGuideline && (
        <FlipbookViewer
          pdfUrl={selectedGuideline.pdfUrl}
          title={selectedGuideline.title}
          onClose={() => setSelectedGuideline(null)}
        />
      )}
    </>
  );
};

export default BrandGuidelinesPage; 