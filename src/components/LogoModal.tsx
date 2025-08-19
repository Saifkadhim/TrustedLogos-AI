import React from 'react';
import { X, Download, Heart, Eye, Calendar, Tag, Palette, Shapes, Globe, Info } from 'lucide-react';

interface Logo {
  id: string;
  name: string;
  type: string;
  industry: string;
  subcategory?: string;
  primaryColor: string;
  secondaryColor?: string;
  shape: string;
  information?: string;
  designerUrl?: string;
  imageUrl?: string;
  downloads: number;
  likes: number;
  createdAt: string;
}

interface LogoModalProps {
  logo: Logo | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (logoId: string) => void;
  onLike?: (logoId: string) => void;
}

const LogoModal: React.FC<LogoModalProps> = ({ 
  logo, 
  isOpen, 
  onClose, 
  onDownload, 
  onLike 
}) => {
  if (!isOpen || !logo) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(logo.id);
    }
    // You can also trigger actual download here if needed
  };

  const handleLike = () => {
    if (onLike) {
      onLike(logo.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{logo.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Logo Display */}
          <div className="md:w-1/2 p-6 bg-gray-50 flex items-center justify-center relative">
            <div className="text-center">
              {logo.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="max-w-full max-h-80 object-contain mx-auto rounded-lg shadow-sm"
                />
              ) : (
                <div 
                  className="w-80 h-80 rounded-lg flex items-center justify-center text-white text-4xl font-bold shadow-sm"
                  style={{ backgroundColor: logo.primaryColor }}
                >
                  {logo.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Heart Icon in Bottom Left Corner */}
            <button
              onClick={handleLike}
              className="absolute bottom-4 left-4 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg hover:scale-110 transform duration-200"
              title="Like this logo"
            >
              <Heart className="h-6 w-6" />
            </button>
          </div>

          {/* Right Side - Logo Information */}
          <div className="md:w-1/2 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Logo Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-600 w-20">Type:</span>
                    <span className="text-sm font-medium text-gray-900">{logo.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-600 w-20">Industry:</span>
                    <span className="text-sm font-medium text-gray-900">{logo.industry}</span>
                  </div>
                  {logo.subcategory && (
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-gray-500 mr-3" />
                      <span className="text-sm text-gray-600 w-20">Category:</span>
                      <span className="text-sm font-medium text-gray-900">{logo.subcategory}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Shapes className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-600 w-20">Shape:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{logo.shape}</span>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: logo.primaryColor }}
                    ></div>
                    <div>
                      <p className="text-xs text-gray-600">Primary</p>
                      <p className="text-sm font-mono font-medium">{logo.primaryColor}</p>
                    </div>
                  </div>
                  {logo.secondaryColor && (
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: logo.secondaryColor }}
                      ></div>
                      <div>
                        <p className="text-xs text-gray-600">Secondary</p>
                        <p className="text-sm font-mono font-medium">{logo.secondaryColor}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {logo.information && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{logo.information}</p>
                </div>
              )}

              {/* Designer URL */}
              {logo.designerUrl && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Designer
                  </h4>
                  <a 
                    href={logo.designerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {logo.designerUrl}
                  </a>
                </div>
              )}

              {/* Stats */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Eye className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{logo.downloads}</p>
                    <p className="text-xs text-gray-600">Downloads</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{logo.likes}</p>
                    <p className="text-xs text-gray-600">Likes</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(logo.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">Created</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoModal;