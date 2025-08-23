import React, { useState, useEffect } from 'react';
import { Upload, Plus, Save, AlertCircle, CheckCircle, Image, Palette, Tag, Shapes, Edit3, Loader } from 'lucide-react';
import { useLogos, type Logo, type CreateLogoData, type UpdateLogoData } from '../hooks/useLogos-safe';
import { INDUSTRY_CATEGORIES, getIndustryCategoryList, getSubcategoriesForIndustry } from '../utils/industryCategories';

const AddLogoPage = () => {
  const { 
    logos: allLogos, 
    loading, 
    error: hookError, 
    addLogo, 
    updateLogo, 
    refreshLogos 
  } = useLogos();

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

  // Form states only
  const [editingLogo, setEditingLogo] = useState(null);

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

  // Shape options
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

  // Industry categories
  const industryCategories = getIndustryCategoryList();

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

      if (editingLogo) {
        // Update existing logo
        const updateData: UpdateLogoData = {
          ...logoData,
          imageFile: logoImageFile || undefined
        };
        await updateLogo(editingLogo.id, updateData);
        setSubmitMessage({ type: 'success', text: 'Logo updated successfully!' });
        setEditingLogo(null);
      } else {
        // Add new logo
        await addLogo(logoData);
        setSubmitMessage({ type: 'success', text: 'Logo uploaded successfully!' });
      }
      
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

  // Clear form
  const clearForm = () => {
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
    setEditingLogo(null);
    setSubmitMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Plus className="h-8 w-8 text-blue-600 mr-3" />
                {editingLogo ? 'Edit Logo' : 'Add New Logo'}
              </h1>
              <p className="text-gray-600 mt-2">
                {editingLogo ? 'Update logo information and details' : 'Upload and add a new logo to your collection'}
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">✨ Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {editingLogo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Edit3 className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">Editing: {editingLogo.name}</span>
                </div>
                <button
                  onClick={clearForm}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Cancel Edit
                </button>
              </div>
            </div>
          )}

          {/* Submit Message */}
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {submitMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {submitMessage.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 text-blue-600 mr-2" />
                Basic Information
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
                    placeholder="Enter logo name (e.g., Apple, Nike, Google)"
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
                    {logoTypes.map(type => (
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
                    onChange={(e) => {
                      setIndustryCategory(e.target.value);
                      setSubcategory(''); // Reset subcategory when industry changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select industry</option>
                    {industryCategories.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                {industryCategory && (
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select subcategory (optional)</option>
                      {getSubcategoriesForIndustry(industryCategory).map((sub) => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                )}

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

            {/* Image Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 text-purple-600 mr-2" />
                Logo Image
              </h2>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {logoImageFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Image className="h-12 w-12 text-green-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">File Selected</p>
                      <p className="text-sm text-gray-600 mt-1">{logoImageFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {(logoImageFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLogoImageFile(null)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                        required
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer"
                      >
                        <span className="text-lg font-medium text-blue-600 hover:text-blue-700">
                          Click to upload
                        </span>
                        <span className="text-gray-600"> or drag and drop</span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Edit3 className="h-5 w-5 text-green-600 mr-2" />
                Additional Information
              </h2>
              
              <div className="space-y-6">
                {/* Logo Information */}
                <div>
                  <label htmlFor="logoInformation" className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Information
                  </label>
                  <textarea
                    id="logoInformation"
                    value={logoInformation}
                    onChange={(e) => setLogoInformation(e.target.value)}
                    placeholder="Enter detailed information about the logo (e.g., history, meaning, design inspiration, brand story)"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide background information, design story, or any relevant details about this logo.
                  </p>
                </div>

                {/* Designer/Owner URL */}
                <div>
                  <label htmlFor="designerUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Designer/Owner URL
                  </label>
                  <input
                    type="url"
                    id="designerUrl"
                    value={designerUrl}
                    onChange={(e) => setDesignerUrl(e.target.value)}
                    placeholder="https://website.com or https://portfolio.designer.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Link to the logo designer's portfolio, company website, or brand owner's site.
                  </p>
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
                      className="h-12 w-16 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={logoColor}
                      onChange={(e) => setLogoColor(e.target.value)}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                      placeholder="#000000"
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
                      className="h-12 w-16 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryLogoColor}
                      onChange={(e) => setSecondaryLogoColor(e.target.value)}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear Form
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingLogo ? 'Updating Logo...' : 'Adding Logo...'}
                    </>
                  ) : loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingLogo ? 'Update Logo' : 'Add Logo'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLogoPage;