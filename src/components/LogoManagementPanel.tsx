import React, { useState, useEffect } from 'react';
import { Upload, Plus, Save, AlertCircle, CheckCircle, Image, Palette, Tag, Shapes, Edit3, Trash2, Search, Filter, Grid, List, Eye, Download, Star, Heart, Loader, ArrowLeft } from 'lucide-react';
import { useLogos, type Logo, type CreateLogoData, type UpdateLogoData } from '../hooks/useLogos-safe';
import { INDUSTRY_CATEGORIES, getIndustryCategoryList } from '../utils/industryCategories';

interface LogoManagementPanelProps {
  onBack: () => void;
}

const LogoManagementPanel: React.FC<LogoManagementPanelProps> = ({ onBack }) => {
  const { 
    logos: allLogos, 
    loading, 
    error: hookError, 
    addLogo, 
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

  // Form states
  const [logoName, setLogoName] = useState('');
  const [logoType, setLogoType] = useState('');
  const [industryCategory, setIndustryCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [logoColor, setLogoColor] = useState('#000000');
  const [secondaryLogoColor, setSecondaryLogoColor] = useState('#ffffff');
  const [logoShape, setLogoShape] = useState('');
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [logoInformation, setLogoInformation] = useState('');
  const [designerUrl, setDesignerUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Panel states
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'manage'
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
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

  const logoShapes = [
    'Circular',
    'Square', 
    'Rectangular',
    'Triangular',
    'Organic',
    'Geometric',
    'Script',
    'Other'
  ];

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoImageFile(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setLogoImageFile(files[0]);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      if (!logoImageFile) {
        throw new Error('Please select an image file');
      }

      const logoData: CreateLogoData = {
        name: logoName,
        type: logoType,
        industry: industryCategory,
        subcategory: subcategory || undefined,
        primaryColor: logoColor,
        secondaryColor: secondaryLogoColor || undefined,
        shape: logoShape,
        information: logoInformation || undefined,
        designerUrl: designerUrl || undefined,
        imageFile: logoImageFile,
        isPublic: true
      };

      await addLogo(logoData);
      
      // Reset form
      setLogoName('');
      setLogoType('');
      setIndustryCategory('');
      setSubcategory('');
      setLogoColor('#000000');
      setSecondaryLogoColor('#ffffff');
      setLogoShape('');
      setLogoImageFile(null);
      setLogoInformation('');
      setDesignerUrl('');
      
      setSubmitMessage({ type: 'success', text: 'Logo uploaded successfully!' });
      
      // Auto refresh
      await refreshLogos();
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to upload logo' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and sort logos
  const filteredLogos = logos
    .filter(logo => {
      const matchesSearch = logo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           logo.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || logo.type === filterType;
      const matchesIndustry = filterIndustry === 'all' || logo.industry === filterIndustry;
      return matchesSearch && matchesType && matchesIndustry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'industry':
          return a.industry.localeCompare(b.industry);
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleDeleteLogo = async (logoId: string) => {
    if (window.confirm('Are you sure you want to delete this logo?')) {
      try {
        await deleteLogo(logoId);
        setSubmitMessage({ type: 'success', text: 'Logo deleted successfully!' });
      } catch (error) {
        setSubmitMessage({ type: 'error', text: 'Failed to delete logo' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Logo Management</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('add')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'add'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add New Logo
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Edit3 className="h-4 w-4 inline mr-2" />
            Manage Logos ({logos.length})
          </button>
        </nav>
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`p-4 rounded-md ${
          submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className="flex">
            {submitMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {submitMessage.text}
          </div>
        </div>
      )}

      {/* Add Logo Tab */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Name *
                </label>
                <input
                  type="text"
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Logo Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Type *
                </label>
                <select
                  value={logoType}
                  onChange={(e) => setLogoType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select logo type...</option>
                  {logoTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Industry Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Category *
                </label>
                <select
                  value={industryCategory}
                  onChange={(e) => setIndustryCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select industry...</option>
                  {getIndustryCategoryList().map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Logo Shape */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Shape *
                </label>
                <select
                  value={logoShape}
                  onChange={(e) => setLogoShape(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select shape...</option>
                  {logoShapes.map(shape => (
                    <option key={shape} value={shape}>{shape}</option>
                  ))}
                </select>
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={logoColor}
                    onChange={(e) => setLogoColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={secondaryLogoColor}
                    onChange={(e) => setSecondaryLogoColor(e.target.value)}
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryLogoColor}
                    onChange={(e) => setSecondaryLogoColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Image *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {logoImageFile ? (
                  <div className="space-y-2">
                    <Image className="h-12 w-12 mx-auto text-green-500" />
                    <p className="text-sm text-gray-600">
                      Selected: {logoImageFile.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setLogoImageFile(null)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                      >
                        Click to upload
                      </label>
                      <span className="text-gray-500"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                value={logoInformation}
                onChange={(e) => setLogoInformation(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information about the logo..."
              />
            </div>

            {/* Designer URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designer URL
              </label>
              <input
                type="url"
                value={designerUrl}
                onChange={(e) => setDesignerUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Upload Logo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Logos Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logos..."
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {logoTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Industries</option>
                  {getIndustryCategoryList().map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="type">Type</option>
                  <option value="industry">Industry</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {filteredLogos.length} logos found
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Logo Grid/List */}
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="p-8 text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading logos...</p>
              </div>
            ) : filteredLogos.length === 0 ? (
              <div className="p-8 text-center">
                <Image className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">No logos found</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6'
                  : 'divide-y divide-gray-200'
              }>
                {filteredLogos.map((logo) => (
                  <div key={logo.id} className={
                    viewMode === 'grid'
                      ? 'group relative bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow'
                      : 'flex items-center justify-between p-4 hover:bg-gray-50'
                  }>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square bg-white rounded-lg mb-3 flex items-center justify-center">
                          {logo.imageUrl ? (
                            <img
                              src={logo.imageUrl}
                              alt={logo.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <Image className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 truncate">{logo.name}</h3>
                        <p className="text-sm text-gray-500">{logo.type}</p>
                        <p className="text-sm text-gray-500">{logo.industry}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: logo.primaryColor }}
                            />
                            <span className="text-xs text-gray-500">{logo.primaryColor}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteLogo(logo.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {logo.imageUrl ? (
                              <img
                                src={logo.imageUrl}
                                alt={logo.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <Image className="h-6 w-6 text-gray-300" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{logo.name}</h3>
                            <p className="text-sm text-gray-500">{logo.type} • {logo.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: logo.primaryColor }}
                            />
                            <span className="text-sm text-gray-500">{logo.primaryColor}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteLogo(logo.id)}
                            className="text-red-500 hover:text-red-700"
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
        </div>
      )}
    </div>
  );
};

export default LogoManagementPanel;