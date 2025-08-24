/**
 * Color analysis utilities for extracting and analyzing logo color palettes
 */

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  description: string;
  category: string;
  usage: string;
  logos: Array<{
    name: string;
    imageUrl?: string;
    primaryColor: string;
    secondaryColor?: string;
  }>;
  popularity: number;
}

export interface ColorCombination {
  primary: string;
  secondary: string;
  count: number;
  examples: string[];
}

/**
 * Predefined color categories with psychological meanings
 */
export const COLOR_CATEGORIES = {
  'Professional': {
    description: 'Trust, reliability, and corporate strength',
    colors: ['#1E40AF', '#1F2937', '#374151', '#6B7280', '#0F172A'],
    usage: 'Finance, Technology, Healthcare'
  },
  'Creative': {
    description: 'Innovation, creativity, and artistic expression',
    colors: ['#7C3AED', '#EC4899', '#F59E0B', '#EF4444', '#10B981'],
    usage: 'Design, Media, Entertainment'
  },
  'Natural': {
    description: 'Growth, harmony, and environmental consciousness',
    colors: ['#059669', '#16A34A', '#65A30D', '#84CC16', '#22C55E'],
    usage: 'Organic, Wellness, Outdoor'
  },
  'Energetic': {
    description: 'Energy, passion, and dynamic movement',
    colors: ['#DC2626', '#EA580C', '#D97706', '#F59E0B', '#EAB308'],
    usage: 'Sports, Food, Entertainment'
  },
  'Luxury': {
    description: 'Elegance, sophistication, and premium quality',
    colors: ['#000000', '#1F2937', '#92400E', '#B45309', '#A16207'],
    usage: 'Fashion, Jewelry, Premium brands'
  },
  'Friendly': {
    description: 'Approachability, warmth, and accessibility',
    colors: ['#3B82F6', '#06B6D4', '#8B5CF6', '#F472B6', '#FB7185'],
    usage: 'Social, Community, Family'
  }
};

/**
 * Color psychology mappings
 */
export const COLOR_PSYCHOLOGY = {
  '#FF0000': { emotion: 'Energy', traits: ['Bold', 'Passionate', 'Urgent'] },
  '#0000FF': { emotion: 'Trust', traits: ['Professional', 'Calm', 'Stable'] },
  '#00FF00': { emotion: 'Growth', traits: ['Natural', 'Fresh', 'Harmonious'] },
  '#FFD700': { emotion: 'Optimism', traits: ['Happy', 'Cheerful', 'Confident'] },
  '#800080': { emotion: 'Luxury', traits: ['Creative', 'Sophisticated', 'Mysterious'] },
  '#000000': { emotion: 'Power', traits: ['Elegant', 'Formal', 'Authoritative'] },
  '#FFFFFF': { emotion: 'Purity', traits: ['Clean', 'Simple', 'Minimalist'] }
};

/**
 * Extract color combinations from logo database
 */
export function extractColorCombinations(logos: Array<{
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  imageUrl?: string;
}>): ColorCombination[] {
  const combinations = new Map<string, ColorCombination>();

  logos.forEach(logo => {
    if (logo.primaryColor && logo.secondaryColor) {
      const key = `${logo.primaryColor}-${logo.secondaryColor}`;
      
      if (combinations.has(key)) {
        const existing = combinations.get(key)!;
        existing.count++;
        existing.examples.push(logo.name);
      } else {
        combinations.set(key, {
          primary: logo.primaryColor,
          secondary: logo.secondaryColor,
          count: 1,
          examples: [logo.name]
        });
      }
    }
  });

  return Array.from(combinations.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Top 20 combinations
}

/**
 * Generate curated color palettes from existing logos
 */
export function generateCuratedPalettes(logos: Array<{
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  imageUrl?: string;
  industry: string;
}>): ColorPalette[] {
  const palettes: ColorPalette[] = [];

  // 1. Industry-based palettes
  const industryGroups = groupLogosByIndustry(logos);
  
  Object.entries(industryGroups).forEach(([industry, industryLogos]) => {
    if (industryLogos.length >= 3) {
      const colors = extractUniqueColors(industryLogos);
      if (colors.length >= 3) {
        palettes.push({
          id: `industry-${industry.toLowerCase().replace(/\s+/g, '-')}`,
          name: `${industry} Palette`,
          colors: colors.slice(0, 5),
          description: `Color scheme commonly used in ${industry.toLowerCase()} industry`,
          category: 'Industry',
          usage: `Perfect for ${industry.toLowerCase()} brands and related businesses`,
          logos: industryLogos.slice(0, 4),
          popularity: industryLogos.length
        });
      }
    }
  });

  // 2. Popular color combination palettes
  const combinations = extractColorCombinations(logos);
  combinations.slice(0, 6).forEach((combo, index) => {
    const relatedLogos = logos.filter(logo => 
      logo.primaryColor === combo.primary && logo.secondaryColor === combo.secondary
    );

    palettes.push({
      id: `combo-${index}`,
      name: `${getColorName(combo.primary)} & ${getColorName(combo.secondary)}`,
      colors: [combo.primary, combo.secondary],
      description: `Popular combination used by ${combo.count} brands`,
      category: 'Popular Combinations',
      usage: 'Proven color pairing for brand recognition',
      logos: relatedLogos.slice(0, 4),
      popularity: combo.count
    });
  });

  // 3. Monochromatic palettes
  const colorGroups = groupLogosByPrimaryColor(logos);
  Object.entries(colorGroups).forEach(([color, colorLogos]) => {
    if (colorLogos.length >= 5) {
      const variations = generateColorVariations(color);
      
      palettes.push({
        id: `mono-${color.replace('#', '')}`,
        name: `${getColorName(color)} Monochrome`,
        colors: variations,
        description: `Monochromatic palette based on ${getColorName(color)}`,
        category: 'Monochromatic',
        usage: 'Elegant single-color branding approach',
        logos: colorLogos.slice(0, 4),
        popularity: colorLogos.length
      });
    }
  });

  return palettes.sort((a, b) => b.popularity - a.popularity);
}

/**
 * Group logos by industry
 */
function groupLogosByIndustry(logos: Array<{industry: string}>) {
  return logos.reduce((groups, logo) => {
    const industry = logo.industry || 'Other';
    if (!groups[industry]) groups[industry] = [];
    groups[industry].push(logo);
    return groups;
  }, {} as Record<string, any[]>);
}

/**
 * Group logos by primary color
 */
function groupLogosByPrimaryColor(logos: Array<{primaryColor: string}>) {
  return logos.reduce((groups, logo) => {
    const color = logo.primaryColor;
    if (!groups[color]) groups[color] = [];
    groups[color].push(logo);
    return groups;
  }, {} as Record<string, any[]>);
}

/**
 * Extract unique colors from a set of logos
 */
function extractUniqueColors(logos: Array<{primaryColor: string; secondaryColor?: string}>) {
  const colors = new Set<string>();
  
  logos.forEach(logo => {
    colors.add(logo.primaryColor);
    if (logo.secondaryColor) {
      colors.add(logo.secondaryColor);
    }
  });
  
  return Array.from(colors);
}

/**
 * Generate color variations for monochromatic palettes
 */
function generateColorVariations(baseColor: string): string[] {
  // Simple color variation generator
  // In a real app, you'd use a proper color library like chroma.js
  const variations = [baseColor];
  
  // Add some basic variations (this is simplified)
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Lighter versions
  variations.push(rgbToHex(Math.min(255, r + 30), Math.min(255, g + 30), Math.min(255, b + 30)));
  variations.push(rgbToHex(Math.min(255, r + 60), Math.min(255, g + 60), Math.min(255, b + 60)));
  
  // Darker versions
  variations.push(rgbToHex(Math.max(0, r - 30), Math.max(0, g - 30), Math.max(0, b - 30)));
  variations.push(rgbToHex(Math.max(0, r - 60), Math.max(0, g - 60), Math.max(0, b - 60)));
  
  return variations;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Get human-readable color name
 */
function getColorName(hex: string): string {
  const colorNames: Record<string, string> = {
    '#FF0000': 'Red',
    '#00FF00': 'Green',
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#FF00FF': 'Magenta',
    '#00FFFF': 'Cyan',
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#808080': 'Gray',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#FFC0CB': 'Pink',
    '#A52A2A': 'Brown',
    '#008000': 'Green',
    '#000080': 'Navy'
  };
  
  // Find closest match or return hex
  return colorNames[hex.toUpperCase()] || hex;
}

/**
 * Get color accessibility information
 */
export function getColorAccessibility(backgroundColor: string, textColor: string = '#000000'): {
  contrast: number;
  rating: 'AA' | 'AAA' | 'Fail';
  readable: boolean;
} {
  // Simplified contrast calculation
  // In production, use a proper accessibility library
  const bgLum = getLuminance(backgroundColor);
  const textLum = getLuminance(textColor);
  
  const contrast = (Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05);
  
  let rating: 'AA' | 'AAA' | 'Fail';
  if (contrast >= 7) rating = 'AAA';
  else if (contrast >= 4.5) rating = 'AA';
  else rating = 'Fail';
  
  return {
    contrast: Math.round(contrast * 100) / 100,
    rating,
    readable: contrast >= 4.5
  };
}

/**
 * Calculate luminance for accessibility
 */
function getLuminance(hex: string): number {
  const rgb = hex.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  const [r, g, b] = rgb.map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}