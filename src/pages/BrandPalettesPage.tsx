import React, { useState, useMemo } from 'react';
import { Search, Filter, Palette, Download, Star } from 'lucide-react';
import { useLogos } from '../hooks/useLogos-safe';
import { useColorPalettes } from '../hooks/useColorPalettes';

import SEO from '../components/SEO';

interface BrandPalette {
  id: string;
  brandName: string;
  logoUrl?: string;
  colors: Array<{ hex: string; name?: string }>;
  industry: string;
  type: string;
}

const BrandPalettesPage = () => {
  const { logos, loading: logosLoading, error: logosError, fetchAllLogos } = useLogos();
  const { palettes: colorPalettes, loading: palettesLoading, error: palettesError } = useColorPalettes();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Use ALL logos to build brand palettes so nothing is missed by pagination
  const [allLogos, setAllLogos] = useState<any[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAllLogos();
        if (!cancelled) setAllLogos(data || []);
      } catch {
        if (!cancelled) setAllLogos(logos || []);
      }
    })();
    return () => { cancelled = true; };
  }, [fetchAllLogos, logos]);

  // Add safety check for empty arrays
  const safeLogos = allLogos.length > 0 ? allLogos : (logos || []);
  const safeColorPalettes = colorPalettes || [];

  // Get unique industries and types from logos that should show in brand palettes
  const filteredLogosForBrandPalettes = useMemo(() => {
    return safeLogos.filter(logo => logo.showInBrandPalettes === true);
  }, [safeLogos]);

  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(filteredLogosForBrandPalettes.map(logo => logo.industry)));
    return uniqueIndustries.sort();
  }, [filteredLogosForBrandPalettes]);

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(filteredLogosForBrandPalettes.map(logo => logo.type)));
    return uniqueTypes.sort();
  }, [filteredLogosForBrandPalettes]);

  // Create brand palettes by combining logos with their colors
  const brandPalettes: BrandPalette[] = useMemo(() => {
    return filteredLogosForBrandPalettes.map(logo => {
      // Prefer brandColors from logo if present
      const colors: Array<{ hex: string; name?: string }> =
        Array.isArray((logo as any).brandColors) && (logo as any).brandColors.length > 0
          ? (logo as any).brandColors.map((hex: string, index: number) => ({ hex, name: `Color ${index + 1}` }))
          : [];

      // If no brandColors, fall back to primary/secondary
      if (colors.length === 0) {
        if (logo.primaryColor) {
          colors.push({ hex: logo.primaryColor, name: 'Primary' });
        }
        if (logo.secondaryColor) {
          colors.push({ hex: logo.secondaryColor, name: 'Secondary' });
        }
      }
      
      // Try to find matching color palette by brand name
      const matchingPalette = safeColorPalettes.find(palette => 
        palette.name.toLowerCase().includes(logo.name.toLowerCase()) ||
        logo.name.toLowerCase().includes(palette.name.toLowerCase())
      );
      
      // If we found a matching palette, use those colors instead
      if (matchingPalette && matchingPalette.colors.length > 0) {
        return {
          id: logo.id,
          brandName: logo.name,
          logoUrl: logo.imageUrl,
          colors: matchingPalette.colors.map((hex, index) => ({
            hex,
            name: `Color ${index + 1}`
          })),
          industry: logo.industry,
          type: logo.type
        };
      }
      
      // If no colors available, create a default palette
      if (colors.length === 0) {
        colors.push({ hex: '#6B7280', name: 'Default' });
      }
      
      return {
        id: logo.id,
        brandName: logo.name,
        logoUrl: logo.imageUrl,
        colors,
        industry: logo.industry,
        type: logo.type
      };
    });
  }, [filteredLogosForBrandPalettes, safeColorPalettes]);

  // Filter and sort brand palettes
  const filteredBrandPalettes = useMemo(() => {
    let filtered = brandPalettes.filter(brand => {
      // Search filter
      if (searchQuery && !brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !brand.industry.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !brand.type.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Industry filter
      if (selectedIndustry !== 'all' && brand.industry !== selectedIndustry) {
        return false;
      }
      
      // Type filter
      if (selectedType !== 'all' && brand.type !== selectedType) {
        return false;
      }
      
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'industry':
        return filtered.sort((a, b) => a.industry.localeCompare(b.industry));
      case 'type':
        return filtered.sort((a, b) => a.type.localeCompare(b.type));
      case 'name':
      default:
        return filtered.sort((a, b) => a.brandName.localeCompare(b.brandName));
    }
  }, [brandPalettes, searchQuery, selectedIndustry, selectedType, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSelectedType('all');
  };

  const downloadPalette = (brand: BrandPalette) => {
    // Create a simple text file with the brand colors
    const content = `${brand.brandName} Brand Colors\n\n${brand.colors.map(color => `${color.name}: ${color.hex}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brand.brandName.toLowerCase().replace(/\s+/g, '-')}-colors.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loading = logosLoading || palettesLoading;
  const error = logosError || palettesError;

  // Early return for errors
  if (error && !loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error loading data</div>
            <div className="text-gray-500 text-sm">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SEO 
        title="Brand Color Palettes | Logo Brand Colors & Design Inspiration"
        description="Explore famous brand color palettes and logo designs. Discover the perfect color combinations used by top brands for your design inspiration."
        keywords={['brand colors', 'logo colors', 'brand palette', 'famous brand colors', 'logo design', 'brand identity', 'color schemes', 'corporate colors']}
        canonical="https://trustedlogos.netlify.app/brand-palettes"
        ogTitle="Brand Color Palettes | Famous Logo Colors"
        ogDescription="Discover the color palettes behind famous brand logos. Perfect for designers seeking brand color inspiration."
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Palette className="h-6 w-6 text-purple-600 mr-2" />
                Brand Color Palettes
              </h1>
              <p className="text-gray-600 mt-1">
                Discover the color palettes behind famous brand logos
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Star className="h-4 w-4" />
              <span>{filteredBrandPalettes.length} brands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search brands, industries, or types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Industry:</span>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm min-w-[120px]"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm min-w-[120px]"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm min-w-[120px]"
              >
                <option value="name">Name</option>
                <option value="industry">Industry</option>
                <option value="type">Type</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedIndustry !== 'all' || selectedType !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 whitespace-nowrap border border-red-200"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading brand palettes...</div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredBrandPalettes.length} Brand Palettes
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Click on any color to copy its hex code
                </p>
              </div>

                                           {/* Brand Palettes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {filteredBrandPalettes.map((brand) => (
                   <div key={brand.id} className="bg-white rounded-lg border border-gray-200 p-4">
                     <h3 className="text-lg font-semibold mb-2">{brand.brandName}</h3>
                                           {brand.logoUrl && (
                        <div className="mb-4 h-32 flex items-center justify-center bg-gray-50 rounded">
                          <img src={brand.logoUrl} alt={brand.brandName} className="max-h-full max-w-full object-contain" />
                        </div>
                      )}
                     <div className="flex mb-2">
                       {brand.colors.map((color, index) => (
                         <div
                           key={index}
                           className="flex-1 h-12 cursor-pointer"
                           style={{ backgroundColor: color.hex }}
                           title={color.hex}
                           onClick={() => navigator.clipboard.writeText(color.hex)}
                         />
                       ))}
                     </div>
                     <div className="text-xs text-gray-600">
                       {brand.colors.map(color => color.hex).join(' • ')}
                     </div>
                   </div>
                 ))}
               </div>

              {/* No Results */}
              {filteredBrandPalettes.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No brand palettes found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandPalettesPage; 