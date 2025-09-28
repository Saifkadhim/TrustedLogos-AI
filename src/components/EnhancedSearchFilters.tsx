import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X, RefreshCw, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
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

// Custom Dropdown Component
interface DropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
  maxHeight?: string;
}

const MultiSelectDropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
  disabled = false,
  maxHeight = "max-h-60"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) return selectedValues[0];
    return `${selectedValues.length} selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${selectedValues.length > 0 ? 'border-blue-300 bg-blue-50' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${selectedValues.length > 0 ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
            {getDisplayText()}
          </span>
          <div className="flex items-center gap-2">
            {selectedValues.length > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                {selectedValues.length}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className={`absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl ${maxHeight} overflow-y-auto`} style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <div className="p-2">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => toggleOption(option)}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedValues.includes(option) ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                }`}
              >
                <span className="flex-1">{option}</span>
                {selectedValues.includes(option) && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sort Dropdown Component
interface SortDropdownProps {
  currentSort: { sortBy: string; sortOrder: string };
  onChange: (sortOption: typeof SORT_OPTIONS[0]) => void;
  disabled?: boolean;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentSortLabel = () => {
    const option = SORT_OPTIONS.find(opt => 
      opt.value === currentSort.sortBy && opt.order === currentSort.sortOrder
    );
    return option?.label || 'Newest First';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">{getCurrentSortLabel()}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto" style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <div className="p-2">
            {SORT_OPTIONS.map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                  currentSort.sortBy === option.value && currentSort.sortOrder === option.order
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                {currentSort.sortBy === option.value && currentSort.sortOrder === option.order && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const EnhancedSearchFilters: React.FC<EnhancedSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [activeFilters, setActiveFilters] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
  const handleMultiSelectChange = useCallback((field: keyof FilterState, values: string[]) => {
    onFiltersChange({ [field]: values });
  }, [onFiltersChange]);

  // Handle sort change
  const handleSortChange = useCallback((sortOption: typeof SORT_OPTIONS[0]) => {
    onFiltersChange({
      sortBy: sortOption.value,
      sortOrder: sortOption.order as 'asc' | 'desc'
    });
  }, [onFiltersChange]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
              <p className="text-sm text-gray-600">Find logos with advanced filtering options</p>
            </div>
            {activeFilters > 0 && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-full">
                  {activeFilters} active
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {activeFilters > 0 && (
              <button
                onClick={onClearFilters}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4" />
              {isCollapsed ? 'Show' : 'Hide'} Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className={`px-6 py-4 bg-gray-50 border-b border-gray-200 ${isCollapsed && activeFilters === 0 ? 'rounded-b-xl' : ''}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logos by name, industry, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-12 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      {!isCollapsed && (
        <div className={`px-6 py-6 ${activeFilters === 0 ? 'rounded-b-xl' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Logo Type Filter */}
            <MultiSelectDropdown
              label="Logo Type"
              options={LOGO_TYPES}
              selectedValues={filters.type}
              onChange={(values) => handleMultiSelectChange('type', values)}
              placeholder="Select logo types"
              disabled={loading}
            />

            {/* Industry Filter */}
            <MultiSelectDropdown
              label="Industry"
              options={getIndustryCategoryList()}
              selectedValues={filters.industry}
              onChange={(values) => handleMultiSelectChange('industry', values)}
              placeholder="Select industries"
              disabled={loading}
            />

            {/* Shape Filter */}
            <MultiSelectDropdown
              label="Logo Shape"
              options={SHAPE_OPTIONS}
              selectedValues={filters.shape}
              onChange={(values) => handleMultiSelectChange('shape', values)}
              placeholder="Select shapes"
              disabled={loading}
            />

            {/* Sort Options */}
            <SortDropdown
              currentSort={{ sortBy: filters.sortBy, sortOrder: filters.sortOrder }}
              onChange={handleSortChange}
              disabled={loading}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilters > 0 && !isCollapsed && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
                <Search className="h-3 w-3" />
                Search: "{filters.search}"
                <button
                  onClick={() => onFiltersChange({ search: '' })}
                  className="ml-1 hover:text-blue-900 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.type.map(type => (
              <span key={type} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-800 rounded-lg border border-green-200">
                <Filter className="h-3 w-3" />
                Type: {type}
                <button
                  onClick={() => handleMultiSelectChange('type', filters.type.filter(t => t !== type))}
                  className="ml-1 hover:text-green-900 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.industry.map(industry => (
              <span key={industry} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-800 rounded-lg border border-purple-200">
                <Filter className="h-3 w-3" />
                Industry: {industry}
                <button
                  onClick={() => handleMultiSelectChange('industry', filters.industry.filter(i => i !== industry))}
                  className="ml-1 hover:text-purple-900 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.shape.map(shape => (
              <span key={shape} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-orange-100 text-orange-800 rounded-lg border border-orange-200">
                <Filter className="h-3 w-3" />
                Shape: {shape}
                <button
                  onClick={() => handleMultiSelectChange('shape', filters.shape.filter(s => s !== shape))}
                  className="ml-1 hover:text-orange-900 transition-colors"
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