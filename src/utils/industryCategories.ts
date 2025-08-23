/**
 * Industry categories and subcategories for logo management
 */

export interface IndustrySubcategory {
  id: string;
  name: string;
  description?: string;
}

export interface IndustryCategory {
  id: string;
  name: string;
  description: string;
  subcategories: IndustrySubcategory[];
}

export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  {
    id: 'food-drinks',
    name: 'Food & Drinks',
    description: 'Food and beverage logos use appetizing colors, friendly typography, and imagery that evokes taste, freshness, and satisfaction.',
    subcategories: [
      { id: 'restaurants', name: 'Restaurants' },
      { id: 'cafes-coffee', name: 'Cafés & Coffee Shops' },
      { id: 'bakeries-desserts', name: 'Bakeries & Desserts' },
      { id: 'packaged-food', name: 'Packaged Food' },
      { id: 'beverages-juice', name: 'Beverages & Juice Bars' }
    ]
  },
  {
    id: 'fashion-beauty',
    name: 'Fashion & Beauty',
    description: 'Fashion and beauty logos focus on elegance, style, and sophistication. They use refined typography and colors that appeal to their target demographic.',
    subcategories: [
      { id: 'clothing-apparel', name: 'Clothing & Apparel' },
      { id: 'shoes-accessories', name: 'Shoes & Accessories' },
      { id: 'jewelry', name: 'Jewelry' },
      { id: 'cosmetics-skincare', name: 'Cosmetics & Skincare' },
      { id: 'hair-salons', name: 'Hair & Salons' }
    ]
  },
  {
    id: 'technology-software',
    name: 'Technology & Software',
    description: 'Technology logos emphasize innovation, reliability, and forward-thinking. They often use clean, modern designs with blue and gray color schemes.',
    subcategories: [
      { id: 'electronics-gadgets', name: 'Electronics & Gadgets' },
      { id: 'apps-saas', name: 'Apps & SaaS' },
      { id: 'artificial-intelligence', name: 'Artificial Intelligence' },
      { id: 'it-services', name: 'IT Services' },
      { id: 'cybersecurity', name: 'Cybersecurity' }
    ]
  },
  {
    id: 'finance-insurance',
    name: 'Finance & Insurance',
    description: 'Financial logos emphasize trust, stability, and professionalism. They use conservative colors like blue and incorporate symbols of security and growth.',
    subcategories: [
      { id: 'banks', name: 'Banks' },
      { id: 'fintech', name: 'Fintech' },
      { id: 'investments', name: 'Investments' },
      { id: 'insurance', name: 'Insurance' },
      { id: 'accounting-tax', name: 'Accounting & Tax' }
    ]
  },
  {
    id: 'health-pharma',
    name: 'Health & Pharma',
    description: 'Healthcare logos convey trust, professionalism, and care. They often use medical symbols and calming colors like blue and green.',
    subcategories: [
      { id: 'hospitals-clinics', name: 'Hospitals & Clinics' },
      { id: 'medical-equipment', name: 'Medical Equipment' },
      { id: 'wellness-fitness', name: 'Wellness & Fitness Centers' },
      { id: 'pharmaceuticals', name: 'Pharmaceuticals' },
      { id: 'biotechnology', name: 'Biotechnology' }
    ]
  },
  {
    id: 'education-training',
    name: 'Education & Training',
    description: 'Education logos convey knowledge, growth, and trust. They often use academic colors like blue and incorporate symbols of learning and achievement.',
    subcategories: [
      { id: 'schools-universities', name: 'Schools & Universities' },
      { id: 'online-courses', name: 'Online Courses' },
      { id: 'tutoring-coaching', name: 'Tutoring & Coaching' },
      { id: 'research-science', name: 'Research & Science' },
      { id: 'libraries', name: 'Libraries' }
    ]
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    description: 'Sports and fitness logos embody energy, strength, and motivation. They use dynamic colors and bold typography to inspire action and healthy living.',
    subcategories: [
      { id: 'sports-teams', name: 'Sports Teams & Clubs' },
      { id: 'gyms-fitness', name: 'Gyms & Fitness Centers' },
      { id: 'outdoor-adventure', name: 'Outdoor & Adventure' },
      { id: 'sporting-goods', name: 'Sporting Goods' },
      { id: 'yoga-wellness', name: 'Yoga & Wellness' }
    ]
  },
  {
    id: 'travel-hospitality',
    name: 'Travel & Hospitality',
    description: 'Travel and hospitality logos convey luxury, comfort, and adventure. They often use elegant typography and colors that suggest relaxation and premium service.',
    subcategories: [
      { id: 'airlines', name: 'Airlines' },
      { id: 'hotels-resorts', name: 'Hotels & Resorts' },
      { id: 'travel-agencies', name: 'Travel Agencies' },
      { id: 'tourism-tours', name: 'Tourism & Tours' },
      { id: 'transportation', name: 'Transportation Services' }
    ]
  },
  {
    id: 'automotive-transport',
    name: 'Automotive & Transport',
    description: 'Automotive logos emphasize speed, reliability, and innovation. They often feature bold typography, dynamic shapes, and colors that convey power and trust.',
    subcategories: [
      { id: 'car-brands', name: 'Car Brands' },
      { id: 'motorcycles', name: 'Motorcycles' },
      { id: 'car-rentals', name: 'Car Rentals' },
      { id: 'logistics-delivery', name: 'Logistics & Delivery' },
      { id: 'public-transport', name: 'Public Transport' }
    ]
  },
  {
    id: 'media-entertainment',
    name: 'Media & Entertainment',
    description: 'Media and entertainment logos focus on creativity, visual appeal, and excitement. They use dynamic designs that capture attention and convey entertainment value.',
    subcategories: [
      { id: 'tv-film', name: 'TV & Film' },
      { id: 'music-bands', name: 'Music & Bands' },
      { id: 'gaming-esports', name: 'Gaming & Esports' },
      { id: 'publishing-magazines', name: 'Publishing & Magazines' },
      { id: 'events-festivals', name: 'Events & Festivals' }
    ]
  },
  {
    id: 'retail-ecommerce',
    name: 'Retail & E-Commerce',
    description: 'Retail and e-commerce logos focus on trust, convenience, and accessibility. They use friendly, approachable designs that convey reliability and ease of shopping.',
    subcategories: [
      { id: 'online-shops', name: 'Online Shops' },
      { id: 'supermarkets-grocery', name: 'Supermarkets & Grocery' },
      { id: 'boutiques-specialty', name: 'Boutiques & Specialty Stores' },
      { id: 'shopping-malls', name: 'Shopping Malls' },
      { id: 'marketplaces', name: 'Marketplaces' }
    ]
  },
  {
    id: 'energy-industrial',
    name: 'Energy & Industrial',
    description: 'Energy and industrial logos emphasize power, sustainability, and reliability. They often use strong colors and symbols that represent energy sources and engineering excellence.',
    subcategories: [
      { id: 'oil-gas', name: 'Oil & Gas' },
      { id: 'renewable-energy', name: 'Renewable Energy' },
      { id: 'construction-realestate', name: 'Construction & Real Estate' },
      { id: 'factories-manufacturing', name: 'Factories & Manufacturing' },
      { id: 'utilities', name: 'Utilities' }
    ]
  },
  {
    id: 'pets-animals',
    name: 'Pets & Animals',
    description: 'Pet and animal logos use friendly, approachable designs with warm colors that appeal to pet owners and animal lovers.',
    subcategories: [
      { id: 'pet-food', name: 'Pet Food' },
      { id: 'pet-grooming', name: 'Pet Grooming' },
      { id: 'veterinary-clinics', name: 'Veterinary Clinics' },
      { id: 'animal-shelters', name: 'Animal Shelters' },
      { id: 'pet-accessories', name: 'Pet Accessories' }
    ]
  },
  {
    id: 'organizations-nonprofits',
    name: 'Organizations & Nonprofits',
    description: 'Nonprofit and organization logos convey trust, mission, and community impact. They often use meaningful symbols and colors that reflect their cause.',
    subcategories: [
      { id: 'ngos', name: 'NGOs' },
      { id: 'associations', name: 'Associations' },
      { id: 'charities', name: 'Charities' },
      { id: 'religious-organizations', name: 'Religious Organizations' },
      { id: 'government', name: 'Government' }
    ]
  },
  {
    id: 'social-media-internet',
    name: 'Social Media & Internet',
    description: 'Social media and internet logos emphasize connectivity, community, and digital interaction. They use modern, digital-inspired designs with vibrant colors.',
    subcategories: [
      { id: 'social-networks', name: 'Social Networks' },
      { id: 'online-communities', name: 'Online Communities' },
      { id: 'blogs-forums', name: 'Blogs & Forums' },
      { id: 'influencers', name: 'Influencers' },
      { id: 'communication-platforms', name: 'Communication Platforms' }
    ]
  },
  {
    id: 'other-businesses',
    name: 'Other Businesses',
    description: 'Miscellaneous business categories and unique ventures that showcase diverse design approaches across various sectors.',
    subcategories: [
      { id: 'miscellaneous', name: 'Miscellaneous categories' },
      { id: 'startups-small', name: 'Startups & Small Businesses' }
    ]
  }
];

/**
 * Get all industry categories as a flat list for backwards compatibility
 */
export function getIndustryCategoryList(): string[] {
  return INDUSTRY_CATEGORIES.map(category => category.name);
}

/**
 * Get all subcategories as a flat list
 */
export function getAllSubcategories(): string[] {
  return INDUSTRY_CATEGORIES.flatMap(category => 
    category.subcategories.map(sub => sub.name)
  );
}

/**
 * Find category by name
 */
export function findCategoryByName(name: string): IndustryCategory | undefined {
  return INDUSTRY_CATEGORIES.find(cat => cat.name === name);
}

/**
 * Find subcategory by name across all categories
 */
export function findSubcategoryByName(name: string): { category: IndustryCategory; subcategory: IndustrySubcategory } | undefined {
  for (const category of INDUSTRY_CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.name === name);
    if (subcategory) {
      return { category, subcategory };
    }
  }
  return undefined;
}

/**
 * Get subcategories for a specific industry category
 */
export function getSubcategoriesForIndustry(industryName: string): IndustrySubcategory[] {
  const category = INDUSTRY_CATEGORIES.find(cat => cat.name === industryName);
  return category ? category.subcategories : [];
}

/**
 * Get category and subcategory options for form selects
 */
export function getCategorySelectOptions(): Array<{ value: string; label: string; subcategories?: Array<{ value: string; label: string }> }> {
  return INDUSTRY_CATEGORIES.map(category => ({
    value: category.name,
    label: category.name,
    subcategories: category.subcategories.map(sub => ({
      value: sub.name,
      label: sub.name
    }))
  }));
}