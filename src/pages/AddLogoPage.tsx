import React, { useState } from 'react';
import { Upload, Plus, Save, AlertCircle, CheckCircle, Image, Palette, Tag, Shapes, Edit3, Trash2, Search, Filter, Grid, List, Eye, Download, Star, Heart } from 'lucide-react';
import { useLogos } from '../hooks/useLogos';

const AddLogoPage = () => {
  const { addLogo } = useLogos();
  // Sample logo data - in a real app, this would come from a database
  const [logos, setLogos] = useState([
    {
      id: 1,
      name: 'Apple',
      type: 'Pictorial Marks',
      industry: 'Technology',
      color: '#000000',
      secondaryColor: '#ffffff',
      shape: 'circle',
      imageFile: null,
      imageName: 'apple-logo.png',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
      isPublic: true,
      downloads: 1247,
      likes: 89
    },
    {
      id: 2,
      name: 'Nike',
      type: 'Abstract Marks',
      industry: 'Fashion',
      color: '#000000',
      secondaryColor: '#ffffff',
      shape: 'other',
      imageFile: null,
      imageName: 'nike-logo.png',
      createdAt: '2025-01-14',
      updatedAt: '2025-01-14',
      isPublic: true,
      downloads: 892,
      likes: 67
    },
    {
      id: 3,
      name: 'Google',
      type: 'Wordmarks',
      industry: 'Technology',
      color: '#4285f4',
      secondaryColor: '#ea4335',
      shape: 'rectangle',
      imageFile: null,
      imageName: 'google-logo.png',
      createdAt: '2025-01-13',
      updatedAt: '2025-01-13',
      isPublic: true,
      downloads: 2156,
      likes: 134
    }
  ]);

  // Form states
  const [logoName, setLogoName] = useState('');
  const [logoType, setLogoType] = useState('');
  const [industryCategory, setIndustryCategory] = useState('');
  const [logoColor, setLogoColor] = useState('#000000');
  const [secondaryLogoColor, setSecondaryLogoColor] = useState('#ffffff');
  const [logoShape, setLogoShape] = useState('');
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Admin panel states
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'manage'
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

  // Industry categories from the existing data
  const industryCategories = [
    'Airlines',
    'Automotive',
    'Cosmetics',
    'E-commerce',
    'Education',
    'Electronics',
    'Energy companies',
    'Fashion',
    'Finance / Bank',
    'Fitness',
    'Food & Drinks',
    'Games',
    'Hotels',
    'Industrial',
    'Insurance',
    'Internet',
    'Media / TV',
    'Motorcycles',
    'Music',
    'Organizations',
    'Pets',
    'Pharma',
    'Retailers',
    'Restaurant',
    'Software',
    'Technology',
    'Sports',
    'Other'
  ];

  // Shape options
  const shapeOptions = [
    'Circle',
    'Rectangle',
    'Triangle',
    'Square',
    'Oval',
    'Diamond',
    'Hexagon',
    'Other'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'downloads', label: 'Most Downloads' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  // Filter and sort logos
  const filteredLogos = React.useMemo(() => {
    let filtered = logos.filter(logo => {
      const matchesSearch = logo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           logo.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || logo.type === filterType;
      const matchesIndustry = filterIndustry === 'all' || logo.industry === filterIndustry;
      return matchesSearch && matchesType && matchesIndustry;
    });

    // Sort logos
    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'popular':
        return filtered.sort((a, b) => b.likes - a.likes);
      case 'downloads':
        return filtered.sort((a, b) => b.downloads - a.downloads);
      case 'alphabetical':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default: // newest
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [logos, searchTerm, filterType, filterIndustry, sortBy]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setLogoImageFile(file);
      setSubmitMessage(null);
    } else {
      setSubmitMessage({ type: 'error', text: 'Please select a valid image file.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const resetForm = () => {
    setLogoName('');
    setLogoType('');
    setIndustryCategory('');
    setLogoColor('#000000');
    setSecondaryLogoColor('#ffffff');
    setLogoShape('');
    setLogoImageFile(null);
    setEditingLogo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!logoName.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please enter a logo name.' });
      return;
    }
    
    if (!logoType) {
      setSubmitMessage({ type: 'error', text: 'Please select a logo type.' });
      return;
    }
    
    if (!industryCategory) {
      setSubmitMessage({ type: 'error', text: 'Please select an industry category.' });
      return;
    }
    
    if (!logoShape) {
      setSubmitMessage({ type: 'error', text: 'Please select a logo shape.' });
      return;
    }
    
    if (!logoImageFile && !editingLogo) {
      setSubmitMessage({ type: 'error', text: 'Please upload a logo image.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Convert image file to data URL for preview/storage in local store
      let imageDataUrl: string | undefined = undefined;
      if (logoImageFile) {
        imageDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Failed to read image'));
          reader.readAsDataURL(logoImageFile!);
        });
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const logoData = {
        name: logoName,
        type: logoType,
        industry: industryCategory,
        color: logoColor,
        secondaryColor: secondaryLogoColor,
        shape: logoShape.toLowerCase(),
        imageFile: logoImageFile,
        imageName: logoImageFile ? logoImageFile.name : (editingLogo ? editingLogo.imageName : ''),
        isPublic: true,
        downloads: editingLogo ? editingLogo.downloads : 0,
        likes: editingLogo ? editingLogo.likes : 0
      };

      if (editingLogo) {
        // Update existing logo
        setLogos(prev => prev.map(logo => 
          logo.id === editingLogo.id 
            ? {
                ...logo,
                ...logoData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : logo
        ));
        setSubmitMessage({ type: 'success', text: 'Logo updated successfully!' });

        // Update shared store if this was in it previously
        addLogo({
          id: String(editingLogo.id),
          name: logoName,
          color: logoColor,
          imageDataUrl
        });
      } else {
        // Add new logo
        const newLogo = {
          id: Date.now(),
          ...logoData,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setLogos(prev => [newLogo, ...prev]);
        setSubmitMessage({ type: 'success', text: 'Logo added successfully!' });

        // Save a simplified version to shared store for site-wide display
        addLogo({
          id: String(newLogo.id),
          name: logoName,
          color: logoColor,
          imageDataUrl
        });
      }
      
      // Reset form
      resetForm();
      
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to save logo. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLogo = (logo) => {
    setEditingLogo(logo);
    setLogoName(logo.name);
    setLogoType(logo.type);
    setIndustryCategory(logo.industry);
    setLogoColor(logo.color);
    setSecondaryLogoColor(logo.secondaryColor);
    setLogoShape(logo.shape);
    setLogoImageFile(null);
    setActiveTab('add');
    setSubmitMessage(null);
  };

  const handleDeleteLogo = (id) => {
    if (window.confirm('Are you sure you want to delete this logo?')) {
      setLogos(prev => prev.filter(logo => logo.id !== id));
    }
  };

  const exportLogos = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Type,Industry,Color,Secondary Color,Shape,Image,Public,Downloads,Likes,Created,Updated\n" +
      filteredLogos.map(logo => 
        `"${logo.name}","${logo.type}","${logo.industry}","${logo.color}","${logo.secondaryColor}","${logo.shape}","${logo.imageName}",${logo.isPublic},${logo.downloads},${logo.likes},${logo.createdAt},${logo.updatedAt}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "logos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Plus className="h-6 w-6 text-blue-600 mr-2" />
              Logo Management
            </h1>
            <p className="text-gray-600 mt-1">
              Add new logos and manage existing logo collection ({logos.length} total logos)
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">✨ Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('add')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'add'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {editingLogo ? 'Edit Logo' : 'Add New Logo'}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Logos ({logos.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'add' ? (
          /* Add/Edit Logo Form */
          <div className="max-w-4xl mx-auto">
            {editingLogo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Edit3 className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">Editing: {editingLogo.name}</span>
                  </div>
                  <button
                    onClick={resetForm}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Cancel Edit
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Logo Upload Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="h-5 w-5 text-blue-600 mr-2" />
                  Logo Image {editingLogo && <span className="text-sm text-gray-500 ml-2">(Leave empty to keep current image)</span>}
                </h2>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : logoImageFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {logoImageFile ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-green-700 font-medium">{logoImageFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(logoImageFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLogoImageFile(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">
                          {editingLogo ? 'Upload new image (optional)' : 'Drag and drop your logo here, or click to browse'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Supports PNG, JPG, SVG files up to 10MB
                        </p>
                        {editingLogo && (
                          <p className="text-sm text-blue-600 mt-1">
                            Current: {editingLogo.imageName}
                          </p>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Details Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="h-5 w-5 text-purple-600 mr-2" />
                  Logo Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Name */}
                  <div>
                    <label htmlFor="logoName" className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Name *
                    </label>
                    <input
                      type="text"
                      id="logoName"
                      value={logoName}
                      onChange={(e) => setLogoName(e.target.value)}
                      placeholder="e.g., Apple, Nike, Google"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Logo Type */}
                  <div>
                    <label htmlFor="logoType" className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Type *
                    </label>
                    <select
                      id="logoType"
                      value={logoType}
                      onChange={(e) => setLogoType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select logo type</option>
                      {logoTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Industry Category */}
                  <div>
                    <label htmlFor="industryCategory" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry Category *
                    </label>
                    <select
                      id="industryCategory"
                      value={industryCategory}
                      onChange={(e) => setIndustryCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select industry</option>
                      {industryCategories.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  {/* Logo Shape */}
                  <div>
                    <label htmlFor="logoShape" className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Shape *
                    </label>
                    <select
                      id="logoShape"
                      value={logoShape}
                      onChange={(e) => setLogoShape(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select shape</option>
                      {shapeOptions.map((shape) => (
                        <option key={shape} value={shape.toLowerCase()}>{shape}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Color Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="h-5 w-5 text-pink-600 mr-2" />
                  Logo Colors
                </h2>
                
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="logoColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        id="logoColor"
                        value={logoColor}
                        onChange={(e) => setLogoColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={logoColor}
                        onChange={(e) => setLogoColor(e.target.value)}
                        placeholder="#000000"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="secondaryLogoColor" className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color (Optional)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        id="secondaryLogoColor"
                        value={secondaryLogoColor}
                        onChange={(e) => setSecondaryLogoColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryLogoColor}
                        onChange={(e) => setSecondaryLogoColor(e.target.value)}
                        placeholder="#ffffff"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-24"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Select the primary and secondary colors of the logo. The primary color will be used for filtering and display purposes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-4 rounded-lg flex items-center ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {submitMessage.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {submitMessage.text}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingLogo ? 'Updating Logo...' : 'Adding Logo...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingLogo ? 'Update Logo' : 'Add Logo'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Manage Logos Section */
          <div className="max-w-7xl mx-auto">
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
            </div>

            {/* Logos Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}>
              {filteredLogos.map((logo) => (
                <div
                  key={logo.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Logo Preview */}
                      <div className="h-32 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: logo.color }}
                        >
                          {logo.name.charAt(0)}
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <div
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: logo.color }}
                            title={`Primary: ${logo.color}`}
                          />
                          <div
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: logo.secondaryColor }}
                            title={`Secondary: ${logo.secondaryColor}`}
                          />
                        </div>
                      </div>

                      {/* Logo Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{logo.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{logo.type}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditLogo(logo)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                              title="Edit logo"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLogo(logo.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                              title="Delete logo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {logo.industry}
                          </span>
                          <span className="capitalize">{logo.shape}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {logo.likes}
                            </span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {logo.downloads}
                            </span>
                          </div>
                          <span>{logo.createdAt}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: logo.color }}
                          >
                            {logo.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{logo.name}</h3>
                          <p className="text-sm text-gray-600">{logo.type} • {logo.industry}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {logo.shape}
                            </span>
                            <span className="text-xs text-gray-500">
                              Created: {logo.createdAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {logo.likes}
                          </span>
                          <span className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {logo.downloads}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditLogo(logo)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLogo(logo.id)}
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

            {filteredLogos.length === 0 && (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No logos found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Your First Logo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddLogoPage;