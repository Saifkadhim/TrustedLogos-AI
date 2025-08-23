import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { useLogos } from './hooks/useLogos-safe';
import LogoModal from './components/LogoModal';
import { INDUSTRY_CATEGORIES } from './utils/industryCategories';

const AllImagesPage = () => {
  const { logos, loading, error, incrementDownloads, incrementLikes } = useLogos();
  const [selectedLogoTypes, setSelectedLogoTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 84;
  
  // Modal state
  const [selectedLogo, setSelectedLogo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Generate dynamic data from uploaded logos
  const logosByType = useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    
    logos.forEach(logo => {
      if (!grouped[logo.type]) {
        grouped[logo.type] = [];
      }
      grouped[logo.type].push({
        name: logo.name,
        primaryColor: logo.primaryColor,
        letter: logo.name.charAt(0),
        imageUrl: logo.imageUrl,
        industry: logo.industry,
        shape: logo.shape,
        id: logo.id,
        downloads: logo.downloads,
        likes: logo.likes,
        information: logo.information,
        designerUrl: logo.designerUrl,
        secondaryColor: logo.secondaryColor,
        createdAt: logo.createdAt,
        updatedAt: logo.updatedAt
      });
    });
    
    return grouped;
  }, [logos]);

  const logoTypes = {
    'Wordmarks': {
      logos: logosByType['Wordmarks'] || []
    },
    'Lettermarks': {
      logos: logosByType['Lettermarks'] || []
    },
    'Pictorial Marks': {
      logos: logosByType['Pictorial Marks'] || []
    },
    'Abstract Marks': {
      logos: logosByType['Abstract Marks'] || []
    },
    'Combination Marks': {
      logos: logosByType['Combination Marks'] || []
    },
    'Emblem Logos': {
      logos: logosByType['Emblem Logos'] || []
    },
    'Mascot Logos': {
      logos: logosByType['Mascot Logos'] || []
    }
  };

  const industryLogos = {
    'Airlines': {
      description: 'Airline logos emphasize trust, safety, and global connectivity. They often feature wings, globes, or abstract symbols that convey movement and reliability.',
      logos: [
        { name: 'Delta', color: '#003366', letter: 'D', category: 'Major Carrier' },
        { name: 'American Airlines', color: '#c8102e', letter: 'A', category: 'Legacy Carrier' },
        { name: 'United', color: '#0033a0', letter: 'U', category: 'Global Network' },
        { name: 'Southwest', color: '#304cb2', letter: 'S', category: 'Low Cost Carrier' },
        { name: 'JetBlue', color: '#0f3875', letter: 'J', category: 'Premium Low Cost' },
        { name: 'Emirates', color: '#d71921', letter: 'E', category: 'International Luxury' },
        { name: 'Lufthansa', color: '#05164d', letter: 'L', category: 'European Flag Carrier' },
        { name: 'British Airways', color: '#075aaa', letter: 'B', category: 'Premium International' }
      ]
    },
    'Automotive': {
      description: 'Automotive logos emphasize speed, reliability, and innovation. They often feature bold typography, dynamic shapes, and colors that convey power and trust.',
      logos: [
        { name: 'Tesla', color: '#cc0000', letter: 'T', category: 'Electric Vehicles' },
        { name: 'BMW', color: '#0066b2', letter: 'B', category: 'Luxury Cars' },
        { name: 'Ford', color: '#003478', letter: 'F', category: 'Classic American' },
        { name: 'Mercedes', color: '#000000', letter: 'M', category: 'Premium Luxury' },
        { name: 'Toyota', color: '#eb0a1e', letter: 'T', category: 'Reliable Transportation' },
        { name: 'Honda', color: '#e60012', letter: 'H', category: 'Practical Innovation' },
        { name: 'Audi', color: '#bb0a30', letter: 'A', category: 'German Engineering' },
        { name: 'Volkswagen', color: '#001e50', letter: 'V', category: 'People\'s Car' }
      ]
    },
    'Cosmetics': {
      description: 'Cosmetics logos focus on beauty, elegance, and sophistication. They use refined typography and colors that appeal to their target demographic.',
      logos: [
        { name: 'L\'Oréal', color: '#000000', letter: 'L', category: 'Beauty Giant' },
        { name: 'Maybelline', color: '#000000', letter: 'M', category: 'Mass Market' },
        { name: 'MAC', color: '#000000', letter: 'M', category: 'Professional Makeup' },
        { name: 'Sephora', color: '#000000', letter: 'S', category: 'Beauty Retailer' },
        { name: 'Clinique', color: '#7fb069', letter: 'C', category: 'Skincare' },
        { name: 'Estée Lauder', color: '#1e3a8a', letter: 'E', category: 'Luxury Beauty' },
        { name: 'Revlon', color: '#dc2626', letter: 'R', category: 'Classic Beauty' },
        { name: 'CoverGirl', color: '#059669', letter: 'C', category: 'Accessible Beauty' }
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
    'Education': {
      description: 'Education logos convey knowledge, growth, and trust. They often use academic colors like blue and incorporate symbols of learning and achievement.',
      logos: [
        { name: 'Harvard', color: '#a51c30', letter: 'H', category: 'Ivy League' },
        { name: 'MIT', color: '#8a8b8c', letter: 'M', category: 'Technology Institute' },
        { name: 'Stanford', color: '#8c1515', letter: 'S', category: 'Private Research' },
        { name: 'Yale', color: '#00356b', letter: 'Y', category: 'Elite University' },
        { name: 'Oxford', color: '#002147', letter: 'O', category: 'Ancient University' },
        { name: 'Cambridge', color: '#a3c1ad', letter: 'C', category: 'Historic Institution' },
        { name: 'Khan Academy', color: '#14bf96', letter: 'K', category: 'Online Learning' },
        { name: 'Coursera', color: '#0056d3', letter: 'C', category: 'MOOC Platform' }
      ]
    },
    'Electronics': {
      description: 'Electronics logos convey innovation, precision, and cutting-edge technology. They often feature sleek designs with metallic colors and modern typography.',
      logos: [
        { name: 'Samsung', color: '#1428a0', letter: 'S', category: 'Consumer Electronics' },
        { name: 'LG', color: '#a50034', letter: 'L', category: 'Home Appliances' },
        { name: 'Sony', color: '#000000', letter: 'S', category: 'Entertainment Tech' },
        { name: 'Panasonic', color: '#0033a0', letter: 'P', category: 'Electronics Giant' },
        { name: 'Sharp', color: '#e60012', letter: 'S', category: 'Display Technology' },
        { name: 'Toshiba', color: '#ff0000', letter: 'T', category: 'Industrial Electronics' },
        { name: 'Canon', color: '#da020e', letter: 'C', category: 'Imaging Solutions' },
        { name: 'Philips', color: '#0066cc', letter: 'P', category: 'Healthcare Tech' }
      ]
    },
    'Energy companies': {
      description: 'Energy company logos emphasize power, sustainability, and reliability. They often use strong colors and symbols that represent energy sources and environmental responsibility.',
      logos: [
        { name: 'ExxonMobil', color: '#ed1c24', letter: 'E', category: 'Oil & Gas Giant' },
        { name: 'Shell', color: '#ffde00', letter: 'S', category: 'Global Energy' },
        { name: 'BP', color: '#00914c', letter: 'B', category: 'Beyond Petroleum' },
        { name: 'Chevron', color: '#1f5aa6', letter: 'C', category: 'Integrated Energy' },
        { name: 'Total', color: '#ee1c25', letter: 'T', category: 'French Energy' },
        { name: 'Tesla Energy', color: '#cc0000', letter: 'T', category: 'Clean Energy' },
        { name: 'General Electric', color: '#005eb8', letter: 'G', category: 'Power Solutions' },
        { name: 'Siemens Energy', color: '#009999', letter: 'S', category: 'Energy Technology' }
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
        { name: 'Versace', color: '#a6192e', letter: 'V', category: 'Bold Fashion' },
        { name: 'H&M', color: '#e50000', letter: 'H', category: 'Affordable Fashion' }
      ]
    },
    'Finance / Bank': {
      description: 'Financial logos emphasize trust, stability, and professionalism. They use conservative colors like blue and incorporate symbols of security and growth.',
      logos: [
        { name: 'JPMorgan Chase', color: '#117aca', letter: 'J', category: 'Investment Bank' },
        { name: 'Bank of America', color: '#e31837', letter: 'B', category: 'Commercial Bank' },
        { name: 'Wells Fargo', color: '#d71921', letter: 'W', category: 'Retail Banking' },
        { name: 'Goldman Sachs', color: '#7aa6dc', letter: 'G', category: 'Investment Banking' },
        { name: 'Morgan Stanley', color: '#01426a', letter: 'M', category: 'Financial Services' },
        { name: 'Citibank', color: '#da020e', letter: 'C', category: 'Global Banking' },
        { name: 'American Express', color: '#006fcf', letter: 'A', category: 'Financial Services' },
        { name: 'Visa', color: '#1a1f71', letter: 'V', category: 'Payment Network' }
      ]
    },
    'Fitness': {
      description: 'Fitness logos embody energy, strength, and motivation. They use dynamic colors and bold typography to inspire action and healthy living.',
      logos: [
        { name: 'Nike Training', color: '#000000', letter: 'N', category: 'Athletic Training' },
        { name: 'Planet Fitness', color: '#7b2cbf', letter: 'P', category: 'Budget Gym Chain' },
        { name: 'Gold\'s Gym', color: '#ffcd00', letter: 'G', category: 'Bodybuilding' },
        { name: 'LA Fitness', color: '#1e40af', letter: 'L', category: 'Full Service Gym' },
        { name: 'Equinox', color: '#000000', letter: 'E', category: 'Luxury Fitness' },
        { name: 'CrossFit', color: '#000000', letter: 'C', category: 'Functional Fitness' },
        { name: 'Peloton', color: '#000000', letter: 'P', category: 'Connected Fitness' },
        { name: 'SoulCycle', color: '#ffcd00', letter: 'S', category: 'Boutique Cycling' }
      ]
    },
    'Food & Drinks': {
      description: 'Food and beverage logos use appetizing colors, friendly typography, and imagery that evokes taste, freshness, and satisfaction.',
      logos: [
        { name: 'Coca-Cola', color: '#f40009', letter: 'C', category: 'Soft Drinks' },
        { name: 'Pepsi', color: '#004b93', letter: 'P', category: 'Cola Beverages' },
        { name: 'Starbucks', color: '#00704a', letter: 'S', category: 'Coffee Chain' },
        { name: 'Red Bull', color: '#004387', letter: 'R', category: 'Energy Drinks' },
        { name: 'Nestlé', color: '#87ceeb', letter: 'N', category: 'Food & Beverage' },
        { name: 'Unilever', color: '#0033a0', letter: 'U', category: 'Consumer Goods' },
        { name: 'Kraft Heinz', color: '#da020e', letter: 'K', category: 'Packaged Foods' },
        { name: 'KitKat', color: '#d70022', letter: 'K', category: 'Chocolate' }
      ]
    },
    'Games': {
      description: 'Gaming logos are bold, dynamic, and often incorporate elements that appeal to their target audience. They use vibrant colors and modern typography.',
      logos: [
        { name: 'PlayStation', color: '#003087', letter: 'P', category: 'Console Gaming' },
        { name: 'Xbox', color: '#107c10', letter: 'X', category: 'Microsoft Gaming' },
        { name: 'Nintendo', color: '#e60012', letter: 'N', category: 'Family Gaming' },
        { name: 'Steam', color: '#1b2838', letter: 'S', category: 'PC Gaming Platform' },
        { name: 'Epic Games', color: '#000000', letter: 'E', category: 'Game Developer' },
        { name: 'Activision', color: '#ff6900', letter: 'A', category: 'Game Publisher' },
        { name: 'EA Sports', color: '#000000', letter: 'E', category: 'Sports Games' },
        { name: 'Ubisoft', color: '#000000', letter: 'U', category: 'Game Studio' }
      ]
    },
    'Hotels': {
      description: 'Hotel logos convey luxury, comfort, and hospitality. They often use elegant typography and colors that suggest relaxation and premium service.',
      logos: [
        { name: 'Marriott', color: '#a6192e', letter: 'M', category: 'Luxury Hotels' },
        { name: 'Hilton', color: '#0f4ba6', letter: 'H', category: 'Global Hospitality' },
        { name: 'Hyatt', color: '#da020e', letter: 'H', category: 'Premium Hotels' },
        { name: 'InterContinental', color: '#c8a882', letter: 'I', category: 'Luxury Chain' },
        { name: 'Four Seasons', color: '#8b4513', letter: 'F', category: 'Ultra Luxury' },
        { name: 'Ritz-Carlton', color: '#8b4513', letter: 'R', category: 'Luxury Service' },
        { name: 'Holiday Inn', color: '#00a651', letter: 'H', category: 'Mid-Scale Hotels' },
        { name: 'Best Western', color: '#003f7f', letter: 'B', category: 'Hotel Chain' }
      ]
    },
    'Industrial': {
      description: 'Industrial logos emphasize strength, reliability, and engineering excellence. They use bold colors and sturdy typography to convey durability and professional expertise.',
      logos: [
        { name: 'General Electric', color: '#005eb8', letter: 'G', category: 'Industrial Conglomerate' },
        { name: 'Siemens', color: '#009999', letter: 'S', category: 'Engineering Giant' },
        { name: 'Honeywell', color: '#da020e', letter: 'H', category: 'Aerospace & Defense' },
        { name: 'Caterpillar', color: '#ffcd00', letter: 'C', category: 'Heavy Machinery' },
        { name: '3M', color: '#da020e', letter: '3', category: 'Industrial Innovation' },
        { name: 'Boeing', color: '#0033a0', letter: 'B', category: 'Aerospace' },
        { name: 'Lockheed Martin', color: '#003f7f', letter: 'L', category: 'Defense Contractor' },
        { name: 'ABB', color: '#ff0000', letter: 'A', category: 'Power & Automation' }
      ]
    },
    'Insurance': {
      description: 'Insurance logos emphasize protection, trust, and reliability. They often use blue colors and symbols that convey security and peace of mind.',
      logos: [
        { name: 'State Farm', color: '#da020e', letter: 'S', category: 'Auto Insurance' },
        { name: 'Geico', color: '#004225', letter: 'G', category: 'Direct Insurance' },
        { name: 'Progressive', color: '#0033a0', letter: 'P', category: 'Auto Insurance' },
        { name: 'Allstate', color: '#0033a0', letter: 'A', category: 'Personal Insurance' },
        { name: 'Liberty Mutual', color: '#004b87', letter: 'L', category: 'Property Insurance' },
        { name: 'Farmers', color: '#004225', letter: 'F', category: 'Agricultural Insurance' },
        { name: 'USAA', color: '#003f7f', letter: 'U', category: 'Military Insurance' },
        { name: 'Nationwide', color: '#0033a0', letter: 'N', category: 'Mutual Insurance' }
      ]
    },
    'Internet': {
      description: 'Internet company logos focus on connectivity, accessibility, and digital innovation. They use modern designs with vibrant colors to represent the dynamic nature of the web.',
      logos: [
        { name: 'Google', color: '#4285f4', letter: 'G', category: 'Search Engine' },
        { name: 'Facebook', color: '#1877f2', letter: 'F', category: 'Social Media' },
        { name: 'Twitter', color: '#1da1f2', letter: 'T', category: 'Microblogging' },
        { name: 'LinkedIn', color: '#0077b5', letter: 'L', category: 'Professional Network' },
        { name: 'Instagram', color: '#e4405f', letter: 'I', category: 'Photo Sharing' },
        { name: 'YouTube', color: '#ff0000', letter: 'Y', category: 'Video Platform' },
        { name: 'TikTok', color: '#000000', letter: 'T', category: 'Short Video' },
        { name: 'Snapchat', color: '#fffc00', letter: 'S', category: 'Messaging' }
      ]
    },
    'Media / TV': {
      description: 'Media and TV logos capture attention and convey entertainment value. They use bold colors and dynamic designs to represent creativity and engaging content.',
      logos: [
        { name: 'Netflix', color: '#e50914', letter: 'N', category: 'Streaming Service' },
        { name: 'Disney', color: '#113ccf', letter: 'D', category: 'Entertainment Giant' },
        { name: 'HBO', color: '#000000', letter: 'H', category: 'Premium TV' },
        { name: 'CNN', color: '#cc0000', letter: 'C', category: 'News Network' },
        { name: 'BBC', color: '#000000', letter: 'B', category: 'Public Broadcasting' },
        { name: 'ESPN', color: '#da020e', letter: 'E', category: 'Sports Network' },
        { name: 'MTV', color: '#000000', letter: 'M', category: 'Music Television' },
        { name: 'Spotify', color: '#1db954', letter: 'S', category: 'Music Streaming' }
      ]
    },
    'Motorcycles': {
      description: 'Motorcycle logos embody freedom, power, and adventure. They use bold designs and strong colors that appeal to riders and enthusiasts.',
      logos: [
        { name: 'Harley-Davidson', color: '#f47216', letter: 'H', category: 'American Cruiser' },
        { name: 'Honda Motorcycles', color: '#e60012', letter: 'H', category: 'Japanese Reliability' },
        { name: 'Yamaha', color: '#0033a0', letter: 'Y', category: 'Performance Bikes' },
        { name: 'Kawasaki', color: '#00a651', letter: 'K', category: 'Sport Motorcycles' },
        { name: 'Suzuki', color: '#0033a0', letter: 'S', category: 'Versatile Bikes' },
        { name: 'Ducati', color: '#da020e', letter: 'D', category: 'Italian Performance' },
        { name: 'BMW Motorrad', color: '#0066b2', letter: 'B', category: 'German Engineering' },
        { name: 'Indian Motorcycle', color: '#8b4513', letter: 'I', category: 'American Heritage' }
      ]
    },
    'Music': {
      description: 'Music logos are creative and expressive, often incorporating musical elements or abstract designs that represent sound and rhythm.',
      logos: [
        { name: 'Spotify', color: '#1db954', letter: 'S', category: 'Music Streaming' },
        { name: 'Apple Music', color: '#000000', letter: 'A', category: 'Digital Music' },
        { name: 'YouTube Music', color: '#ff0000', letter: 'Y', category: 'Video Music' },
        { name: 'SoundCloud', color: '#ff5500', letter: 'S', category: 'Audio Platform' },
        { name: 'Pandora', color: '#005483', letter: 'P', category: 'Internet Radio' },
        { name: 'Tidal', color: '#000000', letter: 'T', category: 'Hi-Fi Streaming' },
        { name: 'Deezer', color: '#feaa2d', letter: 'D', category: 'Global Streaming' },
        { name: 'Amazon Music', color: '#ff9900', letter: 'A', category: 'Prime Music' }
      ]
    },
    'Organizations': {
      description: 'Organization logos convey purpose, trust, and mission. They often use professional colors and symbols that represent their cause or industry.',
      logos: [
        { name: 'Red Cross', color: '#da020e', letter: 'R', category: 'Humanitarian' },
        { name: 'United Nations', color: '#009edb', letter: 'U', category: 'International Org' },
        { name: 'World Health Org', color: '#0033a0', letter: 'W', category: 'Health Agency' },
        { name: 'UNICEF', color: '#00aeef', letter: 'U', category: 'Children\'s Fund' },
        { name: 'Greenpeace', color: '#00a651', letter: 'G', category: 'Environmental' },
        { name: 'Amnesty Intl', color: '#ffcd00', letter: 'A', category: 'Human Rights' },
        { name: 'Doctors W/O Borders', color: '#da020e', letter: 'D', category: 'Medical Aid' },
        { name: 'Salvation Army', color: '#da020e', letter: 'S', category: 'Religious Charity' }
      ]
    },
    'Pets': {
      description: 'Pet-related logos are friendly and approachable, using warm colors and playful designs that appeal to pet owners and animal lovers.',
      logos: [
        { name: 'Petco', color: '#da020e', letter: 'P', category: 'Pet Retailer' },
        { name: 'PetSmart', color: '#0033a0', letter: 'P', category: 'Pet Superstore' },
        { name: 'Chewy', color: '#004b87', letter: 'C', category: 'Online Pet Store' },
        { name: 'Blue Buffalo', color: '#0033a0', letter: 'B', category: 'Natural Pet Food' },
        { name: 'Purina', color: '#da020e', letter: 'P', category: 'Pet Nutrition' },
        { name: 'Hill\'s Pet', color: '#00a651', letter: 'H', category: 'Prescription Diet' },
        { name: 'ASPCA', color: '#f47216', letter: 'A', category: 'Animal Welfare' },
        { name: 'VCA Animal', color: '#da020e', letter: 'V', category: 'Veterinary Care' }
      ]
    },
    'Pharma': {
      description: 'Pharmaceutical logos emphasize trust, health, and scientific expertise. They typically use blue and green colors to convey healing and reliability.',
      logos: [
        { name: 'Pfizer', color: '#0033a0', letter: 'P', category: 'Global Pharma' },
        { name: 'Johnson & Johnson', color: '#da020e', letter: 'J', category: 'Healthcare Giant' },
        { name: 'Merck', color: '#0033a0', letter: 'M', category: 'Research Pharma' },
        { name: 'Novartis', color: '#0033a0', letter: 'N', category: 'Swiss Pharma' },
        { name: 'Roche', color: '#0033a0', letter: 'R', category: 'Biotech Leader' },
        { name: 'AstraZeneca', color: '#7b2cbf', letter: 'A', category: 'British Pharma' },
        { name: 'GlaxoSmithKline', color: '#f47216', letter: 'G', category: 'UK Healthcare' },
        { name: 'Eli Lilly', color: '#da020e', letter: 'E', category: 'Diabetes Care' }
      ]
    },
    'Retailers': {
      description: 'Retail logos focus on accessibility, value, and customer appeal. They use friendly colors and clear typography to attract shoppers.',
      logos: [
        { name: 'Walmart', color: '#004c91', letter: 'W', category: 'Discount Retailer' },
        { name: 'Target', color: '#cc0000', letter: 'T', category: 'Department Store' },
        { name: 'Costco', color: '#e31837', letter: 'C', category: 'Wholesale Club' },
        { name: 'Home Depot', color: '#f96302', letter: 'H', category: 'Home Improvement' },
        { name: 'Lowe\'s', color: '#004990', letter: 'L', category: 'Hardware Store' },
        { name: 'Best Buy', color: '#003f7f', letter: 'B', category: 'Electronics Retail' },
        { name: 'Macy\'s', color: '#da020e', letter: 'M', category: 'Department Store' },
        { name: 'Nordstrom', color: '#000000', letter: 'N', category: 'Upscale Retail' }
      ]
    },
    'Restaurant': {
      description: 'Restaurant logos combine appetite appeal with brand personality, using warm colors and inviting designs that make customers hungry and welcome.',
      logos: [
        { name: 'McDonald\'s', color: '#ffcd00', letter: 'M', category: 'Fast Food Giant' },
        { name: 'Burger King', color: '#d62300', letter: 'B', category: 'Flame-Grilled' },
        { name: 'KFC', color: '#f40027', letter: 'K', category: 'Fried Chicken' },
        { name: 'Subway', color: '#00a651', letter: 'S', category: 'Sandwich Chain' },
        { name: 'Pizza Hut', color: '#ee3124', letter: 'P', category: 'Pizza Delivery' },
        { name: 'Domino\'s', color: '#0078ae', letter: 'D', category: 'Pizza Innovation' },
        { name: 'Taco Bell', color: '#702f8a', letter: 'T', category: 'Mexican Fast Food' },
        { name: 'Dunkin\'', color: '#ff671f', letter: 'D', category: 'Coffee & Donuts' }
      ]
    },
    'Software': {
      description: 'Software logos emphasize innovation, efficiency, and user-friendliness. They often use modern, clean designs with tech-forward colors.',
      logos: [
        { name: 'Microsoft', color: '#00bcf2', letter: 'M', category: 'Enterprise Software' },
        { name: 'Adobe', color: '#da020e', letter: 'A', category: 'Creative Software' },
        { name: 'Oracle', color: '#da020e', letter: 'O', category: 'Database Software' },
        { name: 'Salesforce', color: '#00a1e0', letter: 'S', category: 'CRM Software' },
        { name: 'SAP', color: '#0033a0', letter: 'S', category: 'Enterprise Solutions' },
        { name: 'Slack', color: '#4a154b', letter: 'S', category: 'Communication' },
        { name: 'Zoom', color: '#2d8cff', letter: 'Z', category: 'Video Conferencing' },
        { name: 'Dropbox', color: '#0061ff', letter: 'D', category: 'Cloud Storage' }
      ]
    },
    'Technology': {
      description: 'Technology logos emphasize innovation, reliability, and forward-thinking. They often use clean, modern designs with blues and grays to convey trust and expertise.',
      logos: [
        { name: 'Apple', color: '#000000', letter: 'A', category: 'Consumer Electronics' },
        { name: 'Google', color: '#4285f4', letter: 'G', category: 'Search & Cloud' },
        { name: 'Microsoft', color: '#00bcf2', letter: 'M', category: 'Software' },
        { name: 'Amazon', color: '#ff9900', letter: 'A', category: 'E-commerce & Cloud' },
        { name: 'Meta', color: '#1877f2', letter: 'M', category: 'Social Technology' },
        { name: 'Tesla', color: '#cc0000', letter: 'T', category: 'Electric Innovation' },
        { name: 'Netflix', color: '#e50914', letter: 'N', category: 'Streaming Tech' },
        { name: 'Intel', color: '#0071c5', letter: 'I', category: 'Semiconductors' }
      ]
    },
    'Sports': {
      description: 'Sports logos embody energy, competition, and team spirit. They use dynamic shapes and bold colors to convey movement, strength, and athletic excellence.',
      logos: [
        { name: 'Nike', color: '#000000', letter: 'N', category: 'Athletic Footwear' },
        { name: 'Adidas', color: '#000000', letter: 'A', category: 'Sports Apparel' },
        { name: 'Under Armour', color: '#000000', letter: 'U', category: 'Performance Gear' },
        { name: 'Puma', color: '#000000', letter: 'P', category: 'Sports Brand' },
        { name: 'Reebok', color: '#da020e', letter: 'R', category: 'Fitness Apparel' },
        { name: 'New Balance', color: '#da020e', letter: 'N', category: 'Running Shoes' },
        { name: 'Converse', color: '#000000', letter: 'C', category: 'Casual Sneakers' },
        { name: 'Vans', color: '#000000', letter: 'V', category: 'Skateboard Culture' }
      ]
    },
    'Other': {
      description: 'Miscellaneous logos from various industries that don\'t fit into specific categories. These showcase diverse design approaches and creative solutions.',
      logos: [
        { name: 'FedEx', color: '#4d148c', letter: 'F', category: 'Logistics' },
        { name: 'UPS', color: '#8a6914', letter: 'U', category: 'Shipping' },
        { name: 'IKEA', color: '#0051ba', letter: 'I', category: 'Furniture Design' },
        { name: 'WeWork', color: '#000000', letter: 'W', category: 'Coworking' },
        { name: 'Uber', color: '#000000', letter: 'U', category: 'Ride Sharing' },
        { name: 'Lyft', color: '#ff00bf', letter: 'L', category: 'Transportation' },
        { name: 'Airbnb', color: '#ff5a5f', letter: 'A', category: 'Home Sharing' },
        { name: 'DoorDash', color: '#ff3008', letter: 'D', category: 'Food Delivery' },
        { name: 'Instacart', color: '#43b02a', letter: 'I', category: 'Grocery Delivery' }
      ]
    }
  };



  // Use dynamic logos from Supabase
  const allLogos = useMemo(() => {
    return logos.map((logo) => ({
      id: logo.id,
      name: logo.name,
      primaryColor: logo.primaryColor,
      secondaryColor: logo.secondaryColor,
      letter: logo.name.charAt(0),
      type: logo.type,
      category: logo.industry,
      subcategory: logo.subcategory,
      shape: logo.shape,
      imageUrl: logo.imageUrl,
      industry: logo.industry,
      information: logo.information,
      designerUrl: logo.designerUrl,
      downloads: logo.downloads,
      likes: logo.likes,
      createdAt: logo.createdAt,
      updatedAt: logo.updatedAt
    }));
  }, [logos]);

  // Get unique values for filters
  const uniqueLogoTypes = useMemo(() => {
    return [...new Set(allLogos.map(logo => logo.type))];
  }, [allLogos]);

  const uniqueColors = useMemo(() => {
    // Curated set of 11 main colors for better filtering (left to right order)
    return [
      '#000000', // Black
      '#A66037', // Brown
      '#E88C30', // Orange
      '#E8E230', // Yellow
      '#16C72E', // Green
      '#30C9E8', // Cyan
      '#4030E8', // Blue
      '#8930E8', // Purple
      '#E8308C', // Pink
      '#E83A30', // Red
      '#E86830'  // Orange-Red
    ];
  }, []);

  const uniqueShapes = useMemo(() => {
    return [...new Set(allLogos.map(logo => logo.shape))];
  }, [allLogos]);

  // Filter logos based on selected filters and search query
  const filteredLogos = useMemo(() => {
    return allLogos.filter(logo => {
      const typeMatch = selectedLogoTypes.length === 0 || selectedLogoTypes.includes(logo.type);
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(logo.primaryColor);
      const shapeMatch = selectedShapes.length === 0 || selectedShapes.includes(logo.shape);
      const categoryMatch = activeCategory === 'All' || logo.category === activeCategory;
      const subcategoryMatch = activeSubcategory === 'All' || !activeSubcategory || logo.subcategory === activeSubcategory;
      const searchMatch = searchQuery === '' || 
        logo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        logo.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        logo.industry.toLowerCase().includes(searchQuery.toLowerCase());
      
      return typeMatch && colorMatch && shapeMatch && categoryMatch && subcategoryMatch && searchMatch;
    });
  }, [allLogos, selectedLogoTypes, selectedColors, selectedShapes, activeCategory, activeSubcategory, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLogos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogos = filteredLogos.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedLogoTypes, selectedColors, selectedShapes, activeCategory, activeSubcategory, searchQuery]);

  // Handle filter changes
  const handleFilterChange = (filterType: 'type' | 'color' | 'shape', value: string) => {
    switch (filterType) {
      case 'type':
        setSelectedLogoTypes(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'color':
        setSelectedColors(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'shape':
        setSelectedShapes(prev => 
          prev.includes(value) 
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedLogoTypes([]);
    setSelectedColors([]);
    setSelectedShapes([]);
    setActiveCategory('All');
    setActiveSubcategory('All');
    setCurrentPage(1);
  };

  const categoryTabs = useMemo(() => ['All', ...INDUSTRY_CATEGORIES.map(c => c.name)], []);
  const subcategoryTabs = useMemo(() => {
    if (activeCategory === 'All') return [] as string[];
    const cat = INDUSTRY_CATEGORIES.find(c => c.name === activeCategory);
    return cat ? ['All', ...cat.subcategories.map(s => s.name)] : [];
  }, [activeCategory]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading logos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">


        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Category Tabs (connected to INDUSTRY_CATEGORIES) */}
          <div className="flex flex-wrap gap-2 mb-3 bg-gray-100 rounded-lg p-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveCategory(tab); setActiveSubcategory('All'); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeCategory === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {subcategoryTabs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 rounded-lg p-2 border border-gray-200">
              {subcategoryTabs.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${
                    activeSubcategory === sub
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Filters Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Logo Type Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <div className="flex flex-wrap gap-1">
                  {uniqueLogoTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('type', type)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        selectedLogoTypes.includes(type)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Color:</span>
                <div className="flex gap-1">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleFilterChange('color', color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                        selectedColors.includes(color)
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>



              {/* Shape Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Shape:</span>
                <div className="flex gap-1">
                  {uniqueShapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => handleFilterChange('shape', shape)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        selectedShapes.includes(shape)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {shape.charAt(0).toUpperCase() + shape.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

                {/* Clear All Button */}
                {(selectedLogoTypes.length > 0 || selectedColors.length > 0 || selectedShapes.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-full hover:bg-red-50 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* View Mode Toggle - Right Side */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">View:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-7 gap-4' 
              : 'space-y-3'
          }`}>
            {paginatedLogos.map((logo) => (
              <div
                key={logo.id}
                onClick={() => openModal(logo)}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group border border-gray-200 ${
                  viewMode === 'list' ? 'flex items-center p-4' : ''
                }`}
              >
                <div className={`${
                  viewMode === 'grid' 
                    ? 'aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden' 
                    : 'w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0'
                }`}>
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
                    className={`${logo.imageUrl ? 'hidden' : ''} ${
                      viewMode === 'grid' 
                        ? 'w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200'
                        : 'w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm'
                    }`}
                    style={{ backgroundColor: logo.primaryColor }}
                  >
                    {logo.letter}
                  </div>
                </div>
                <div className={viewMode === 'grid' ? 'p-3' : 'flex-1'}>
                  <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                    {logo.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-1">{logo.type}</p>
                  {viewMode === 'list' && (
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span className="capitalize">{logo.shape}</span>
                      <span>•</span>
                      <span>{logo.category}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredLogos.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <span>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredLogos.length)} of {filteredLogos.length} logos
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 7) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 4) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNumber = totalPages - 6 + i;
                    } else {
                      pageNumber = currentPage - 3 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {filteredLogos.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logos found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
              <button
                onClick={clearAllFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          )}
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
    </div>
  );
};

export default AllImagesPage;