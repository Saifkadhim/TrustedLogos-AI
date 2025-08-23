import React, { useState } from 'react';
import { Sparkles, Loader, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { geminiService, type LogoDescriptionRequest } from '../services/geminiService';

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
  const [error, setError] = useState<string | null>(null);

  // Real AI-powered description generation using Gemini API
  const generateDescription = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const request: LogoDescriptionRequest = {
        logoName,
        logoType,
        industry,
        shape,
        currentDescription
      };

      const suggestions = await geminiService.generateLogoDescription(request);
      setGeneratedSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error generating description:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate descriptions');
    } finally {
      setIsGenerating(false);
    }
  };



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onDescriptionGenerated(text);
  };

  const enhanceCurrentDescription = async () => {
    if (!currentDescription.trim()) {
      generateDescription();
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const logoInfo: LogoDescriptionRequest = {
        logoName,
        logoType,
        industry,
        shape,
        currentDescription
      };

      const enhanced = await geminiService.enhanceDescription(currentDescription, logoInfo);
      onDescriptionGenerated(enhanced);
    } catch (error) {
      console.error('Error enhancing description:', error);
      setError(error instanceof Error ? error.message : 'Failed to enhance description');
    } finally {
      setIsGenerating(false);
    }
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

      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}

      {showSuggestions && generatedSuggestions.length > 0 && (
        <div className="border border-purple-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Gemini AI Generated Suggestions
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