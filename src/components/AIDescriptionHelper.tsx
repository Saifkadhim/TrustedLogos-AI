import React, { useState } from 'react';
import { Sparkles, Loader, Copy, RefreshCw, AlertCircle, Search, Plus } from 'lucide-react';
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
  const [apiStatus, setApiStatus] = useState<'unknown' | 'working' | 'failed'>('unknown');
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [showCustomSearch, setShowCustomSearch] = useState(false);

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

  const appendToDescription = (text: string) => {
    const newDescription = currentDescription ? 
      `${currentDescription}\n\n${text}` : 
      text;
    onDescriptionGenerated(newDescription);
  };

  const generateCustomDescription = async () => {
    if (!customSearchQuery.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const request: LogoDescriptionRequest = {
        logoName,
        logoType,
        industry,
        shape,
        currentDescription,
        customQuery: customSearchQuery
      };

      const suggestions = await geminiService.generateLogoDescription(request);
      setGeneratedSuggestions(suggestions);
      setShowSuggestions(true);
      setCustomSearchQuery('');
    } catch (error) {
      console.error('Error generating custom description:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate descriptions');
    } finally {
      setIsGenerating(false);
    }
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

  const testApiConnection = async () => {
    try {
      setError(null);
      const isWorking = await geminiService.testConnection();
      setApiStatus(isWorking ? 'working' : 'failed');
      if (!isWorking) {
        setError('API connection test failed');
      }
    } catch (error) {
      setApiStatus('failed');
      setError(error instanceof Error ? error.message : 'API test failed');
    }
  };

  return (
    <div className="mt-2">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Research & Description Tools
          </h4>
          <button
            type="button"
            onClick={testApiConnection}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-all duration-200"
          >
            Test API ({apiStatus})
          </button>
        </div>
        
        <div className="space-y-2">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
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
              {isGenerating ? 'Researching...' : 'Auto Research Company'}
            </button>

            {currentDescription && (
              <button
                type="button"
                onClick={enhanceCurrentDescription}
                disabled={isGenerating}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
                Enhance Existing
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowCustomSearch(!showCustomSearch)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              Custom Search
            </button>
          </div>

          {/* Custom Search Input */}
          {showCustomSearch && (
            <div className="bg-white p-3 rounded-lg border border-orange-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom AI Search Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSearchQuery}
                  onChange={(e) => setCustomSearchQuery(e.target.value)}
                  placeholder="e.g., 'Find specific details about company history' or 'Analyze logo symbolism'"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && generateCustomDescription()}
                />
                <button
                  type="button"
                  onClick={generateCustomDescription}
                  disabled={isGenerating || !customSearchQuery.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all duration-200"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                💡 Tip: Be specific about what you want to research or add to the description
              </p>
            </div>
          )}
        </div>
      </div>

      {!logoName || !logoType || !industry ? (
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
          💡 Fill in Company Name, Logo Type, and Industry first to research company info and analyze logo
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
              Company Research & Logo Analysis
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
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {suggestion}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyToClipboard(suggestion)}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium bg-purple-50 px-2 py-1 rounded"
                  >
                    <Copy className="h-3 w-3" />
                    Replace Description
                  </button>
                  {currentDescription && (
                    <button
                      onClick={() => appendToDescription(suggestion)}
                      className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium bg-green-50 px-2 py-1 rounded"
                    >
                      <Plus className="h-3 w-3" />
                      Add to Existing
                    </button>
                  )}
                </div>
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