import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Settings, Home, Zap, Star, Folder, Palette, HandMetal, Plus, Upload, LogIn, ChevronRight, Twitter, Instagram, Linkedin, Mail, Sparkles, Menu, BookOpen } from 'lucide-react';
import AllImagesPage from './AllImagesPage';
import AINameGeneratorPage from './AINameGeneratorPage';
import ColorPalettePage from './ColorPalettePage';
import AILogoGeneratorPage from './pages/AILogoGeneratorPage';
import AddLogoPage from './pages/AddLogoPage';
import ColorPaletteAdminPage from './pages/ColorPaletteAdminPage';
import FontsPage from './pages/FontsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FontsAdminPage from './pages/FontsAdminPage';
import LearnPage from './pages/LearnPage';
import BooksAdminPage from './pages/BooksAdminPage';
import AdminRoute from './components/AdminRoute';
import { useLogos } from './hooks/useLogos-safe';
import AdminSignInPage from './pages/AdminSignInPage';
import BulkUploadPage from './pages/BulkUploadPage';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useAIVisibility } from './hooks/useAIVisibility';
import { distributeLogos, getAvailableLogoTypes, getAvailableIndustries } from './utils/logoDistribution';
import LogoModal from './components/LogoModal';

const App = () => {
  const location = useLocation();
  const { isAuthenticated } = useAdminAuth();
  const { isAIVisible } = useAIVisibility();
  const [activeTab, setActiveTab] = useState('Social media');
  const [activeLogoType, setActiveLogoType] = useState('Wordmarks');
  const [activeIndustry, setActiveIndustry] = useState('Automotive');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Base sidebar items available to all users
  const baseSidebarItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'All Logos', icon: HandMetal, path: '/brands-logos' },
    { name: 'Learn', icon: BookOpen, path: '/learn' },
    { name: 'Color Palette', icon: Star, path: '/color-palette' },
    { name: 'Fonts', icon: Folder, path: '/fonts' },
  ];

  // AI Tools section items
  const aiToolsItems = [
    { name: 'AI Logo Generator', icon: Zap, path: '/ai-logo-generator' },
    { name: 'AI Name Generator', icon: Sparkles, path: '/ai-name-generator' },
  ];

  // Admin-only sidebar items
  const adminSidebarItems = [
    { name: 'Admin Dashboard', icon: Settings, path: '/admin' },
    { name: 'Add Logo', icon: Plus, path: '/admin/add-logo' },
    { name: 'Bulk Upload', icon: Upload, path: '/admin/bulk-upload' },
    { name: 'Manage Books', icon: BookOpen, path: '/admin/books' },
    { name: 'Manage Palettes', icon: Palette, path: '/admin/color-palettes' },
    { name: 'Manage Fonts', icon: Folder, path: '/admin/fonts' },
  ];

  // Admin sections are rendered separately in the sidebar

  // Admin sections are rendered in the sidebar based on authentication status

  const quickActionTabs = [
    'For you', 'Images', 'Vectors', 'Videos', 'Designs', 'Mockups', 'Icons', 'Others'
  ];

  const bottomActions = [
    'Find a vector',
    'Create an AI video', 
    'Use a custom AI character',
    'Edit an image with AI',
    'Upscale an image'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
      )}
      {/* Left Sidebar */}
      <div className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen z-50 transform transition-transform duration-200 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-blue-600">
            TRUSTEDLOGOS
          </h1>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-4">
            <div className="space-y-2">
              {baseSidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* AI Tools section - conditionally rendered */}
            {isAIVisible && (
              <div className="pt-4">
                <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">AI Tools</div>
                <div className="space-y-2">
                  {aiToolsItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Admin section - only visible to authenticated admins */}
            {isAuthenticated && (
              <div className="pt-4">
                <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Admin</div>
                <div className="space-y-2">
                  {adminSidebarItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        location.pathname === item.path
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </nav>

        </div>

        {/* Bottom Upgrade Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
            <h4 className="font-semibold mb-1">Upgrade</h4>
            <p className="text-sm opacity-90">More credits & AI tools</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 ml-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <button
                className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search assets or start creating"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>


          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeLogoType={activeLogoType}
              setActiveLogoType={setActiveLogoType}
              activeIndustry={activeIndustry}
              setActiveIndustry={setActiveIndustry}
            />} />
            <Route path="/ai-logo-generator" element={<AILogoGeneratorPage />} />
            <Route path="/console-setup" element={<AdminSignInPage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/add-logo" element={<AdminRoute><AddLogoPage /></AdminRoute>} />
            <Route path="/admin/bulk-upload" element={<AdminRoute><BulkUploadPage /></AdminRoute>} />
            <Route path="/admin/books" element={<AdminRoute><BooksAdminPage /></AdminRoute>} />
            <Route path="/admin/color-palettes" element={<AdminRoute><ColorPaletteAdminPage /></AdminRoute>} />
            <Route path="/admin/fonts" element={<AdminRoute><FontsAdminPage /></AdminRoute>} />
            <Route path="/brands-logos" element={<AllImagesPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/ai-name-generator" element={<AINameGeneratorPage />} />
            <Route path="/color-palette" element={<ColorPalettePage />} />
            <Route path="/fonts" element={<FontsPage />} />
          </Routes>
        </div>
      </div>

      


    </div>
  );
};

// Home Page Component
const HomePage = ({ 
  activeTab, 
  setActiveTab, 
  activeLogoType, 
  setActiveLogoType, 
  activeIndustry, 
  setActiveIndustry 
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeLogoType: string;
  setActiveLogoType: (type: string) => void;
  activeIndustry: string;
  setActiveIndustry: (industry: string) => void;
}) => {
  const { logos, loading, error, incrementDownloads, incrementLikes } = useLogos();

  // Modal state for homepage
  const [selectedLogo, setSelectedLogo] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Modal handlers
  const openModal = (logo: any) => {
    setSelectedLogo(logo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLogo(null);
    setIsModalOpen(false);
  };

  const handleDownload = async (logoId: string) => {
    try {
      await incrementDownloads(logoId);
      console.log('Download count incremented for logo:', logoId);
    } catch (error) {
      console.error('Failed to increment download count:', error);
    }
  };

  const handleLike = async (logoId: string) => {
    try {
      await incrementLikes(logoId);
      console.log('Like count incremented for logo:', logoId);
    } catch (error) {
      console.error('Failed to increment like count:', error);
    }
  };
  

  
  // Distribute logos across sections
  const distributedData = React.useMemo(() => {
    try {
      if (logos.length === 0) {
        return distributeLogos([]);
      }
      return distributeLogos(logos);
    } catch (err) {
      console.warn('Error distributing logos:', err);
      // Return empty structure if distribution fails
      return {
        topLogos: [],
        logoTypes: {},
        industries: {}
      };
    }
  }, [logos]);

  // Get available types and industries (only show tabs that have logos)
  const availableLogoTypes = React.useMemo(() => {
    try {
      const available = getAvailableLogoTypes(logos);
      // Always include at least some basic types for navigation
      const basicTypes = ['Wordmarks', 'Lettermarks', 'Pictorial Marks', 'Abstract Marks', 'Combination Marks', 'Emblem Logos', 'Mascot Logos'];
      return available.length > 0 ? available : basicTypes;
    } catch (err) {
      console.warn('Error getting logo types:', err);
      return ['Wordmarks', 'Lettermarks', 'Pictorial Marks', 'Abstract Marks', 'Combination Marks', 'Emblem Logos', 'Mascot Logos'];
    }
  }, [logos]);

  const availableIndustries = React.useMemo(() => {
    try {
      const available = getAvailableIndustries(logos);
      // Always include basic industries for navigation
      const basicIndustries = ['Automotive', 'Fashion', 'Food & Drinks', 'Restaurant', 'Technology', 'E-commerce', 'Electronics', 'Industrial', 'Internet', 'Media/TV', 'Sport', 'Other'];
      return available.length > 0 ? available : basicIndustries;
    } catch (err) {
      console.warn('Error getting industries:', err);
      return ['Automotive', 'Fashion', 'Food & Drinks', 'Restaurant', 'Technology', 'E-commerce', 'Electronics', 'Industrial', 'Internet', 'Media/TV', 'Sport', 'Other'];
    }
  }, [logos]);

  // Use TOP logos from distributed data (preserve full logo objects for modal)
  const topLogosForDisplay = React.useMemo(() => {
    try {
      if (!distributedData.topLogos || distributedData.topLogos.length === 0) {
        return [];
      }
      return distributedData.topLogos;
    } catch (err) {
      console.warn('Error processing top logos:', err);
      return [];
    }
  }, [distributedData.topLogos]);

  // Map homepage tabs to Subcategory only
  const topTabSubcategories: Record<string, string> = React.useMemo(() => ({
    'Social media': 'Social Networks',
    'Fashion Logos': 'Clothing & Apparel',
    'Supermarkets & Grocery': 'Supermarkets & Grocery',
    'Restaurant Logos': 'Restaurants',
    'Apps & SaaS': 'Apps & SaaS',
    'Car Brands': 'Car Brands',
  }), []);

  // Filter all logos by active tab using Subcategory only
  const filteredTopLogos = React.useMemo(() => {
    try {
      const sub = topTabSubcategories[activeTab];
      if (!sub) return [];
      const candidates = logos.filter(l => (l.subcategory || '').toLowerCase() === sub.toLowerCase());
      return [...candidates].sort((a, b) => (b.downloads + b.likes) - (a.downloads + a.likes));
    } catch (err) {
      console.warn('Error filtering logos for tab', activeTab, err);
      return topLogosForDisplay;
    }
  }, [logos, activeTab, topTabSubcategories, topLogosForDisplay]);

  // Display top 14 filtered logos
  const displayLogos = filteredTopLogos.slice(0, 14);

  const quickActions = [
    {
      title: 'Logo Generator',
      subtitle: 'April 29, 2025',
      description: 'Create professional logos instantly',
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      icon: 'LG'
    },
    {
      title: 'Brand Identity Kit',
      subtitle: 'Resize any logo filling the gaps with AI',
      description: 'Complete branding solutions',
      gradient: 'from-green-500 via-teal-500 to-green-700',
      icon: 'BI'
    },
    {
      title: 'Logo Evolution',
      subtitle: 'Track brand changes easily',
      description: 'See how brands evolved over time',
      gradient: 'from-orange-400 via-red-400 to-pink-500',
      icon: 'LE'
    },
    {
      title: 'Create an AI Logo',
      subtitle: 'From words to logos',
      description: 'AI-powered logo creation',
      gradient: 'from-orange-500 via-red-500 to-yellow-500',
      icon: 'AI'
    },
  ];

  const logoTypes = {
    'Wordmarks': {
      description: 'Wordmarks are text-only logos that focus on the company name using distinctive typography. They\'re perfect for companies with memorable names and help build strong brand recognition through consistent typographic treatment.',
      examples: 'Google, Coca-Cola, FedEx, Visa',
      bestFor: 'Memorable company names',
      logos: [
        { name: 'Google', color: '#4285f4', letter: 'G' },
        { name: 'Coca-Cola', color: '#f40009', letter: 'C' },
        { name: 'FedEx', color: '#4d148c', letter: 'F' },
        { name: 'Visa', color: '#1a1f71', letter: 'V' }
      ]
    },
    'Lettermarks': {
      description: 'Lettermarks use initials or abbreviations of the company name. These monogram-style logos are ideal for companies with long names or when you want to create a strong, memorable symbol from letters.',
      examples: 'IBM, HBO, CNN, NASA',
      bestFor: 'Long company names or abbreviations',
      logos: [
        { name: 'IBM', color: '#1f70c1', letter: 'I' },
        { name: 'HBO', color: '#000000', letter: 'H' },
        { name: 'CNN', color: '#cc0000', letter: 'C' },
        { name: 'NASA', color: '#fc3d21', letter: 'N' }
      ]
    },
    'Pictorial Marks': {
      description: 'Pictorial marks are icon-based logos that use recognizable imagery. These literal representations help communicate what your company does through visual symbols that are easily understood.',
      examples: 'Apple, Twitter, Target, Shell',
      bestFor: 'Established brands with recognizable symbols',
      logos: [
        { name: 'Apple', color: '#000000', letter: 'A' },
        { name: 'Twitter', color: '#1da1f2', letter: 'T' },
        { name: 'Target', color: '#cc0000', letter: 'T' },
        { name: 'Shell', color: '#ffde00', letter: 'S' }
      ]
    },
    'Abstract Marks': {
      description: 'Abstract marks are geometric forms that don\'t represent anything recognizable but convey meaning through color, form, and movement. They allow for unique brand identity without literal representation.',
      examples: 'Nike, Pepsi, Adidas, BP',
      bestFor: 'Creating unique, memorable brand symbols',
      logos: [
        { name: 'Nike', color: '#000000', letter: 'N' },
        { name: 'Pepsi', color: '#004b93', letter: 'P' },
        { name: 'Adidas', color: '#000000', letter: 'A' },
        { name: 'BP', color: '#00914c', letter: 'B' }
      ]
    },
    'Combination Marks': {
      description: 'Combination marks blend text and imagery together, creating a unified logo that can work as a complete unit or be separated when needed. This versatility makes them popular for many businesses.',
      examples: 'Burger King, Lacoste, Doritos, Taco Bell',
      bestFor: 'Versatile branding needs',
      logos: [
        { name: 'Burger King', color: '#d62300', letter: 'B' },
        { name: 'Lacoste', color: '#00a651', letter: 'L' },
        { name: 'Doritos', color: '#e50000', letter: 'D' },
        { name: 'Taco Bell', color: '#702f8a', letter: 'T' }
      ]
    },
    'Emblem Logos': {
      description: 'Emblem logos consist of text inside a symbol or icon, similar to badges, seals, or crests. They convey tradition, authority, and official status, making them popular for schools, organizations, and government agencies.',
      examples: 'Starbucks, BMW, Harley-Davidson, NFL',
      bestFor: 'Traditional, authoritative brands',
      logos: [
        { name: 'Starbucks', color: '#00704a', letter: 'S' },
        { name: 'BMW', color: '#0066b2', letter: 'B' },
        { name: 'Harley-Davidson', color: '#f47216', letter: 'H' },
        { name: 'NFL', color: '#013369', letter: 'N' }
      ]
    },
    'Mascot Logos': {
      description: 'Mascot logos feature illustrated characters that represent your company. These friendly, approachable designs are great for connecting with families and children, adding personality to your brand.',
      examples: 'KFC, Mailchimp, Pringles, Michelin',
      bestFor: 'Family-friendly brands and sports teams',
      logos: [
        { name: 'KFC', color: '#f40027', letter: 'K' },
        { name: 'Mailchimp', color: '#ffe01b', letter: 'M' },
        { name: 'Pringles', color: '#e30613', letter: 'P' },
        { name: 'Michelin', color: '#0033a0', letter: 'M' }
      ]
    }
  };

  const industryLogos = {
    'Automotive': {
      description: 'Automotive logos emphasize speed, reliability, and innovation. They often feature bold typography, dynamic shapes, and colors that convey power and trust.',
      logos: [
        { name: 'Tesla', color: '#cc0000', letter: 'T', category: 'Electric Vehicles' },
        { name: 'BMW', color: '#0066b2', letter: 'B', category: 'Luxury Cars' },
        { name: 'Ford', color: '#003478', letter: 'F', category: 'Classic American' },
        { name: 'Mercedes', color: '#000000', letter: 'M', category: 'Premium Luxury' },
        { name: 'Toyota', color: '#eb0a1e', letter: 'T', category: 'Reliable Transport' },
        { name: 'Audi', color: '#bb0a30', letter: 'A', category: 'German Engineering' },
        { name: 'Honda', color: '#e60012', letter: 'H', category: 'Innovation' },
        { name: 'Volkswagen', color: '#001e50', letter: 'V', category: "People's Car" }
      ]
    },
    'Fashion': {
      description: 'Fashion logos focus on elegance, style, and brand prestige. They typically use sophisticated typography and minimalist designs to convey luxury and exclusivity.',
      logos: [
        { name: 'Nike', color: '#000000', letter: 'N', category: 'Sportswear' },
        { name: 'Adidas', color: '#000000', letter: 'A', category: 'Athletic Wear' },
        { name: 'Gucci', color: '#006341', letter: 'G', category: 'Luxury Fashion' },
        { name: 'Chanel', color: '#000000', letter: 'C', category: 'High Fashion' },
        { name: 'Louis Vuitton', color: '#8b4513', letter: 'L', category: 'Luxury Goods' },
        { name: 'Prada', color: '#000000', letter: 'P', category: 'Italian Luxury' },
        { name: 'Zara', color: '#000000', letter: 'Z', category: 'Fast Fashion' },
        { name: 'H&M', color: '#e50000', letter: 'H', category: 'Affordable Fashion' }
      ]
    },
    'Food & Drinks': {
      description: 'Food and beverage logos use appetizing colors, friendly typography, and imagery that evokes taste, freshness, and satisfaction.',
      logos: [
        { name: 'Coca-Cola', color: '#f40009', letter: 'C', category: 'Soft Drinks' },
        { name: 'Pepsi', color: '#004b93', letter: 'P', category: 'Cola Beverages' },
        { name: 'Nestlé', color: '#87ceeb', letter: 'N', category: 'Food Products' },
        { name: 'Starbucks', color: '#00704a', letter: 'S', category: 'Coffee Chain' },
        { name: 'Red Bull', color: '#004387', letter: 'R', category: 'Energy Drinks' },
        { name: 'Heinz', color: '#e40521', letter: 'H', category: 'Condiments' },
        { name: 'Oreo', color: '#003087', letter: 'O', category: 'Cookies' },
        { name: 'KitKat', color: '#d70022', letter: 'K', category: 'Chocolate' }
      ]
    },
    'Restaurant': {
      description: 'Restaurant logos combine appetite appeal with brand personality, using warm colors and inviting designs that make customers hungry and welcome.',
      logos: [
        { name: "McDonald's", color: '#ffc72c', letter: 'M', category: 'Fast Food' },
        { name: 'KFC', color: '#f40027', letter: 'K', category: 'Fried Chicken' },
        { name: 'Burger King', color: '#d62300', letter: 'B', category: 'Burgers' },
        { name: 'Subway', color: '#00543d', letter: 'S', category: 'Sandwiches' },
        { name: 'Pizza Hut', color: '#ee3124', letter: 'P', category: 'Pizza Chain' },
        { name: "Domino's", color: '#0078ae', letter: 'D', category: 'Pizza Delivery' },
        { name: 'Taco Bell', color: '#702f8a', letter: 'T', category: 'Mexican Fast Food' },
        { name: "Dunkin'", color: '#ff671f', letter: 'D', category: 'Coffee & Donuts' }
      ]
    },
    'Technology': {
      description: 'Technology logos emphasize innovation, reliability, and forward-thinking. They often use clean, modern designs with blues and grays to convey trust and expertise.',
      logos: [
        { name: 'Apple', color: '#000000', letter: 'A', category: 'Consumer Electronics' },
        { name: 'Google', color: '#4285f4', letter: 'G', category: 'Search & Cloud' },
        { name: 'Microsoft', color: '#00bcf2', letter: 'M', category: 'Software' },
        { name: 'Amazon', color: '#ff9900', letter: 'A', category: 'E-commerce & Cloud' },
        { name: 'Meta', color: '#1877f2', letter: 'M', category: 'Social Media' },
        { name: 'Netflix', color: '#e50914', letter: 'N', category: 'Streaming' },
        { name: 'Samsung', color: '#1428a0', letter: 'S', category: 'Electronics' },
        { name: 'Intel', color: '#0071c5', letter: 'I', category: 'Semiconductors' }
      ]
    },
    'E-commerce': {
      description: 'E-commerce logos focus on trust, convenience, and accessibility. They use friendly colors and clear typography to encourage online shopping and build customer confidence.',
      logos: [
        { name: 'Amazon', color: '#ff9900', letter: 'A', category: 'Marketplace' },
        { name: 'eBay', color: '#e53238', letter: 'E', category: 'Auctions' },
        { name: 'Alibaba', color: '#ff6a00', letter: 'A', category: 'B2B Platform' },
        { name: 'Shopify', color: '#7ab55c', letter: 'S', category: 'E-commerce Platform' },
        { name: 'Etsy', color: '#f16521', letter: 'E', category: 'Handmade Goods' },
        { name: 'PayPal', color: '#003087', letter: 'P', category: 'Online Payments' },
        { name: 'Stripe', color: '#635bff', letter: 'S', category: 'Payment Processing' },
        { name: 'Square', color: '#000000', letter: 'S', category: 'Point of Sale' }
      ]
    },
    'Electronics': {
      description: 'Electronics logos convey innovation, precision, and cutting-edge technology. They often feature sleek designs with metallic colors and modern typography.',
      logos: [
        { name: 'Sony', color: '#000000', letter: 'S', category: 'Consumer Electronics' },
        { name: 'LG', color: '#a50034', letter: 'L', category: 'Home Appliances' },
        { name: 'Panasonic', color: '#0033a0', letter: 'P', category: 'Electronics' },
        { name: 'Canon', color: '#cc0000', letter: 'C', category: 'Cameras' },
        { name: 'Nikon', color: '#ffcc00', letter: 'N', category: 'Photography' },
        { name: 'Bose', color: '#000000', letter: 'B', category: 'Audio Equipment' },
        { name: 'JBL', color: '#ff6600', letter: 'J', category: 'Speakers' },
        { name: 'Philips', color: '#0066cc', letter: 'P', category: 'Healthcare Tech' }
      ]
    },
    'Industrial': {
      description: 'Industrial logos emphasize strength, reliability, and engineering excellence. They use bold colors and sturdy typography to convey durability and professional expertise.',
      logos: [
        { name: 'Caterpillar', color: '#ffcd11', letter: 'C', category: 'Heavy Machinery' },
        { name: 'John Deere', color: '#367c2b', letter: 'J', category: 'Agricultural Equipment' },
        { name: 'Boeing', color: '#0039a6', letter: 'B', category: 'Aerospace' },
        { name: 'GE', color: '#005eb8', letter: 'G', category: 'Industrial Conglomerate' },
        { name: '3M', color: '#ff0000', letter: '3', category: 'Industrial Materials' },
        { name: 'Siemens', color: '#009999', letter: 'S', category: 'Industrial Technology' },
        { name: 'Honeywell', color: '#e60000', letter: 'H', category: 'Automation' },
        { name: 'ABB', color: '#ff0000', letter: 'A', category: 'Power & Automation' }
      ]
    },
    'Internet': {
      description: 'Internet company logos focus on connectivity, accessibility, and digital innovation. They use modern designs with vibrant colors to represent the dynamic nature of the web.',
      logos: [
        { name: 'Google', color: '#4285f4', letter: 'G', category: 'Search Engine' },
        { name: 'Facebook', color: '#1877f2', letter: 'F', category: 'Social Network' },
        { name: 'Twitter', color: '#1da1f2', letter: 'T', category: 'Microblogging' },
        { name: 'LinkedIn', color: '#0077b5', letter: 'L', category: 'Professional Network' },
        { name: 'YouTube', color: '#ff0000', letter: 'Y', category: 'Video Platform' },
        { name: 'Instagram', color: '#e4405f', letter: 'I', category: 'Photo Sharing' },
        { name: 'TikTok', color: '#000000', letter: 'T', category: 'Short Videos' },
        { name: 'Snapchat', color: '#fffc00', letter: 'S', category: 'Messaging' }
      ]
    },
    'Media/TV': {
      description: 'Media and TV logos capture attention and convey entertainment value. They use bold colors and dynamic designs to represent creativity and engaging content.',
      logos: [
        { name: 'Netflix', color: '#e50914', letter: 'N', category: 'Streaming Service' },
        { name: 'Disney', color: '#113ccf', letter: 'D', category: 'Entertainment' },
        { name: 'HBO', color: '#000000', letter: 'H', category: 'Premium TV' },
        { name: 'CNN', color: '#cc0000', letter: 'C', category: 'News Network' },
        { name: 'BBC', color: '#000000', letter: 'B', category: 'Broadcasting' },
        { name: 'ESPN', color: '#ff0000', letter: 'E', category: 'Sports Network' },
        { name: 'MTV', color: '#fff000', letter: 'M', category: 'Music Television' },
        { name: 'Spotify', color: '#1db954', letter: 'S', category: 'Music Streaming' }
      ]
    },
    'Sport': {
      description: 'Sports logos embody energy, competition, and team spirit. They use dynamic shapes and bold colors to convey movement, strength, and athletic excellence.',
      logos: [
        { name: 'Nike', color: '#000000', letter: 'N', category: 'Athletic Wear' },
        { name: 'Adidas', color: '#000000', letter: 'A', category: 'Sports Brand' },
        { name: 'Under Armour', color: '#000000', letter: 'U', category: 'Performance Gear' },
        { name: 'Puma', color: '#000000', letter: 'P', category: 'Sports Equipment' },
        { name: 'Reebok', color: '#000000', letter: 'R', category: 'Fitness Brand' },
        { name: 'New Balance', color: '#ed1c24', letter: 'N', category: 'Running Shoes' },
        { name: 'Converse', color: '#000000', letter: 'C', category: 'Casual Footwear' },
        { name: 'Vans', color: '#000000', letter: 'V', category: 'Skateboard Culture' }
      ]
    },
    'Other': {
      description: 'Miscellaneous logos from various industries that don\'t fit into specific categories. These showcase diverse design approaches and creative solutions.',
      logos: [
        { name: 'IKEA', color: '#0051ba', letter: 'I', category: 'Furniture Retail' },
        { name: 'FedEx', color: '#4d148c', letter: 'F', category: 'Logistics' },
        { name: 'UPS', color: '#8a6914', letter: 'U', category: 'Shipping' },
        { name: 'Walmart', color: '#004c91', letter: 'W', category: 'Retail Chain' },
        { name: 'Target', color: '#cc0000', letter: 'T', category: 'Department Store' },
        { name: 'Home Depot', color: '#f96302', letter: 'H', category: 'Home Improvement' },
        { name: 'Lowe\'s', color: '#004990', letter: 'L', category: 'Hardware Store' },
        { name: 'Costco', color: '#e31837', letter: 'C', category: 'Wholesale Club' }
      ]
    }
  };

  return (
    <>
      {/* Recent Creations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">TOP Logos</h2>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            Explore the World's Most Iconic Logos
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {['Social media', 'Fashion Logos', 'Supermarkets & Grocery', 'Restaurant Logos', 'Apps & SaaS', 'Car Brands'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TOP Logos Grid */}
        <div className="grid grid-cols-7 gap-4 mb-8">
          {displayLogos.length > 0 ? displayLogos.map((logo) => (
            <div
              key={logo.id}
              onClick={() => openModal(logo)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {logo.imageUrl ? (
                  <img 
                    src={logo.imageUrl} 
                    alt={logo.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to letter if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-200 ${logo.imageUrl ? 'hidden' : ''}`}
                  style={{ backgroundColor: logo.primaryColor }}
                >
                  {logo.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                  {logo.name}
                </h3>
                <p className="text-xs text-gray-500">{new Date(logo.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-5 text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No logos uploaded yet</div>
              <p className="text-sm">Upload some logos through the admin panel to see them here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick actions</h2>
        
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${action.gradient} rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-sm">{action.icon}</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{action.title}</h3>
              <p className="text-sm opacity-90 mb-1">{action.subtitle}</p>
            </div>
          ))}
        </div>

        {/* AI Logo Generator CTA */}
        <div className="mb-8">
          <Link
            to="/brands-logos"
            className="block bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-8 text-white hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl">Logo Inspiration Gallery</h3>
                    <p className="text-lg opacity-90">Discover popular logos for inspiration and learning</p>
                  </div>
                </div>
                <p className="text-sm opacity-80 max-w-2xl">
                  Explore our curated collection of popular logos from renowned brands and companies. All logos are showcased 
                  for educational and inspirational purposes only. We respect and acknowledge the original designers and trademark owners.
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">🎨 For Inspiration</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">📚 Educational Use</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">© Rights Reserved</span>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-12 w-12" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Logo Types Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Logo Design Types</h2>
        
        {/* Logo Types Tab Menu */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
          {availableLogoTypes.map((logoType, index) => (
            <button
              key={logoType}
              onClick={() => setActiveLogoType(logoType)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeLogoType === logoType
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {logoType}
            </button>
          ))}
        </div>

        {/* Logo Type Description */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{activeLogoType}</h3>
          <p className="text-gray-600 mb-4">{distributedData.logoTypes[activeLogoType]?.description || 'Logo type description'}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
              Examples: {distributedData.logoTypes[activeLogoType]?.examples || 'Various examples'}
            </span>
            <span>Best for: {distributedData.logoTypes[activeLogoType]?.bestFor || 'Multiple use cases'}</span>
          </div>
        </div>

        {/* Logo Examples Grid */}
        <div className="grid grid-cols-7 gap-4">
          {distributedData.logoTypes[activeLogoType]?.logos?.length > 0 ? distributedData.logoTypes[activeLogoType].logos.map((logo, index) => (
            <div
              key={index}
              onClick={() => openModal(logo)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group border border-gray-200"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {logo.imageUrl ? (
                  <img 
                    src={logo.imageUrl} 
                    alt={logo.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200 ${logo.imageUrl ? 'hidden' : ''}`}
                  style={{ backgroundColor: logo.primaryColor }}
                >
                  {logo.name.charAt(0)}
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {logo.name}
                </h4>
                <p className="text-xs text-gray-500">{logo.type}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No {activeLogoType} logos yet</div>
              <p className="text-sm">Upload some {activeLogoType} logos to see them here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Industry Logos Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry Logo Showcase</h2>
        
        {/* Industry Tab Menu */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
          {availableIndustries.map((industry) => (
            <button
              key={industry}
              onClick={() => setActiveIndustry(industry)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeIndustry === industry
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>

        {/* Industry Description */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{activeIndustry} Logos</h3>
          <p className="text-gray-600 mb-4">{distributedData.industries[activeIndustry]?.description || 'Industry description'}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {distributedData.industries[activeIndustry]?.logos?.length || 0} Featured Brands
            </span>
          </div>
        </div>

        {/* Industry Logos Grid */}
        <div className="grid grid-cols-7 gap-4">
          {distributedData.industries[activeIndustry]?.logos?.length > 0 ? distributedData.industries[activeIndustry].logos.map((logo, index) => (
            <div
              key={index}
              onClick={() => openModal(logo)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group border border-gray-200"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {logo.imageUrl ? (
                  <img 
                    src={logo.imageUrl} 
                    alt={logo.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200 ${logo.imageUrl ? 'hidden' : ''}`}
                  style={{ backgroundColor: logo.primaryColor }}
                >
                  {logo.name.charAt(0)}
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {logo.name}
                </h4>
                <p className="text-xs text-gray-500">{logo.industry}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No {activeIndustry} logos yet</div>
              <p className="text-sm">Upload some {activeIndustry} logos to see them here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-4">TRUSTEDLOGOS</h3>
              <p className="text-gray-600 text-sm mb-4">
                Your trusted source for logo inspiration and brand identity resources. 
                Discover thousands of professional logos across all industries.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-200">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Logo Generator</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Brand Guidelines</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Color Palettes</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Typography Guide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Design Templates</a></li>
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Industries</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Technology</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Fashion</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Food & Drinks</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Automotive</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">View All Industries</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 pt-8 flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2025 TrustedLogos. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-500">Made with</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">for designers worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Logo Modal */}
      <LogoModal
        logo={selectedLogo}
        isOpen={isModalOpen}
        onClose={closeModal}
        onDownload={handleDownload}
        onLike={handleLike}
      />
    </>
  );
};

export default App;