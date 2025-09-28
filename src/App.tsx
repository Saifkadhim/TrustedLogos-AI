import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Settings, Home, Zap, Star, Folder, Palette, HandMetal, Plus, Upload, ChevronRight, Twitter, Instagram, Linkedin, Mail, Sparkles, Menu, BookOpen } from 'lucide-react';
import AllImagesPage from './AllImagesPage';
import AINameGeneratorPage from './AINameGeneratorPage';
import ColorPalettePage from './ColorPalettePage';
import AILogoGeneratorPage from './pages/AILogoGeneratorPage';
import AddLogoPage from './pages/AddLogoPage';
import ManageLogosPage from './pages/ManageLogosPage';
import ColorPaletteAdminPage from './pages/ColorPaletteAdminPage';
import FontsPage from './pages/FontsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FontsAdminPage from './pages/FontsAdminPage';
import LearnPage from './pages/LearnPage';
import BrandGuidelinesPage from './pages/BrandGuidelinesPage';
import BooksAdminPage from './pages/BooksAdminPage';
import AdminRoute from './components/AdminRoute';
import { useLogos } from './hooks/useLogos-safe';
import AdminSignInPage from './pages/AdminSignInPage';
import BulkUploadPage from './pages/BulkUploadPage';
import BrandGuidelinesAdminPage from './pages/BrandGuidelinesAdminPage';
import BrandPalettesPage from './pages/BrandPalettesPage';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useAIVisibility } from './hooks/useAIVisibility';
import { distributeLogos, getAvailableLogoTypes, getAvailableIndustries } from './utils/logoDistribution';
import LogoModal from './components/LogoModal';
import SEO from './components/SEO';
import { useColorPalettes } from './hooks/useColorPalettes';

// Helper function to safely render HTML content
// (unused)

const App = () => {
  const location = useLocation();
  const { isAuthenticated } = useAdminAuth();
  const { isAIVisible } = useAIVisibility();
  const [activeTab, setActiveTab] = useState('Restaurant Logos');
  const [activeLogoType, setActiveLogoType] = useState('Wordmarks');
  const [activeIndustry, setActiveIndustry] = useState('Food & Drinks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Base sidebar items available to all users
  const baseSidebarItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'All Logos', icon: HandMetal, path: '/brands-logos' },
    { name: 'Brand Guidelines', icon: BookOpen, path: '/brand-guidelines' },
    { name: 'Learn', icon: BookOpen, path: '/learn' },
    { name: 'Color Palette', icon: Star, path: '/color-palette' },
    { name: 'Brand Palettes', icon: Palette, path: '/brand-palettes' },
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
    { name: 'Manage Logos', icon: HandMetal, path: '/admin/manage-logos' },
    { name: 'Bulk Upload', icon: Upload, path: '/admin/bulk-upload' },
    { name: 'Manage Books', icon: BookOpen, path: '/admin/books' },
    { name: 'Manage Brand Guidelines', icon: BookOpen, path: '/admin/brand-guidelines' },
    { name: 'Manage Palettes', icon: Palette, path: '/admin/color-palettes' },
    { name: 'Manage Fonts', icon: Folder, path: '/admin/fonts' },
  ];

  // Admin sections are rendered separately in the sidebar

  // Admin sections are rendered in the sidebar based on authentication status

  // removed unused quickActionTabs

  // removed unused bottomActions

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden w-full max-w-full">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
      )}
      {/* Left Sidebar */}
      <div className={`w-full md:w-[15%] md:min-w-[240px] bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-screen z-50 transform transition-transform duration-200 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h1 className="text-lg sm:text-xl font-black text-blue-600">
            TRUSTEDLOGOS
          </h1>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 p-2 sm:p-4">
          <nav className="space-y-2 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              {baseSidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* AI Tools section - conditionally rendered */}
            {isAIVisible && (
              <div className="pt-2 sm:pt-4">
                <div className="px-2 sm:px-3 pb-1 sm:pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">AI Tools</div>
                <div className="space-y-1 sm:space-y-2">
                  {aiToolsItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                        location.pathname === item.path
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Admin section - only visible to authenticated admins */}
            {isAuthenticated && (
              <div className="pt-2 sm:pt-4">
                <div className="px-2 sm:px-3 pb-1 sm:pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Admin</div>
                <div className="space-y-1 sm:space-y-2">
                  {adminSidebarItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                        location.pathname === item.path
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </nav>

        </div>

        {/* Bottom Upgrade Section */}
        <div className="p-2 sm:p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white">
            <h4 className="font-semibold mb-1 text-sm sm:text-base">Explore All Popular Brands in The World</h4>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-[15%] w-full md:w-[calc(100%-15%)] max-w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 w-full">
          <div className="flex items-center justify-between w-full">
            {/* Left: Mobile menu + Search */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-2xl min-w-0">
              <button
                className="md:hidden p-1.5 sm:p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search assets or start creating"
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>


          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 px-4 md:px-6 py-6 overflow-y-auto overflow-x-hidden w-full main-content">
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
            <Route path="/admin/manage-logos" element={<AdminRoute><ManageLogosPage /></AdminRoute>} />
            <Route path="/admin/bulk-upload" element={<AdminRoute><BulkUploadPage /></AdminRoute>} />
            <Route path="/admin/books" element={<AdminRoute><BooksAdminPage /></AdminRoute>} />
            <Route path="/admin/brand-guidelines" element={<AdminRoute><BrandGuidelinesAdminPage /></AdminRoute>} />
            <Route path="/admin/color-palettes" element={<AdminRoute><ColorPaletteAdminPage /></AdminRoute>} />
            <Route path="/admin/fonts" element={<AdminRoute><FontsAdminPage /></AdminRoute>} />
            <Route path="/brands-logos" element={<AllImagesPage />} />
            <Route path="/brand-guidelines" element={<BrandGuidelinesPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/ai-name-generator" element={<AINameGeneratorPage />} />
                          <Route path="/color-palette" element={<ColorPalettePage />} />
              <Route path="/brand-palettes" element={<BrandPalettesPage />} />
              <Route path="/fonts" element={<FontsPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-16 bg-white border-t border-gray-200 py-8 sm:py-12 w-full">
          <div className="w-full mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
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
                  <li>
                    <Link 
                      to="/brands-logos?category=Technology & Software" 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      Technology
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/brands-logos?category=Fashion & Beauty" 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      Fashion
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/brands-logos?category=Food & Drinks" 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      Food & Drinks
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/brands-logos?category=Automotive & Transport" 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      Automotive
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/brands-logos" 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      View All Industries
                    </Link>
                  </li>
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
            <div className="border-t border-gray-200 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                © 2025 TrustedLogos. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
                <span className="text-gray-500">Made with</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">for designers worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
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
  const { logos, loading, error, incrementDownloads, incrementLikes, fetchAllLogos } = useLogos();
  // Add color palettes for homepage brand palettes
  const { palettes: colorPalettes } = useColorPalettes();
  
  // State for all logos (needed for proper type filtering)
  const [allLogos, setAllLogos] = React.useState<any[]>([]);
  const [allLogosLoading, setAllLogosLoading] = React.useState(false);
  
  // Load all logos when component mounts or when activeLogoType changes
  React.useEffect(() => {
    const loadAllLogos = async () => {
      try {
        setAllLogosLoading(true);
        const allLogosData = await fetchAllLogos();
        setAllLogos(allLogosData);
      } catch (err) {
        // Fallback to current logos if fetchAllLogos fails
        setAllLogos(logos);
      } finally {
        setAllLogosLoading(false);
      }
    };
    
    loadAllLogos();
  }, [fetchAllLogos, logos]);
  
  // Use allLogos for type filtering, fallback to current logos
  const logosForFiltering = allLogos.length > 0 ? allLogos : logos;

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

    } catch (error) {
      console.error('Failed to increment download count:', error);
    }
  };

  const handleLike = async (logoId: string) => {
    try {
      await incrementLikes(logoId);

    } catch (error) {
      console.error('Failed to increment like count:', error);
    }
  };

  // Add ref and scroll handler for the Circular Logos section
  const circularLogoRowRef = React.useRef<HTMLDivElement>(null);
  const scrollCircularLogoRow = (direction: 'left' | 'right') => {
    const container = circularLogoRowRef.current;
    if (!container) return;
    const scrollAmount = Math.max(0, Math.floor(container.clientWidth * 0.8));
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  // Add ref and scroll handler for the Brand Color Palettes row
  const brandPalettesRowRef = React.useRef<HTMLDivElement>(null);
  const scrollBrandPalettesRow = (direction: 'left' | 'right') => {
    const container = brandPalettesRowRef.current;
    if (!container) return;
    const scrollAmount = Math.max(0, Math.floor(container.clientWidth * 0.8));
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };
  
  // Distribute logos across sections
  const distributedData = React.useMemo(() => {
    try {
      if (logosForFiltering.length === 0) {
        return distributeLogos([]);
      }
      return distributeLogos(logosForFiltering);
    } catch (err) {
      console.warn('Error distributing logos:', err);
      // Return empty structure if distribution fails
      return {
        topLogos: [],
        logoTypes: {},
        industries: {}
      };
    }
  }, [logosForFiltering]);

  // Get available types and industries (only show tabs that have logos)
  const availableLogoTypes = React.useMemo(() => {
    try {
      const available = getAvailableLogoTypes(logosForFiltering);
      // Always include at least some basic types for navigation, but prioritize actual available types
      if (available.length > 0) {
        return available;
      }
      // Fallback to basic types only if no types are available
      return ['Wordmarks', 'Lettermarks', 'Pictorial Marks', 'Abstract Marks', 'Combination Marks', 'Emblem Logos', 'Mascot Logos'];
    } catch (err) {
      console.warn('Error getting logo types:', err);
      return ['Wordmarks', 'Lettermarks', 'Pictorial Marks', 'Abstract Marks', 'Combination Marks', 'Emblem Logos', 'Mascot Logos'];
    }
  }, [logosForFiltering]);

  const availableIndustries = React.useMemo(() => {
    try {
      const available = getAvailableIndustries(logosForFiltering);
      // Always include basic industries for navigation, but prioritize actual available industries
      if (available.length > 0) {
        return available;
      }
      // Fallback to actual industry names from database
      return ['Food & Drinks', 'Travel & Hospitality', 'Fashion & Beauty', 'Technology & Software', 'Social Media & Internet', 'Other Businesses', 'Sports & Fitness', 'Automotive & Transport'];
    } catch (err) {
      console.warn('Error getting industries:', err);
      return ['Food & Drinks', 'Travel & Hospitality', 'Fashion & Beauty', 'Technology & Software', 'Social Media & Internet', 'Other Businesses', 'Sports & Fitness', 'Automotive & Transport'];
    }
  }, [logosForFiltering]);

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
  
  // Compute circular logos once for the homepage (standalone section)
  const circularLogos = React.useMemo(() => {
    try {
      const source = logosForFiltering || [];
      const isCircular = (shape?: string) => {
        if (!shape) return false;
        const s = shape.toLowerCase();
        return s.includes('circle') || s.includes('circular') || s.includes('round') || s.includes('rounded');
      };
      return source.filter((logo: any) => isCircular(logo.shape)).slice(0, 30);
    } catch {
      return [] as any[];
    }
  }, [logosForFiltering]);

  // Build homepage brand palettes (most popular, max 25)
  const homepageBrandPalettes = React.useMemo(() => {
    try {
      const source = Array.isArray(logosForFiltering) ? logosForFiltering : [];

      // Use the same selection criteria as BrandPalettesPage: only logos opted-in
      const filtered = source.filter((logo: any) => logo?.showInBrandPalettes === true);

      const mapped = filtered.map((logo: any) => {
        // Prefer brandColors if available
        let colors: Array<{ hex: string; name?: string }> = Array.isArray((logo as any).brandColors) && (logo as any).brandColors.length > 0
          ? (logo as any).brandColors.map((hex: string, index: number) => ({ hex, name: `Color ${index + 1}` }))
          : [];

        // If no brandColors, fall back to primary/secondary
        if (colors.length === 0) {
          if (logo.primaryColor) colors.push({ hex: logo.primaryColor, name: 'Primary' });
          if (logo.secondaryColor) colors.push({ hex: logo.secondaryColor, name: 'Secondary' });
        }

        // Match DB palettes by brand name to enrich/override
        const matchingPalette = (colorPalettes || []).find(p =>
          p.name?.toLowerCase().includes((logo.name || '').toLowerCase()) ||
          (logo.name || '').toLowerCase().includes(p.name?.toLowerCase())
        );
        if (matchingPalette && Array.isArray(matchingPalette.colors) && matchingPalette.colors.length > 0) {
          colors = matchingPalette.colors.map((hex: string, idx: number) => ({ hex, name: `Color ${idx + 1}` }));
        }

        // Fallback default color if still empty
        if (colors.length === 0) {
          colors.push({ hex: '#6B7280', name: 'Default' });
        }

        return {
          id: logo.id,
          brandName: logo.name,
          logoUrl: logo.imageUrl,
          colors,
        } as { id: string; brandName: string; logoUrl?: string; colors: Array<{ hex: string; name?: string }> };
      });

      // Sort by name to match BrandPalettesPage default
      const sorted = mapped.sort((a, b) => a.brandName.localeCompare(b.brandName));

      return sorted.slice(0, 25);
    } catch (e) {
      return [] as Array<{ id: string; brandName: string; logoUrl?: string; colors: Array<{ hex: string; name?: string }> }>;
    }
  }, [logosForFiltering, colorPalettes]);

  // Map homepage tabs to Subcategory only
  const topTabSubcategories: Record<string, string> = React.useMemo(() => ({
    'Restaurant Logos': 'Restaurants',
    'Fashion Logos': 'Clothing & Apparel',
    'Social media': 'Social Networks',
    'Supermarkets & Grocery': 'Supermarkets & Grocery',
    'Apps & SaaS': 'Apps & SaaS',
    'Electronics & Gadgets': 'Electronics & Gadgets',
    'Car Brands': 'Car Brands',
  }), []);

  // Filter all logos by active tab using Subcategory only
  const filteredTopLogos = React.useMemo(() => {
    try {
      const sub = topTabSubcategories[activeTab];
      if (!sub) {
        console.warn('No subcategory mapping found for tab:', activeTab);
        return [];
      }
      
      // Exact subcategory matching - no extra words or variations
      const candidates = logosForFiltering.filter(l => {
        if (!l.subcategory) {
          return false;
        }
        
        const logoSub = l.subcategory;
        const targetSub = sub;
        
        // Exact match only - no variations or extra words
        if (logoSub === targetSub) {
          return true;
        }
        
        return false;
      });
      return [...candidates].sort((a, b) => (b.downloads + b.likes) - (a.downloads + a.likes));
    } catch (err) {
      console.warn('Error filtering logos for tab', activeTab, err);
      // Use full logos array as fallback instead of limited topLogosForDisplay
      return [];
    }
  }, [logosForFiltering, activeTab, topTabSubcategories]);

  // Display top 14 filtered logos
  const displayLogos = filteredTopLogos.slice(0, 14);

  const quickActions = [
    {
      title: 'Brand Playbooks',
      subtitle: '100+ interactive flipping book examples.',
      description: 'Interactive brand playbooks',
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      icon: 'BP',
      path: '/brand-guidelines'
    },
    {
      title: 'Design Academy',
      subtitle: 'Logo design & branding Books.',
      description: 'Logo design and branding books',
      gradient: 'from-green-500 via-teal-500 to-green-700',
      icon: 'DA',
      path: '/learn'
    },
    {
      title: 'Color Lab',
      subtitle: 'Color palettes inspired by brands.',
      description: 'Brand-inspired color palettes',
      gradient: 'from-orange-400 via-red-400 to-pink-500',
      icon: 'CL',
      path: '/color-palette'
    },
    {
      title: 'Typography Hub',
      subtitle: 'Free fonts download',
      description: 'Download free fonts',
      gradient: 'from-orange-500 via-red-500 to-yellow-500',
      icon: 'TH',
      path: '/fonts'
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
      <SEO 
        title={`${activeLogoType} Logo Design Examples | ${activeIndustry} Logo Inspiration`}
        description={`Explore professional ${activeLogoType.toLowerCase()} logo designs from the ${activeIndustry.toLowerCase()} industry. Your trusted source for logo inspiration and brand identity resources. Discover thousands of professional logos across all industries.`}
        keywords={[
          'logo design inspiration', 
          'learning logo design', 
          'famous company logo', 
          'popular company logo', 
          `${activeLogoType.toLowerCase()} logos`,
          `${activeIndustry.toLowerCase()} logos`,
          'professional logos', 
          'brand identity resources', 
          'logo gallery', 
          'corporate logos', 
          'startup logos', 
          'logo design principles'
        ]}
        canonical="https://trustedlogos.netlify.app/"
        ogTitle={`${activeLogoType} Logo Design Examples | ${activeIndustry} Logo Inspiration`}
        ogDescription={`Explore professional ${activeLogoType.toLowerCase()} logo designs from the ${activeIndustry.toLowerCase()} industry. Your trusted source for logo inspiration and brand identity resources.`}
      />
      <div className="w-full mx-auto">
      {/* Recent Creations Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">TOP Logos</h2>
          <a href="#" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium flex items-center">
            Explore the World's Most Iconic Logos
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
          </a>
        </div>

        {/* Filter Tabs - Horizontally scrollable on mobile */}
        <div className="horizontal-scroll sm:flex sm:flex-wrap gap-1 sm:gap-2 mb-6 bg-gray-100 rounded-lg p-1 w-full">
          {['Restaurant Logos', 'Fashion Logos', 'Social media', 'Supermarkets & Grocery', 'Apps & SaaS', 'Electronics & Gadgets', 'Car Brands'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TOP Logos Grid - 2 columns on mobile */}
        <div className="grid mobile-grid-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 mb-8">
          {displayLogos.length > 0 ? displayLogos.map((logo) => (
            <div
              key={logo.id}
              onClick={() => openModal(logo)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden p-1 sm:p-2 md:p-4">
                {logo.imageUrl ? (
                  <img 
                    src={logo.imageUrl} 
                    alt={logo.name} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback to letter if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200 ${logo.imageUrl ? 'hidden' : ''}`}
                  style={{ backgroundColor: logo.primaryColor }}
                >
                  {logo.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="p-1 sm:p-2 md:p-3">
                <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 truncate">
                  {logo.name}
                </h3>
              </div>
            </div>
          )) : (
            <div className="col-span-5 text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No {activeTab} logos found</div>
              <p className="text-sm mb-4">This might be because:</p>
              <div className="text-xs space-y-1 text-left max-w-md mx-auto">
                <p>• No logos have been uploaded yet</p>
                <p>• Logos don't have matching subcategories</p>
                <p>• Subcategory mapping needs adjustment</p>
              </div>
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left max-w-md mx-auto">
                <p><strong>Debug Info:</strong></p>
                <p>Active Tab: {activeTab}</p>
                <p>Mapped Subcategory: {topTabSubcategories[activeTab]}</p>
                <p>Total Logos: {logos.length}</p>
                <p>Available Subcategories: {logos.map(l => l.subcategory).filter(Boolean).slice(0, 5).join(', ')}...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`bg-gradient-to-br ${action.gradient} rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-sm">{action.icon}</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{action.title}</h3>
              <p className="text-sm opacity-90 mb-1">{action.subtitle}</p>
            </Link>
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
      <div className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Logo Design Types</h2>
        
        {/* Logo Types Tab Menu - Horizontally scrollable on mobile */}
        <div className="horizontal-scroll sm:flex sm:flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 bg-white rounded-lg p-1 sm:p-2 shadow-sm border border-gray-200">
          {availableLogoTypes.map((logoType, index) => (
            <button
              key={logoType}
              onClick={() => setActiveLogoType(logoType)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
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

        {/* Logo Examples Grid - 2 columns on mobile */}
        <div className="grid mobile-grid-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
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
                    className="max-w-full max-h-full object-contain"
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
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No {activeLogoType} examples yet</div>
              <p className="text-sm">Add some {activeLogoType} examples to see them here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Brand Color Palettes - One Row (max 25) */}
      {homepageBrandPalettes.length > 0 && (
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Brand Color Palettes</h2>
              <p className="text-gray-600 text-sm">Discover the most popular Brands and color codes</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollBrandPalettesRow('left')}
                aria-label="Scroll left"
                className="h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50 hidden md:inline-flex"
              >
                <span className="sr-only">Left</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-700"><path fillRule="evenodd" d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
              </button>
              <button
                type="button"
                onClick={() => scrollBrandPalettesRow('right')}
                aria-label="Scroll right"
                className="h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50 hidden md:inline-flex"
              >
                <span className="sr-only">Right</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-700"><path fillRule="evenodd" d="M8.47 19.53a.75.75 0 0 1 0-1.06L14.94 12 8.47 5.53a.75.75 0 1 1 1.06-1.06l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" /></svg>
              </button>
              <Link to="/brand-palettes" className="items-center text-sm text-blue-600 hover:text-blue-700 font-medium hidden md:inline-flex">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div ref={brandPalettesRowRef} className="overflow-x-auto no-scrollbar">
            <div className="flex items-stretch gap-3 sm:gap-4 pr-3 sm:pr-4">
              {homepageBrandPalettes.map((brand) => (
                <div
                  key={brand.id}
                  className="flex-shrink-0 w-30 sm:w-48 md:w-60 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  title={brand.brandName}
                >
                  <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.brandName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white text-sm font-bold ${brand.logoUrl ? 'hidden' : ''}`}
                      style={{ backgroundColor: brand.colors?.[0]?.hex || '#6B7280' }}
                    >
                      {brand.brandName?.charAt(0)?.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex h-3">
                    {brand.colors.slice(0, 6).map((c, idx) => (
                      <div key={idx} className="flex-1" style={{ backgroundColor: c.hex }} title={`${c.name || 'Color'}: ${c.hex}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Circular Logos Section */}
      {circularLogos.length > 0 && (
        <div className="mt-8 sm:mt-12 mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Circular Logos</h2>
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCircularLogoRow('left')}
                aria-label="Scroll left"
                className="h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50 hidden md:inline-flex"
              >
                <span className="sr-only">Left</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-700"><path fillRule="evenodd" d="M15.53 4.47a.75.75 0 0 1 0 1.06L9.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06l-7-7a.75.75 0 0 1 0-1.06l7-7a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
              </button>
              <button
                type="button"
                onClick={() => scrollCircularLogoRow('right')}
                aria-label="Scroll right"
                className="h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50 hidden md:inline-flex"
              >
                <span className="sr-only">Right</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-gray-700"><path fillRule="evenodd" d="M8.47 19.53a.75.75 0 0 1 0-1.06L14.94 12 8.47 5.53a.75.75 0 1 1 1.06-1.06l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>

          <div ref={circularLogoRowRef} className="overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4">
              {circularLogos.map((logo: any, index: number) => (
                <div
                  key={`${logo.name}-${index}`}
                  onClick={() => openModal(logo)}
                  className="flex-shrink-0 w-30 h-30 sm:w-48 sm:h-48 md:w-60 md:h-60 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer flex items-center justify-center"
                  title={logo.name}
                >
                  {logo.imageUrl ? (
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="w-full h-full object-contain bg-white"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold bg-gray-400 ${logo.imageUrl ? 'hidden' : ''}`}
                    style={{ backgroundColor: logo.primaryColor }}
                  >
                    {logo.name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Industry Logos Section */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Industry Logo Showcase</h2>
        
        {/* Industry Tab Menu - Horizontally scrollable on mobile */}
        <div className="horizontal-scroll sm:flex sm:flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 bg-white rounded-lg p-1 sm:p-2 shadow-sm border border-gray-200">
          {availableIndustries.map((industry) => (
            <button
              key={industry}
              onClick={() => setActiveIndustry(industry)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeIndustry === industry
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>


        {/* Industry Logos Grid - 2 columns on mobile */}
        <div className="grid mobile-grid-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
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
                    className="max-w-full max-h-full object-contain"
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
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No {activeIndustry} logos yet</div>
              <p className="text-sm">Upload some {activeIndustry} logos to see them here!</p>
            </div>
          )}
        </div>
        
        {/* More Button */}
        <div className="flex justify-center mt-8">
          <Link
            to="/brands-logos"
            className="inline-flex items-center px-6 py-3 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
          >
            View All Logos
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>

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