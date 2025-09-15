import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { FilterState } from '../hooks/useServerSideLogos';
import { INDUSTRY_CATEGORIES, getIndustryCategoryList, getSubcategoriesForIndustry } from '../utils/industryCategories';

interface EnhancedSearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  loading?: boolean;
  className?: string;
}

// Logo types from the existing data
const LOGO_TYPES = [
  'Wordmarks',
  'Lettermarks', 
  'Pictorial Marks',
  'Abstract Marks',
  'Combination Marks',
  'Emblem Logos',
  'Mascot Logos'
];

// Shape options
const SHAPE_OPTIONS = [
  'Circular',
  'Square', 
  'Rectangular',
  'Triangular',
  'Organic',
  'Geometric',
  'Script',
  'Other'
];

// Sort options
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest First', order: 'desc' },
  { value: 'created_at', label: 'Oldest First', order: 'asc' },
  { value: 'name', label: 'Name A-Z', order: 'asc' },
  { value: 'name', label: 'Name Z-A', order: 'desc' },
  { value: 'type', label: 'Type A-Z', order: 'asc' },
  { value: 'industry', label: 'Industry A-Z', order: 'asc' },
  { value: 'likes', label: 'Most Liked', order: 'desc' },
  { value: 'downloads', label: 'Most Downloaded', order: 'desc' }
];

export const EnhancedSearchFilters: React.FC<EnhancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [activeFilters, setActiveFilters] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type.length > 0) count++;
    if (filters.industry.length > 0) count++;
    if (filters.shape.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.sortBy !== 'created_at' || filters.sortOrder !== 'desc') count++;
    setActiveFilters(count);
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFiltersChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onFiltersChange]);

  // Handle multi-select changes
  const handleMultiSelectChange = useCallback((field: keyof FilterState, value: string, checked: boolean) => {
    const currentValues = filters[field] as string[];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    onFiltersChange({ [field]: newValues });
  }, [filters, onFiltersChange]);

  // Handle sort change
  const handleSortChange = useCallback((sortOption: typeof SORT_OPTIONS[0]) => {
    onFiltersChange({
      sortBy: sortOption.value,
      sortOrder: sortOption.order as 'asc' | 'desc'
    });
  }, [onFiltersChange]);

  // Check if a filter is active
  const isFilterActive = useCallback((field: keyof FilterState, value: string) => {
    const fieldValue = filters[field];
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(value);
    }
    return fieldValue === value;
  }, [filters]);

  // Get current sort label
  const getCurrentSortLabel = useCallback(() => {
    const option = SORT_OPTIONS.find(opt => 
      opt.value === filters.sortBy && opt.order === filters.sortOrder
    );
    return option?.label || 'Newest First';
  }, [filters.sortBy, filters.sortOrder]);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
          {activeFilters > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {activeFilters} active
            </span>
          )}
        </div>
        
        {activeFilters > 0 && (
          <button
            onClick={onClearFilters}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Search */}
        <div className="lg:col-span-2 xl:col-span-3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Logos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by name, industry, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Logo Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Logo Type
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {LOGO_TYPES.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFilterActive('type', type)}
                  onChange={(e) => handleMultiSelectChange('type', type, e.target.checked)}
                  disabled={loading}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Industry Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Industry
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {getIndustryCategoryList().map(industry => (
              <label key={industry} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFilterActive('industry', industry)}
                  onChange={(e) => handleMultiSelectChange('industry', industry, e.target.checked)}
                  disabled={loading}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">{industry}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Shape Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Shape
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {SHAPE_OPTIONS.map(shape => (
              <label key={shape} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFilterActive('shape', shape)}
                  onChange={(e) => handleMultiSelectChange('shape', shape, e.target.checked)}
                  disabled={loading}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">{shape}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sort By
          </label>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === option.value && filters.sortOrder === option.order}
                  onChange={() => handleSortChange(option)}
                  disabled={loading}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                Search: "{filters.search}"
                <button
                  onClick={() => onFiltersChange({ search: '' })}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.type.map(type => (
              <span key={type} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Type: {type}
                <button
                  onClick={() => handleMultiSelectChange('type', type, false)}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.industry.map(industry => (
              <span key={industry} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                Industry: {industry}
                <button
                  onClick={() => handleMultiSelectChange('industry', industry, false)}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.shape.map(shape => (
              <span key={shape} className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                Shape: {shape}
                <button
                  onClick={() => handleMultiSelectChange('shape', shape, false)}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 