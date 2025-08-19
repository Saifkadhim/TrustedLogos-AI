import React from 'react';
import { X, Heart, Tag, Palette, Shapes, Globe } from 'lucide-react';

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

  // Download removed per request

  const [liked, setLiked] = React.useState(false);
  const handleLike = () => {
    setLiked(prev => !prev);
    if (onLike) onLike(logo.id);
  };

  let websiteHost: string | null = null;
  if (logo.designerUrl) {
    try {
      websiteHost = new URL(logo.designerUrl).hostname.replace(/^www\./, '');
    } catch {}
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Fixed square image without shadow */}
          <div className="md:w-3/5 p-6 bg-gray-50 flex items-center justify-center relative">
            <div className="w-[20rem] h-[20rem] md:w-[36rem] md:h-[36rem] flex items-center justify-center">
              {logo.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                  style={{ backgroundColor: logo.primaryColor }}
                >
                  {logo.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Heart Icon bottom-left: outline/white -> red when liked */}
            <button
              onClick={handleLike}
              className="absolute bottom-4 left-4 p-2"
              title="Like this logo"
            >
              <Heart className={`h-7 w-7 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-transparent'}`} />
            </button>
          </div>

          {/* Right Side - Details */}
          <div className="md:w-2/5 p-6 overflow-y-auto max-h-[92vh]">
            {/* Name */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{logo.name}</h2>

            {/* Website */}
            {websiteHost && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Globe className="h-4 w-4 mr-2" />
                <a
                  href={logo.designerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {websiteHost}
                </a>
              </div>
            )}

            {/* Description */}
            {logo.information && (
              <p className="text-sm text-gray-700 leading-relaxed mb-6">{logo.information}</p>
            )}

            {/* Logo Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo Details</h3>
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
                <div className="flex items-center">
                  <Shapes className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600 w-20">Shape:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{logo.shape}</span>
                </div>

                {/* Colors */}
                <div className="flex items-center">
                  <Palette className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600 w-20">Colors:</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: logo.primaryColor }} />
                      <span className="text-sm font-mono text-gray-800">{logo.primaryColor}</span>
                    </div>
                    {logo.secondaryColor && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: logo.secondaryColor }} />
                        <span className="text-sm font-mono text-gray-800">{logo.secondaryColor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions removed: Download button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoModal;