import React, { useState } from 'react';
import { Zap, Sparkles, Download, RefreshCw, Wand2, Palette, Type, Shapes, Settings, Copy, Heart, Star, Eye, Grid, List, Filter, Search, Save, Share2, Magnet as Magic, Lightbulb, Target, Rocket, Award, Crown, Gem } from 'lucide-react';

const AILogoGeneratorPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState('modern');
  const [colorScheme, setColorScheme] = useState('blue');
  const [logoType, setLogoType] = useState('combination');
  const [keywords, setKeywords] = useState('');
  const [generatedLogos, setGeneratedLogos] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favoriteLogos, setFavoriteLogos] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Real Estate',
    'Fashion', 'Food & Beverage', 'Automotive', 'Sports & Fitness', 'Beauty',
    'Consulting', 'Legal', 'Marketing', 'Construction', 'Entertainment',
    'Travel', 'E-commerce', 'Non-Profit', 'Manufacturing', 'Other'
  ];

  const styles = [
    { value: 'modern', label: 'Modern', description: 'Clean, contemporary design' },
    { value: 'minimalist', label: 'Minimalist', description: 'Simple, elegant approach' },
    { value: 'vintage', label: 'Vintage', description: 'Classic, retro feel' },
    { value: 'bold', label: 'Bold', description: 'Strong, impactful design' },
    { value: 'elegant', label: 'Elegant', description: 'Sophisticated, refined' },
    { value: 'playful', label: 'Playful', description: 'Fun, creative approach' },
    { value: 'professional', label: 'Professional', description: 'Corporate, business-focused' },
    { value: 'artistic', label: 'Artistic', description: 'Creative, unique design' }
  ];

  const colorSchemes = [
    { value: 'blue', label: 'Blue Tones', colors: ['#0066cc', '#4285f4', '#1e40af'] },
    { value: 'green', label: 'Green Tones', colors: ['#10b981', '#059669', '#047857'] },
    { value: 'purple', label: 'Purple Tones', colors: ['#8b5cf6', '#7c3aed', '#6d28d9'] },
    { value: 'red', label: 'Red Tones', colors: ['#ef4444', '#dc2626', '#b91c1c'] },
    { value: 'orange', label: 'Orange Tones', colors: ['#f97316', '#ea580c', '#c2410c'] },
    { value: 'pink', label: 'Pink Tones', colors: ['#ec4899', '#db2777', '#be185d'] },
    { value: 'teal', label: 'Teal Tones', colors: ['#14b8a6', '#0d9488', '#0f766e'] },
    { value: 'monochrome', label: 'Monochrome', colors: ['#000000', '#374151', '#6b7280'] }
  ];

  const logoTypes = [
    { value: 'wordmark', label: 'Wordmark', description: 'Text-only logo' },
    { value: 'lettermark', label: 'Lettermark', description: 'Initials or monogram' },
    { value: 'pictorial', label: 'Pictorial', description: 'Icon or symbol' },
    { value: 'abstract', label: 'Abstract', description: 'Abstract geometric shape' },
    { value: 'combination', label: 'Combination', description: 'Text + symbol' },
    { value: 'emblem', label: 'Emblem', description: 'Text inside symbol' }
  ];

  const generateLogos = async () => {
    if (!companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate sample logos based on inputs
    const sampleLogos = [
      {
        id: 1,
        name: `${companyName} Logo 1`,
        style: style,
        type: logoType,
        colors: colorSchemes.find(c => c.value === colorScheme)?.colors || ['#0066cc'],
        preview: companyName.charAt(0).toUpperCase(),
        description: `${style} ${logoType} design for ${companyName}`,
        rating: 4.8,
        downloads: 0,
        variations: 3
      },
      {
        id: 2,
        name: `${companyName} Logo 2`,
        style: style,
        type: logoType,
        colors: colorSchemes.find(c => c.value === colorScheme)?.colors || ['#0066cc'],
        preview: companyName.substring(0, 2).toUpperCase(),
        description: `Alternative ${style} design for ${companyName}`,
        rating: 4.6,
        downloads: 0,
        variations: 4
      },
      {
        id: 3,
        name: `${companyName} Logo 3`,
        style: style,
        type: logoType,
        colors: colorSchemes.find(c => c.value === colorScheme)?.colors || ['#0066cc'],
        preview: companyName.charAt(0).toUpperCase() + companyName.charAt(companyName.length - 1).toUpperCase(),
        description: `Creative ${style} approach for ${companyName}`,
        rating: 4.7,
        downloads: 0,
        variations: 2
      },
      {
        id: 4,
        name: `${companyName} Logo 4`,
        style: style,
        type: logoType,
        colors: colorSchemes.find(c => c.value === colorScheme)?.colors || ['#0066cc'],
        preview: companyName.charAt(0).toUpperCase(),
        description: `Professional ${style} design for ${companyName}`,
        rating: 4.9,
        downloads: 0,
        variations: 5
      },
      {
        id: 5,
        name: `${companyName} Logo 5`,
        style: style,
        type: logoType,
        colors: colorSchemes.find(c => c.value === colorScheme)?.colors || ['#0066cc'],
        preview: companyName.substring(0, 3).toUpperCase(),
        description: `Unique ${style} concept for ${companyName}`,
        rating: 4.5,
        downloads: 0,
        variations: 3
      },
      {
        id: 6,
        name: `${companyName} Logo 6`,
        style: style,
        type: logoType,
        colors: colorSchemes.find(c => c.value === colorScheme)?.colors || ['#0066cc'],
        preview: companyName.charAt(0).toUpperCase(),
        description: `Elegant ${style} design for ${companyName}`,
        rating: 4.4,
        downloads: 0,
        variations: 4
      }
    ];

    setGeneratedLogos(sampleLogos);
    setIsGenerating(false);
  };

  const toggleFavorite = (logoId) => {
    setFavoriteLogos(prev => 
      prev.includes(logoId) 
        ? prev.filter(id => id !== logoId)
        : [...prev, logoId]
    );
  };

  const downloadLogo = (logo) => {
    // In a real app, this would trigger actual download
    console.log(`Downloading ${logo.name}`);
  };

  const copyLogoName = (name) => {
    navigator.clipboard.writeText(name);
  };

  const filteredLogos = filterFavorites 
    ? generatedLogos.filter(logo => favoriteLogos.includes(logo.id))
    : generatedLogos;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Magic className="h-6 w-6 text-purple-600 mr-2" />
              AI Logo Generator
            </h1>
            <p className="text-gray-600 mt-1">
              Create professional logos instantly with artificial intelligence
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg">
            <span className="text-sm font-medium flex items-center">
              <Crown className="h-4 w-4 mr-1" />
              AI Powered
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Logo Generation Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Design Your Logo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (optional)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., innovative, reliable, modern"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Style Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Logo Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {styles.map((styleOption) => (
                  <button
                    key={styleOption.value}
                    onClick={() => setStyle(styleOption.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      style === styleOption.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{styleOption.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{styleOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Type Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Logo Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {logoTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setLogoType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      logoType === type.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Scheme
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => setColorScheme(scheme.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      colorScheme === scheme.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {scheme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{scheme.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-6">
              <button
                onClick={generateLogos}
                disabled={!companyName.trim() || isGenerating}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  !companyName.trim() || isGenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating Logos...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate AI Logos
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Logos */}
          {generatedLogos.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                  Generated Logos ({filteredLogos.length})
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setFilterFavorites(!filterFavorites)}
                    className={`flex items-center px-3 py-1 text-sm border rounded-lg transition-colors duration-200 ${
                      filterFavorites
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${filterFavorites ? 'fill-current' : ''}`} />
                    Favorites ({favoriteLogos.length})
                  </button>
                  
                  <button
                    onClick={generateLogos}
                    disabled={isGenerating}
                    className="flex items-center px-3 py-1 text-sm text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>

                  <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1 rounded transition-colors duration-200 ${
                        viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1 rounded transition-colors duration-200 ${
                        viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Logos Grid */}
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }`}>
                {filteredLogos.map((logo) => (
                  <div
                    key={logo.id}
                    className={`bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer ${
                      viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                    }`}
                    onClick={() => setSelectedLogo(logo)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Logo Preview */}
                        <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                          <div
                            className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
                            style={{ 
                              backgroundColor: logo.colors[0],
                              background: `linear-gradient(135deg, ${logo.colors[0]}, ${logo.colors[1] || logo.colors[0]})`
                            }}
                          >
                            {logo.preview}
                          </div>
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(logo.id);
                              }}
                              className={`p-1 rounded-full transition-colors duration-200 ${
                                favoriteLogos.includes(logo.id)
                                  ? 'text-red-600 bg-white shadow-sm'
                                  : 'text-gray-400 hover:text-red-600 bg-white shadow-sm'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${favoriteLogos.includes(logo.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Logo Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{logo.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{logo.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                {logo.style}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                {logo.type}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                              <span>{logo.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {logo.variations} variations
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyLogoName(logo.name);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                title="Copy name"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadLogo(logo);
                                }}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="flex items-center space-x-4 flex-1">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ 
                              backgroundColor: logo.colors[0],
                              background: `linear-gradient(135deg, ${logo.colors[0]}, ${logo.colors[1] || logo.colors[0]})`
                            }}
                          >
                            {logo.preview}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{logo.name}</h3>
                            <p className="text-sm text-gray-600">{logo.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {logo.style}
                              </span>
                              <span className="text-xs text-gray-500">
                                {logo.variations} variations
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span>{logo.rating}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(logo.id);
                              }}
                              className={`p-2 rounded transition-colors duration-200 ${
                                favoriteLogos.includes(logo.id)
                                  ? 'text-red-600'
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${favoriteLogos.includes(logo.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyLogoName(logo.name);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadLogo(logo);
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {filteredLogos.length === 0 && filterFavorites && (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No favorite logos yet. Click the heart icon to add favorites!</p>
                </div>
              )}
            </div>
          )}

          {/* How It Works Section */}
          {generatedLogos.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Rocket className="h-5 w-5 text-green-600 mr-2" />
                How AI Logo Generation Works
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Input Details</h3>
                  <p className="text-sm text-gray-600">Enter your company name, industry, and preferences</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">AI Processing</h3>
                  <p className="text-sm text-gray-600">Our AI analyzes your inputs and generates unique designs</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Review & Select</h3>
                  <p className="text-sm text-gray-600">Browse generated logos and save your favorites</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Download</h3>
                  <p className="text-sm text-gray-600">Download your chosen logo in multiple formats</p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-900 mb-2 flex items-center">
                  <Gem className="h-4 w-4 mr-2" />
                  AI-Powered Features
                </h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Industry-specific design intelligence</li>
                  <li>• Color psychology optimization</li>
                  <li>• Typography matching algorithms</li>
                  <li>• Brand personality analysis</li>
                  <li>• Scalability and versatility testing</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AILogoGeneratorPage;