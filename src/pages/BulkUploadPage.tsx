import React, { useState, useCallback } from 'react';
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useLogos } from '../hooks/useLogos';

interface LogoFile {
  file: File;
  id: string;
  preview: string;
  name: string;
  type: string;
  industry: string;
  primaryColor: string;
  shape: string;
  information: string;
  designerUrl: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const LOGO_TYPES = ['Wordmarks', 'Lettermarks', 'Pictorial Marks', 'Abstract Marks', 'Combination Marks', 'Emblem Logos', 'Mascot Logos'];
const INDUSTRIES = ['Technology', 'Fashion', 'Food & Drinks', 'Restaurant', 'Automotive', 'E-commerce', 'Electronics', 'Industrial', 'Internet', 'Media/TV', 'Sport', 'Other'];
const SHAPES = ['rectangle', 'circle', 'triangle'];
const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

const BulkUploadPage: React.FC = () => {
  const { addLogo } = useLogos();
  const [logoFiles, setLogoFiles] = useState<LogoFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Auto-generate name from filename
  const generateNameFromFile = (filename: string): string => {
    return filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ')    // Replace hyphens and underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
      .trim();
  };

  // Handle file selection
  const handleFiles = useCallback((files: FileList) => {
    const newLogoFiles: LogoFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const preview = URL.createObjectURL(file);
        
        newLogoFiles.push({
          file,
          id,
          preview,
          name: generateNameFromFile(file.name),
          type: LOGO_TYPES[0],
          industry: INDUSTRIES[0],
          primaryColor: COLORS[0],
          shape: SHAPES[0],
          information: '',
          designerUrl: '',
          status: 'pending'
        });
      }
    });
    
    setLogoFiles(prev => [...prev, ...newLogoFiles]);
  }, []);

  // Drag and drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  // File input handler
  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Update logo file data
  const updateLogoFile = (id: string, updates: Partial<LogoFile>) => {
    setLogoFiles(prev => prev.map(logo => 
      logo.id === id ? { ...logo, ...updates } : logo
    ));
  };

  // Remove logo file
  const removeLogoFile = (id: string) => {
    setLogoFiles(prev => {
      const logoToRemove = prev.find(logo => logo.id === id);
      if (logoToRemove) {
        URL.revokeObjectURL(logoToRemove.preview);
      }
      return prev.filter(logo => logo.id !== id);
    });
  };

  // Upload all logos
  const uploadAllLogos = async () => {
    setIsUploading(true);
    
    for (const logoFile of logoFiles) {
      if (logoFile.status !== 'pending') continue;
      
      updateLogoFile(logoFile.id, { status: 'uploading' });
      
      try {
        await addLogo({
          name: logoFile.name,
          type: logoFile.type,
          industry: logoFile.industry,
          primaryColor: logoFile.primaryColor,
          secondaryColor: '#ffffff',
          shape: logoFile.shape,
          information: logoFile.information || `Bulk uploaded logo: ${logoFile.name}`,
          designerUrl: logoFile.designerUrl,
          image: logoFile.file
        });
        
        updateLogoFile(logoFile.id, { status: 'success' });
      } catch (error) {
        updateLogoFile(logoFile.id, { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed' 
        });
      }
    }
    
    setIsUploading(false);
  };

  // Auto-fill all logos with same data
  const autoFillAll = (field: keyof LogoFile, value: string) => {
    setLogoFiles(prev => prev.map(logo => ({ ...logo, [field]: value })));
  };

  const successCount = logoFiles.filter(logo => logo.status === 'success').length;
  const errorCount = logoFiles.filter(logo => logo.status === 'error').length;
  const pendingCount = logoFiles.filter(logo => logo.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Logo Upload</h1>
        <p className="text-gray-600">Upload multiple logos at once with drag-and-drop functionality</p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop logo files here or click to select
        </h3>
        <p className="text-gray-500 mb-4">
          Supports: JPG, PNG, SVG (up to 10MB each)
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileInputChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
        >
          Select Files
        </label>
      </div>

      {/* Bulk Actions */}
      {logoFiles.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply Type to All
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                onChange={(e) => autoFillAll('type', e.target.value)}
              >
                {LOGO_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply Industry to All
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                onChange={(e) => autoFillAll('industry', e.target.value)}
              >
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply Color to All
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                onChange={(e) => autoFillAll('primaryColor', e.target.value)}
              >
                {COLORS.map(color => (
                  <option key={color} value={color} style={{ backgroundColor: color }}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply Shape to All
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                onChange={(e) => autoFillAll('shape', e.target.value)}
              >
                {SHAPES.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Logo Files List */}
      {logoFiles.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Logos to Upload ({logoFiles.length})
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                ✅ {successCount} • ❌ {errorCount} • ⏳ {pendingCount}
              </span>
              <button
                onClick={uploadAllLogos}
                disabled={isUploading || pendingCount === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : `Upload ${pendingCount} Logos`}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {logoFiles.map((logoFile) => (
              <div key={logoFile.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    <img
                      src={logoFile.preview}
                      alt={logoFile.name}
                      className="w-16 h-16 object-contain border border-gray-200 rounded"
                    />
                  </div>

                  {/* Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={logoFile.name}
                        onChange={(e) => updateLogoFile(logoFile.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={logoFile.type}
                        onChange={(e) => updateLogoFile(logoFile.id, { type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        {LOGO_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <select
                        value={logoFile.industry}
                        onChange={(e) => updateLogoFile(logoFile.id, { industry: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        {INDUSTRIES.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {logoFile.status === 'pending' && (
                      <span className="text-gray-500">⏳</span>
                    )}
                    {logoFile.status === 'uploading' && (
                      <span className="text-blue-500">⏳ Uploading...</span>
                    )}
                    {logoFile.status === 'success' && (
                      <span className="text-green-500">✅ Success</span>
                    )}
                    {logoFile.status === 'error' && (
                      <span className="text-red-500" title={logoFile.error}>❌ Error</span>
                    )}
                    <button
                      onClick={() => removeLogoFile(logoFile.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploadPage;