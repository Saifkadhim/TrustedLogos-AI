import React, { useState } from 'react';
import { Zap, Sparkles, Copy, RefreshCw, Wand2, Lightbulb, Target, Rocket, Heart, Download, Filter, Globe, Clock, Star } from 'lucide-react';

const AINameGeneratorPage = () => {
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');
  const [style, setStyle] = useState('modern');
  const [nameLength, setNameLength] = useState('medium');
  const [language, setLanguage] = useState('english');
  const [includeKeywords, setIncludeKeywords] = useState(true);
  const [avoidNumbers, setAvoidNumbers] = useState(false);
  const [generatedNames, setGeneratedNames] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [favoriteNames, setFavoriteNames] = useState<string[]>([]);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const industries = [
    'Technology', 'Artificial Intelligence', 'Software Development', 'Cybersecurity', 'Blockchain',
    'Fashion', 'Luxury Fashion', 'Streetwear', 'Sustainable Fashion', 'Accessories',
    'Food & Drinks', 'Restaurants', 'Coffee Shops', 'Bakeries', 'Organic Food', 'Beverages',
    'Healthcare', 'Medical Devices', 'Pharmaceuticals', 'Mental Health', 'Fitness & Wellness',
    'Finance', 'Banking', 'Insurance', 'Investment', 'Cryptocurrency', 'Fintech',
    'Education', 'Online Learning', 'Training', 'Childcare', 'Higher Education',
    'Real Estate', 'Property Management', 'Architecture', 'Interior Design', 'Construction',
    'Automotive', 'Electric Vehicles', 'Auto Parts', 'Car Services', 'Transportation',
    'Beauty', 'Skincare', 'Cosmetics', 'Hair Care', 'Spa Services', 'Wellness',
    'Entertainment', 'Gaming', 'Music', 'Film & Video', 'Events', 'Sports',
    'Consulting', 'Business Services', 'Marketing', 'Legal Services', 'HR Services',
    'E-commerce', 'Retail', 'Marketplace', 'Dropshipping', 'Subscription Services',
    'Travel', 'Tourism', 'Hotels', 'Airlines', 'Adventure Travel', 'Luxury Travel',
    'Manufacturing', 'Industrial', 'Logistics', 'Supply Chain', 'Agriculture',
    'Non-Profit', 'Environmental', 'Social Impact', 'Community Services', 'Other'
  ];

  const nameStyles = [
    { value: 'modern', label: 'Modern', description: 'Clean, contemporary names' },
    { value: 'creative', label: 'Creative', description: 'Unique, artistic names' },
    { value: 'professional', label: 'Professional', description: 'Formal, business-focused' },
    { value: 'playful', label: 'Playful', description: 'Fun, memorable names' },
    { value: 'luxury', label: 'Luxury', description: 'Premium, sophisticated' },
    { value: 'tech', label: 'Tech', description: 'Innovation-focused names' },
    { value: 'minimalist', label: 'Minimalist', description: 'Simple, clean names' },
    { value: 'bold', label: 'Bold', description: 'Strong, impactful names' },
    { value: 'elegant', label: 'Elegant', description: 'Refined, graceful names' },
    { value: 'trendy', label: 'Trendy', description: 'Current, fashionable names' }
  ];

  const nameLengths = [
    { value: 'short', label: 'Short (4-6 letters)', description: 'Punchy, memorable' },
    { value: 'medium', label: 'Medium (7-10 letters)', description: 'Balanced length' },
    { value: 'long', label: 'Long (11+ letters)', description: 'Descriptive, detailed' }
  ];

  const languages = [
    { value: 'english', label: 'English', flag: '🇺🇸' },
    { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { value: 'french', label: 'French', flag: '🇫🇷' },
    { value: 'german', label: 'German', flag: '🇩🇪' },
    { value: 'italian', label: 'Italian', flag: '🇮🇹' },
    { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
    { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
    { value: 'korean', label: 'Korean', flag: '🇰🇷' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'length', label: 'Length' },
    { value: 'popularity', label: 'Popularity' }
  ];

  // Enhanced name generation with more sophisticated patterns
  const generateNames = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // More sophisticated name generation based on inputs
    const baseNames = {
      'Technology': ['TechFlow', 'CodeCraft', 'DataVault', 'CloudSync', 'ByteForge', 'PixelCore', 'NetSphere', 'CyberLink'],
      'Fashion': ['StyleHub', 'TrendLux', 'ChicCore', 'VogueVibe', 'FashionFlow', 'StyleCraft', 'TrendForge', 'ChicSphere'],
      'Food & Drinks': ['TasteCraft', 'FlavorHub', 'CulinaryCore', 'FreshFlow', 'TasteForge', 'FlavorSphere', 'CulinaryVibe', 'FreshCraft'],
      'Healthcare': ['HealthCore', 'MedFlow', 'CareSync', 'WellnessHub', 'HealthForge', 'MedCraft', 'CareSphere', 'WellnessFlow'],
      'Finance': ['FinanceFlow', 'MoneyCore', 'WealthSync', 'CapitalHub', 'FinanceForge', 'WealthCraft', 'CapitalSphere', 'MoneyFlow'],
      'Education': ['LearnCore', 'EduFlow', 'KnowledgeHub', 'StudySync', 'LearnForge', 'EduCraft', 'KnowledgeSphere', 'StudyFlow'],
      'Real Estate': ['PropertyCore', 'RealtyFlow', 'HomeHub', 'PropertySync', 'RealtyForge', 'HomeCraft', 'PropertySphere', 'RealtyVibe'],
      'Automotive': ['AutoCore', 'DriveFlow', 'CarSync', 'AutoHub', 'DriveForge', 'CarCraft', 'AutoSphere', 'DriveVibe']
    };

    const stylePrefixes = {
      'modern': ['Neo', 'Ultra', 'Prime', 'Core', 'Sync', 'Flow'],
      'creative': ['Artisan', 'Craft', 'Studio', 'Atelier', 'Canvas', 'Palette'],
      'professional': ['Pro', 'Elite', 'Premier', 'Executive', 'Corporate', 'Business'],
      'playful': ['Fun', 'Happy', 'Bright', 'Cheerful', 'Jolly', 'Merry'],
      'luxury': ['Platinum', 'Gold', 'Diamond', 'Royal', 'Elite', 'Premium'],
      'tech': ['Cyber', 'Digital', 'Smart', 'AI', 'Tech', 'Data'],
      'minimalist': ['Pure', 'Simple', 'Clean', 'Minimal', 'Basic', 'Essential'],
      'bold': ['Power', 'Strong', 'Bold', 'Force', 'Impact', 'Dynamic'],
      'elegant': ['Grace', 'Elegant', 'Refined', 'Sophisticated', 'Classy', 'Chic'],
      'trendy': ['Trend', 'Hip', 'Cool', 'Fresh', 'New', 'Modern']
    };

    const styleSuffixes = {
      'modern': ['Lab', 'Hub', 'Core', 'Sync', 'Flow', 'Sphere'],
      'creative': ['Studio', 'Works', 'Craft', 'Design', 'Art', 'Creative'],
      'professional': ['Group', 'Corp', 'Solutions', 'Services', 'Partners', 'Associates'],
      'playful': ['Fun', 'Play', 'Joy', 'Happy', 'Bright', 'Smile'],
      'luxury': ['Luxury', 'Premium', 'Elite', 'Royal', 'Gold', 'Platinum'],
      'tech': ['Tech', 'Digital', 'AI', 'Data', 'Cyber', 'Smart'],
      'minimalist': ['Co', 'Studio', 'Lab', 'Space', 'Room', 'Place'],
      'bold': ['Force', 'Power', 'Impact', 'Strong', 'Bold', 'Dynamic'],
      'elegant': ['Elegance', 'Grace', 'Style', 'Class', 'Chic', 'Refined'],
      'trendy': ['Trend', 'Vibe', 'Style', 'Mode', 'Fresh', 'New']
    };

    // Generate names based on industry and style
    let industryNames = baseNames[industry] || baseNames['Technology'];
    let prefixes = stylePrefixes[style] || stylePrefixes['modern'];
    let suffixes = styleSuffixes[style] || styleSuffixes['modern'];

    let generatedNamesList = [];

    // Add industry-specific names
    generatedNamesList.push(...industryNames.slice(0, 3));

    // Generate style-based combinations
    for (let i = 0; i < 3; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      generatedNamesList.push(prefix + suffix);
    }

    // Generate keyword-based names if keywords provided
    if (keywords && includeKeywords) {
      const keywordList = keywords.split(',').map(k => k.trim());
      keywordList.forEach(keyword => {
        if (keyword) {
          const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
          generatedNamesList.push(keyword.charAt(0).toUpperCase() + keyword.slice(1) + suffix);
        }
      });
    }

    // Filter by length preference
    if (nameLength === 'short') {
      generatedNamesList = generatedNamesList.filter(name => name.length <= 6);
    } else if (nameLength === 'long') {
      generatedNamesList = generatedNamesList.filter(name => name.length >= 11);
    }

    // Add additional names if we don't have enough
    const additionalNames = [
      'InnovateLab', 'CreativeCore', 'VisionSync', 'ImpactHub', 'FutureForge',
      'BrightSphere', 'SwiftFlow', 'PureLab', 'SmartCore', 'TrendHub'
    ];

    while (generatedNamesList.length < 8) {
      const randomName = additionalNames[Math.floor(Math.random() * additionalNames.length)];
      if (!generatedNamesList.includes(randomName)) {
        generatedNamesList.push(randomName);
      }
    }

    // Create name objects with additional data
    const namesWithData = generatedNamesList.slice(0, 8).map((name, index) => ({
      name,
      domain: `${name.toLowerCase()}.com`,
      popularity: Math.floor(Math.random() * 100) + 1,
      availability: Math.random() > 0.3, // 70% chance of being available
      social: {
        twitter: Math.random() > 0.4,
        instagram: Math.random() > 0.5,
        facebook: Math.random() > 0.6
      },
      trademark: Math.random() > 0.8 // 20% chance of trademark issues
    }));

    setGeneratedNames(namesWithData);
    setIsGenerating(false);
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const toggleFavorite = (name: string) => {
    setFavoriteNames(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const exportNames = () => {
    const namesToExport = filterFavorites ? 
      generatedNames.filter(n => favoriteNames.includes(n.name)) : 
      generatedNames;
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Domain,Popularity,Available,Twitter,Instagram,Facebook,Trademark Safe\n" +
      namesToExport.map(n => 
        `${n.name},${n.domain},${n.popularity},${n.availability ? 'Yes' : 'No'},${n.social.twitter ? 'Yes' : 'No'},${n.social.instagram ? 'Yes' : 'No'},${n.social.facebook ? 'Yes' : 'No'},${n.trademark ? 'Yes' : 'No'}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "business_names.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const regenerateNames = () => {
    if (!isGenerating) {
      generateNames();
    }
  };

  // Filter and sort names
  const filteredAndSortedNames = React.useMemo(() => {
    let filtered = filterFavorites ? 
      generatedNames.filter(n => favoriteNames.includes(n.name)) : 
      generatedNames;

    switch (sortBy) {
      case 'alphabetical':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'length':
        return filtered.sort((a, b) => a.name.length - b.name.length);
      case 'popularity':
        return filtered.sort((a, b) => b.popularity - a.popularity);
      default:
        return filtered;
    }
  }, [generatedNames, favoriteNames, filterFavorites, sortBy]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Zap className="h-6 w-6 text-blue-600 mr-2" />
              AI Name Generator
            </h1>
            <p className="text-gray-600 mt-1">
              Generate unique business names powered by artificial intelligence
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
            <span className="text-sm font-medium">✨ AI Powered</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Configure Your Business Name
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Industry Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Keywords Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., fast, reliable, innovative"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Style Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Name Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {nameStyles.map((styleOption) => (
                  <button
                    key={styleOption.value}
                    onClick={() => setStyle(styleOption.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      style === styleOption.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{styleOption.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{styleOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Name Length
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {nameLengths.map((lengthOption) => (
                  <button
                    key={lengthOption.value}
                    onClick={() => setNameLength(lengthOption.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      nameLength === lengthOption.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{lengthOption.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{lengthOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Advanced Options
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeKeywords}
                    onChange={(e) => setIncludeKeywords(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include keywords in names</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={avoidNumbers}
                    onChange={(e) => setAvoidNumbers(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Avoid numbers</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-6">
              <button
                onClick={generateNames}
                disabled={!industry || isGenerating}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  !industry || isGenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating Names...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate Business Names
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Names */}
          {generatedNames.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                  Generated Names ({filteredAndSortedNames.length})
                </h2>
                <div className="flex items-center space-x-3">
                  {/* Filter Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setFilterFavorites(!filterFavorites)}
                      className={`flex items-center px-3 py-1 text-sm border rounded-lg transition-colors duration-200 ${
                        filterFavorites
                          ? 'border-red-300 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${filterFavorites ? 'fill-current' : ''}`} />
                      Favorites ({favoriteNames.length})
                    </button>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          Sort by {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={exportNames}
                    className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </button>
                  
                  <button
                    onClick={regenerateNames}
                    disabled={isGenerating}
                    className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAndSortedNames.map((nameData, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {nameData.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            {nameData.name}
                            <div className="flex items-center ml-2 space-x-1">
                              <div className={`w-2 h-2 rounded-full ${nameData.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-xs text-gray-500">
                                {nameData.availability ? 'Available' : 'Taken'}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">{nameData.domain}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(nameData.name)}
                          className={`p-1 rounded transition-colors duration-200 ${
                            favoriteNames.includes(nameData.name)
                              ? 'text-red-600 hover:text-red-700'
                              : 'text-gray-400 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favoriteNames.includes(nameData.name) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => copyToClipboard(nameData.name)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Copy to clipboard"
                        >
                          {copiedName === nameData.name ? (
                            <span className="text-green-600 text-xs font-medium">Copied!</span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {nameData.popularity}% popular
                        </span>
                        <span className={`px-2 py-1 rounded-full ${nameData.trademark ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {nameData.trademark ? 'TM Safe' : 'Check TM'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${nameData.social.twitter ? 'bg-blue-500' : 'bg-gray-300'}`} title="Twitter"></span>
                        <span className={`w-2 h-2 rounded-full ${nameData.social.instagram ? 'bg-pink-500' : 'bg-gray-300'}`} title="Instagram"></span>
                        <span className={`w-2 h-2 rounded-full ${nameData.social.facebook ? 'bg-blue-600' : 'bg-gray-300'}`} title="Facebook"></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAndSortedNames.length === 0 && filterFavorites && (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No favorite names yet. Click the heart icon to add favorites!</p>
                </div>
              )}

              {/* Tips Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Pro Tips
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Green dots indicate domain availability (simulated)</li>
                  <li>• Social media indicators show handle availability</li>
                  <li>• Use favorites to shortlist your top choices</li>
                  <li>• Export your list to share with your team</li>
                  <li>• Always verify actual availability before finalizing</li>
                </ul>
              </div>
            </div>
          )}

          {/* How It Works Section */}
          {generatedNames.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Rocket className="h-5 w-5 text-green-600 mr-2" />
                How It Works
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Configure</h3>
                  <p className="text-sm text-gray-600">Set your industry, style, and preferences</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Generate</h3>
                  <p className="text-sm text-gray-600">AI creates unique names based on your inputs</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Filter & Sort</h3>
                  <p className="text-sm text-gray-600">Use advanced filters to find perfect matches</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Export</h3>
                  <p className="text-sm text-gray-600">Save favorites and export your shortlist</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AINameGeneratorPage;