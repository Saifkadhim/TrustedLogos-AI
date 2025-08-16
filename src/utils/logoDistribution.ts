import { Logo } from '../hooks/useLogos';

/**
 * Distributes logos across different homepage sections based on their properties
 */
export interface DistributedLogos {
  topLogos: Logo[];
  logoTypes: {
    [key: string]: {
      description: string;
      examples: string;
      bestFor: string;
      logos: Logo[];
    };
  };
  industries: {
    [key: string]: {
      description: string;
      logos: Logo[];
    };
  };
}

/**
 * Logo type descriptions and metadata
 */
const LOGO_TYPE_INFO = {
  'Wordmarks': {
    description: 'Wordmarks are text-only logos that focus on the company name using unique typography. They work best for companies with distinctive, memorable names.',
    examples: 'Google, Coca-Cola, FedEx, Visa',
    bestFor: 'Memorable company names'
  },
  'Lettermarks': {
    description: 'Lettermarks use initials or abbreviations as the main logo element. They\'re perfect for companies with long names or well-known acronyms.',
    examples: 'IBM, HBO, CNN, NASA',
    bestFor: 'Companies with long names or known acronyms'
  },
  'Pictorial Marks': {
    description: 'Pictorial marks are icon-based logos that use recognizable imagery. These literal representations help communicate what your company does through visual symbols.',
    examples: 'Apple, Twitter, Target, Shell',
    bestFor: 'Established brands with recognizable symbols'
  },
  'Abstract Marks': {
    description: 'Abstract marks are geometric forms that don\'t represent anything recognizable but convey meaning through color, form, and movement.',
    examples: 'Nike, Pepsi, Adidas, BP',
    bestFor: 'Creating unique, memorable brand symbols'
  },
  'Combination Marks': {
    description: 'Combination marks blend text and imagery together, creating a unified logo that can work as a complete unit or be separated when needed.',
    examples: 'Burger King, Lacoste, Doritos, Taco Bell',
    bestFor: 'Versatile branding needs'
  },
  'Emblem Logos': {
    description: 'Emblem logos consist of text inside a symbol or icon, similar to badges, seals, or crests. They convey tradition and authority.',
    examples: 'Starbucks, BMW, Harley-Davidson, NFL',
    bestFor: 'Traditional, authoritative brands'
  },
  'Mascot Logos': {
    description: 'Mascot logos feature illustrated characters that represent your company. These friendly designs are great for connecting with families.',
    examples: 'KFC, Mailchimp, Pringles, Michelin',
    bestFor: 'Family-friendly brands and sports teams'
  }
};

/**
 * Industry descriptions
 */
const INDUSTRY_INFO = {
  'Automotive': {
    description: 'Automotive logos emphasize speed, reliability, and innovation. They often feature bold typography, dynamic shapes, and colors that convey power and trust.'
  },
  'Fashion': {
    description: 'Fashion logos focus on elegance, style, and brand prestige. They typically use sophisticated typography and minimalist designs to convey luxury and exclusivity.'
  },
  'Food & Drinks': {
    description: 'Food and beverage logos use appetizing colors, friendly typography, and imagery that evokes taste, freshness, and satisfaction.'
  },
  'Restaurant': {
    description: 'Restaurant logos combine appetite appeal with brand personality, using warm colors and inviting designs that make customers hungry and welcome.'
  },
  'Technology': {
    description: 'Technology logos emphasize innovation, reliability, and forward-thinking. They often use clean, modern designs with blue and gray color schemes.'
  },
  'E-commerce': {
    description: 'E-commerce logos focus on trust, convenience, and accessibility. They use friendly, approachable designs that convey reliability and ease of use.'
  },
  'Electronics': {
    description: 'Electronics logos emphasize precision, innovation, and cutting-edge technology. They often feature sleek, minimalist designs with metallic or electric colors.'
  },
  'Industrial': {
    description: 'Industrial logos convey strength, reliability, and engineering excellence. They typically use bold, sturdy designs with colors that suggest durability.'
  },
  'Internet': {
    description: 'Internet and web service logos emphasize connectivity, innovation, and global reach. They often use modern, digital-inspired designs.'
  },
  'Media/TV': {
    description: 'Media and television logos focus on entertainment, creativity, and visual appeal. They use dynamic designs that capture attention and convey excitement.'
  },
  'Sport': {
    description: 'Sports logos emphasize energy, competition, and team spirit. They use bold, dynamic designs with colors that convey strength and movement.'
  },
  'Other': {
    description: 'Miscellaneous logos from various industries that showcase diverse design approaches and creative solutions across different sectors.'
  }
};

/**
 * Distributes logos intelligently across homepage sections
 */
export function distributeLogos(allLogos: Logo[]): DistributedLogos {
  // Sort logos by popularity (downloads + likes) for TOP logos
  const topLogos = [...allLogos]
    .sort((a, b) => (b.downloads + b.likes) - (a.downloads + a.likes))
    .slice(0, 10);

  // Group logos by type
  const logosByType: { [key: string]: Logo[] } = {};
  const logoTypes: DistributedLogos['logoTypes'] = {};

  // Initialize all logo types
  Object.keys(LOGO_TYPE_INFO).forEach(type => {
    logosByType[type] = [];
    logoTypes[type] = {
      ...LOGO_TYPE_INFO[type],
      logos: []
    };
  });

  // Distribute logos by type
  allLogos.forEach(logo => {
    if (logosByType[logo.type]) {
      logosByType[logo.type].push(logo);
    } else {
      // If logo type doesn't match our predefined types, add to "Other"
      if (!logosByType['Other']) {
        logosByType['Other'] = [];
        logoTypes['Other'] = {
          description: 'Various logo types and creative designs that showcase unique approaches to brand identity.',
          examples: 'Custom designs, hybrid styles, experimental concepts',
          bestFor: 'Unique branding approaches',
          logos: []
        };
      }
      logosByType['Other'].push(logo);
    }
  });

  // Assign logos to each type (limit to 8 per type for display)
  Object.keys(logoTypes).forEach(type => {
    logoTypes[type].logos = logosByType[type]
      ?.sort((a, b) => (b.downloads + b.likes) - (a.downloads + a.likes))
      .slice(0, 8) || [];
  });

  // Group logos by industry
  const logosByIndustry: { [key: string]: Logo[] } = {};
  const industries: DistributedLogos['industries'] = {};

  // Initialize all industries
  Object.keys(INDUSTRY_INFO).forEach(industry => {
    logosByIndustry[industry] = [];
    industries[industry] = {
      ...INDUSTRY_INFO[industry],
      logos: []
    };
  });

  // Distribute logos by industry
  allLogos.forEach(logo => {
    if (logosByIndustry[logo.industry]) {
      logosByIndustry[logo.industry].push(logo);
    } else {
      // If industry doesn't match, add to "Other"
      logosByIndustry['Other'].push(logo);
    }
  });

  // Assign logos to each industry (limit to 8 per industry for display)
  Object.keys(industries).forEach(industry => {
    industries[industry].logos = logosByIndustry[industry]
      ?.sort((a, b) => (b.downloads + b.likes) - (a.downloads + a.likes))
      .slice(0, 8) || [];
  });

  return {
    topLogos,
    logoTypes,
    industries
  };
}

/**
 * Get available logo types that have uploaded logos
 */
export function getAvailableLogoTypes(allLogos: Logo[]): string[] {
  const typesWithLogos = new Set<string>();
  
  allLogos.forEach(logo => {
    if (LOGO_TYPE_INFO[logo.type]) {
      typesWithLogos.add(logo.type);
    }
  });

  // Return types in predefined order, but only those with logos
  return Object.keys(LOGO_TYPE_INFO).filter(type => typesWithLogos.has(type));
}

/**
 * Get available industries that have uploaded logos
 */
export function getAvailableIndustries(allLogos: Logo[]): string[] {
  const industriesWithLogos = new Set<string>();
  
  allLogos.forEach(logo => {
    if (INDUSTRY_INFO[logo.industry]) {
      industriesWithLogos.add(logo.industry);
    }
  });

  // Return industries in predefined order, but only those with logos
  return Object.keys(INDUSTRY_INFO).filter(industry => industriesWithLogos.has(industry));
}

/**
 * Get fallback data when no logos are uploaded yet
 */
export function getFallbackData(): DistributedLogos {
  return {
    topLogos: [],
    logoTypes: Object.fromEntries(
      Object.entries(LOGO_TYPE_INFO).map(([type, info]) => [
        type, 
        { ...info, logos: [] }
      ])
    ),
    industries: Object.fromEntries(
      Object.entries(INDUSTRY_INFO).map(([industry, info]) => [
        industry,
        { ...info, logos: [] }
      ])
    )
  };
}