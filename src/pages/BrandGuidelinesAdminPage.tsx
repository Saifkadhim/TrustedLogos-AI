import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff,
  Save,
  X,
  ExternalLink,
  AlertCircle,
  Upload,
  Smartphone,
  Shirt,
  Utensils,
  Car,
  Film,
  Building2,
  FileText,
  CheckCircle,
  Download
} from 'lucide-react';
import { useBrandGuidelines, BrandGuideline, CreateBrandGuidelineData, UpdateBrandGuidelineData } from '../hooks/useBrandGuidelines';
import { supabase } from '../lib/supabase';

interface BrandGuidelineFormData {
  brand_name: string;
  title: string;
  description: string;
  pdf_url: string;
  thumbnail_url: string;
  category_id: string;
  industry: string;
  year_founded: string;
  logo_story: string;
  is_public: boolean;
  is_featured: boolean;
  tags: string;
}

const BrandGuidelinesAdminPage: React.FC = () => {
  const {
    brandGuidelines,
    categories,
    loading,
    error,
    createBrandGuideline,
    updateBrandGuideline,
    deleteBrandGuideline,
    clearError
  } = useBrandGuidelines();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<BrandGuideline | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<BrandGuidelineFormData>({
    brand_name: '',
    title: '',
    description: '',
    pdf_url: '',
    thumbnail_url: '',
    category_id: '',
    industry: '',
    year_founded: '',
    logo_story: '',
    is_public: true,
    is_featured: false,
    tags: ''
  });

  // Add state for storing the selected file before upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Reset form
  const resetForm = () => {
    setFormData({
      brand_name: '',
      title: '',
      description: '',
      pdf_url: '',
      thumbnail_url: '',
      category_id: '',
      industry: '',
      year_founded: '',
      logo_story: '',
      is_public: true,
      is_featured: false,
      tags: ''
    });
    setSelectedFile(null);
    setEditingGuideline(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (guideline: BrandGuideline) => {
    setFormData({
      brand_name: guideline.brand_name,
      title: guideline.title,
      description: guideline.description || '',
      pdf_url: guideline.pdf_url,
      thumbnail_url: guideline.thumbnail_url || '',
      category_id: guideline.category_id || '',
      industry: guideline.industry || '',
      year_founded: guideline.year_founded?.toString() || '',
      logo_story: guideline.logo_story || '',
      is_public: guideline.is_public,
      is_featured: guideline.is_featured,
      tags: Array.isArray(guideline.tags) ? guideline.tags.join(', ') : ''
    });
    setSelectedFile(null);
    setEditingGuideline(guideline);
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalPdfUrl = formData.pdf_url;
    
    // If there's a selected file, upload it first
    if (selectedFile) {
      try {
        setUploadingFile(true);
        
        // Check storage access first
        const hasAccess = await checkStorageAccess();
        if (!hasAccess) {
          throw new Error('Cannot access storage bucket. Please check if the bucket exists and you have proper permissions.');
        }

        // Validate file type
        if (selectedFile.type !== 'application/pdf') {
          alert('Please upload a PDF file');
          setUploadingFile(false);
          return;
        }

        // Validate file size (50MB limit)
        if (selectedFile.size > 50 * 1024 * 1024) {
          alert('File size must be less than 50MB');
          setUploadingFile(false);
          return;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `public/${fileName}`;
        
        console.log('Upload details:', {
          fileName,
          filePath,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          bucket: 'brand-guidelines'
        });

        // Upload to Supabase storage
        console.log('Starting upload...');
        const { data, error } = await supabase.storage
          .from('brand-guidelines')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        console.log('Upload response:', { data, error });

        if (error) {
          throw error;
        }

        // Get public URL
        console.log('Getting public URL...');
        const { data: urlData } = supabase.storage
          .from('brand-guidelines')
          .getPublicUrl(filePath);
        
        console.log('URL response:', urlData);

        // Use the new PDF URL
        finalPdfUrl = urlData.publicUrl;
        
        console.log('File uploaded successfully:', urlData.publicUrl);

        setUploadingFile(false);

      } catch (error) {
        console.error('Upload error:', error);
        console.error('Error type:', typeof error);
        console.error('Error constructor:', error?.constructor?.name);
        console.error('Error keys:', error ? Object.keys(error) : 'No keys');
        
        // More detailed error message
        let errorMessage = 'Failed to upload file. ';
        if (error instanceof Error) {
          errorMessage += error.message;
        } else if (typeof error === 'object' && error !== null) {
          errorMessage += JSON.stringify(error, null, 2);
        } else {
          errorMessage += String(error);
        }
        
        console.error('Full error details:', errorMessage);
        alert(errorMessage);
        setUploadingFile(false);
        return; // Don't proceed with form submission if upload fails
      }
    }
    
    // If no file selected and no URL provided, show error
    if (!selectedFile && !finalPdfUrl) {
      alert('Please select a PDF file or provide a PDF URL');
      return;
    }
    
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    if (editingGuideline) {
      // Update existing guideline
      const updateData: UpdateBrandGuidelineData = {
        id: editingGuideline.id,
        brand_name: formData.brand_name,
        title: formData.title,
        description: formData.description || undefined,
        pdf_url: finalPdfUrl,
        thumbnail_url: formData.thumbnail_url || undefined,
        category_id: formData.category_id || undefined,
        industry: formData.industry || undefined,
        year_founded: formData.year_founded ? parseInt(formData.year_founded) : undefined,
        logo_story: formData.logo_story || undefined,
        is_public: formData.is_public,
        is_featured: formData.is_featured,
        tags: tagsArray
      };
      
      const success = await updateBrandGuideline(updateData);
      if (success) {
        resetForm();
      }
    } else {
      // Create new guideline
      const createData: CreateBrandGuidelineData = {
        brand_name: formData.brand_name,
        title: formData.title,
        description: formData.description || undefined,
        pdf_url: finalPdfUrl,
        thumbnail_url: formData.thumbnail_url || undefined,
        category_id: formData.category_id || undefined,
        industry: formData.industry || undefined,
        year_founded: formData.year_founded ? parseInt(formData.year_founded) : undefined,
        logo_story: formData.logo_story || undefined,
        is_public: formData.is_public,
        is_featured: formData.is_featured,
        tags: tagsArray
      };
      
      const newGuideline = await createBrandGuideline(createData);
      if (newGuideline) {
        resetForm();
      }
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Check if storage bucket is accessible
  const checkStorageAccess = async () => {
    try {
      console.log('Checking storage access for bucket: brand-guidelines');
      
      const { data, error } = await supabase.storage
        .from('brand-guidelines')
        .list('', { limit: 1 });
      
      console.log('Storage list result:', { data, error });
      
      if (error) {
        console.error('Storage access error:', error);
        console.error('Error details:', {
          message: error.message
        });
        return false;
      }
      
      console.log('Storage access successful');
      return true;
    } catch (err) {
      console.error('Storage check failed:', err);
      console.error('Exception details:', {
        type: typeof err,
        error: String(err)
      });
      return false;
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const success = await deleteBrandGuideline(id);
    if (success) {
      setShowDeleteConfirm(null);
    }
  };

  // Filter guidelines
  const filteredGuidelines = brandGuidelines.filter(guideline => {
    const matchesSearch = guideline.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guideline.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Guidelines Management</h1>
        <p className="text-gray-600">Manage brand guideline PDFs and metadata</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Brand Guidelines
        </button>
        
        <button
          onClick={async () => {
            const hasAccess = await checkStorageAccess();
            if (hasAccess) {
              alert('✅ Storage bucket is accessible!');
            } else {
              alert('❌ Cannot access storage bucket. Please check your setup.');
            }
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Test Storage Access
        </button>
        
        <button
          onClick={async () => {
            try {
              console.log('Testing Supabase connection...');
              const { data, error } = await supabase.auth.getSession();
              console.log('Auth test result:', { data, error });
              alert('Supabase connection: ' + (error ? '❌ Failed' : '✅ Working'));
            } catch (err) {
              console.error('Supabase test failed:', err);
              alert('❌ Supabase connection failed');
            }
          }}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
        >
          🔌 Test Supabase
        </button>
        
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search brand guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingGuideline ? 'Edit Brand Guidelines' : 'Add Brand Guidelines'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand_name}
                      onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PDF File *
                    </label>
                    
                    <p className="text-xs text-gray-500 mb-2">
                      Select a PDF file or drag & drop. The file will be uploaded when you submit the form.
                    </p>
                    
                    {/* File Upload Area */}
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {selectedFile || formData.pdf_url ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">
                              {selectedFile ? 'File selected' : 'PDF uploaded successfully!'}
                            </span>
                          </div>
                          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>
                              {selectedFile ? selectedFile.name : formData.pdf_url.split('/').pop()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFormData({...formData, pdf_url: ''});
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove {selectedFile ? 'File' : 'PDF'}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF files only, max 50MB</p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedFile(file);
                            }}
                            className="hidden"
                            id="pdf-upload"
                          />
                          <label
                            htmlFor="pdf-upload"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                          >
                            Choose PDF File
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Manual URL Input (fallback) */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Or enter PDF URL manually
                      </label>
                      <input
                        type="url"
                        value={formData.pdf_url}
                        onChange={(e) => setFormData({...formData, pdf_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/brand-guidelines.pdf"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Technology, Fashion"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year Founded
                    </label>
                    <input
                      type="number"
                      value={formData.year_founded}
                      onChange={(e) => setFormData({...formData, year_founded: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1976"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo Story
                    </label>
                    <textarea
                      value={formData.logo_story}
                      onChange={(e) => setFormData({...formData, logo_story: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief story about the logo design..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Public Guidelines, PDF, Colors Included"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_public}
                        onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Public</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={uploadingFile}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingFile}
                    className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
                      uploadingFile 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {uploadingFile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {editingGuideline ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Brand Guidelines ({filteredGuidelines.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading brand guidelines...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuidelines.map((guideline) => (
                  <tr key={guideline.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{guideline.brand_name}</div>
                        <div className="text-sm text-gray-500">{guideline.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {guideline.category && (
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(guideline.category.name)}
                          <span className="text-sm text-gray-900">{guideline.category.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {guideline.industry || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {guideline.is_public ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye className="h-3 w-3 mr-1" />
                            Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Private
                          </span>
                        )}
                        {guideline.is_featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span>{guideline.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="h-4 w-4 text-gray-400" />
                          <span>{guideline.downloads}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(guideline)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(guideline.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <a
                          href={guideline.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredGuidelines.length === 0 && (
          <div className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No brand guidelines found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Brand Guidelines</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this brand guideline? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandGuidelinesAdminPage; 