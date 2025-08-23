import React, { useState } from 'react';
import { Sparkles, Loader, Copy, RefreshCw } from 'lucide-react';

interface AIDescriptionHelperProps {
  logoName: string;
  logoType: string;
  industry: string;
  shape: string;
  onDescriptionGenerated: (description: string) => void;
  currentDescription?: string;
}

const AIDescriptionHelper: React.FC<AIDescriptionHelperProps> = ({
  logoName,
  logoType,
  industry,
  shape,
  onDescriptionGenerated,
  currentDescription = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // AI-powered description templates and generation logic
  const generateDescription = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation with intelligent templates
      const suggestions = generateSmartDescriptions(logoName, logoType, industry, shape);
      setGeneratedSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error generating description:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSmartDescriptions = (name: string, type: string, industry: string, shape: string): string[] => {
    const suggestions: string[] = [];
    
    // Template 1: Brand Identity Focus
    suggestions.push(
      `${name} logo represents ${industry.toLowerCase()} excellence through its ${type.toLowerCase()} design. ` +
      `The ${shape.toLowerCase()} shape conveys ${getShapePersonality(shape)}, making it instantly recognizable ` +
      `and memorable for customers. This logo effectively communicates the brand's professional values and ` +
      `commitment to quality in the ${industry.toLowerCase()} sector.`
    );

    // Template 2: Design Elements Focus
    suggestions.push(
      `A ${type.toLowerCase()} logo design for ${name}, featuring a ${shape.toLowerCase()} layout that ` +
      `perfectly captures the essence of ${industry.toLowerCase()}. The design elements work harmoniously ` +
      `to create a strong visual identity that stands out in the competitive ${industry.toLowerCase()} market. ` +
      `${getTypeDescription(type)} makes this logo both versatile and impactful across various applications.`
    );

    // Template 3: Industry-Specific Focus
    suggestions.push(
      `${name}'s logo is specifically crafted for the ${industry.toLowerCase()} industry, utilizing ` +
      `${type.toLowerCase()} principles to establish trust and recognition. The ${shape.toLowerCase()} form ` +
      `factor ${getIndustryRelevance(industry, shape)} This design choice ensures maximum impact ` +
      `whether displayed on digital platforms, business cards, or corporate signage.`
    );

    // Template 4: Brief & Professional
    suggestions.push(
      `Professional ${type.toLowerCase()} logo for ${name}. The ${shape.toLowerCase()} design reflects ` +
      `modern ${industry.toLowerCase()} standards while maintaining timeless appeal. Optimized for ` +
      `brand recognition and versatility across all media formats.`
    );

    return suggestions;
  };

  const getShapePersonality = (shape: string): string => {
    const personalities: { [key: string]: string } = {
      'Circular': 'unity, wholeness, and community',
      'Square': 'stability, trust, and reliability',
      'Rectangular': 'structure, professionalism, and order',
      'Triangular': 'innovation, direction, and progress',
      'Organic': 'creativity, nature, and flexibility',
      'Geometric': 'precision, modernity, and clarity',
      'Script': 'elegance, personality, and craftsmanship',
      'Other': 'uniqueness and distinctive character'
    };
    return personalities[shape] || 'distinctive character and visual appeal';
  };

  const getTypeDescription = (type: string): string => {
    const descriptions: { [key: string]: string } = {
      'Wordmarks': 'The typography-focused approach',
      'Lettermarks': 'The abbreviated letter design',
      'Pictorial Marks': 'The iconic visual representation',
      'Abstract Marks': 'The conceptual symbolic design',
      'Combination Marks': 'The balanced text and symbol integration',
      'Emblem Logos': 'The traditional badge-style format',
      'Mascot Logos': 'The character-driven brand personality'
    };
    return descriptions[type] || 'The strategic design approach';
  };

  const getIndustryRelevance = (industry: string, shape: string): string => {
    const relevance: { [key: string]: { [key: string]: string } } = {
      'Technology & Software': {
        'Circular': 'suggests innovation cycles and global connectivity.',
        'Square': 'represents digital precision and systematic thinking.',
        'Geometric': 'embodies technical excellence and modern solutions.'
      },
      'Healthcare & Medical': {
        'Circular': 'symbolizes care, wholeness, and healing.',
        'Square': 'conveys trust, safety, and medical precision.',
        'Organic': 'represents natural healing and human-centered care.'
      },
      'Finance & Banking': {
        'Square': 'projects stability, security, and institutional trust.',
        'Rectangular': 'suggests structure, growth, and financial planning.',
        'Geometric': 'communicates precision and analytical expertise.'
      }
    };
    
    return relevance[industry]?.[shape] || 'aligns perfectly with industry expectations.';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onDescriptionGenerated(text);
  };

  const enhanceCurrentDescription = () => {
    if (!currentDescription.trim()) {
      generateDescription();
      return;
    }

    // Generate enhanced version of current description
    const enhanced = `${currentDescription.trim()} This ${logoType.toLowerCase()} design ` +
      `leverages ${shape.toLowerCase()} geometry to strengthen brand recognition in the ` +
      `${industry.toLowerCase()} sector, ensuring consistent visual communication across all touchpoints.`;
    
    onDescriptionGenerated(enhanced);
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={generateDescription}
          disabled={isGenerating || !logoName || !logoType || !industry}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isGenerating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? 'Generating...' : 'AI Generate'}
        </button>

        {currentDescription && (
          <button
            type="button"
            onClick={enhanceCurrentDescription}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Enhance
          </button>
        )}
      </div>

      {!logoName || !logoType || !industry ? (
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
          💡 Fill in Logo Name, Type, and Industry first to generate AI descriptions
        </p>
      ) : null}

      {showSuggestions && generatedSuggestions.length > 0 && (
        <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI Generated Suggestions
            </h4>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {generatedSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-purple-100">
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                  {suggestion}
                </p>
                <button
                  onClick={() => copyToClipboard(suggestion)}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
                >
                  <Copy className="h-3 w-3" />
                  Use This Description
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-purple-100">
            <p className="text-xs text-gray-600">
              💡 <strong>Pro tip:</strong> You can edit any of these suggestions after copying them to the description field.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDescriptionHelper;