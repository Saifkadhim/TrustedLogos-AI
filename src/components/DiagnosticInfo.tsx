import React from 'react';
import { isGeminiConfigured, getGeminiConfigStatus } from '../services/geminiService';

export const DiagnosticInfo: React.FC = () => {
  const configStatus = getGeminiConfigStatus();
  const isConfigured = isGeminiConfigured();

  return (
    <div className="p-4 bg-gray-100 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Environment Configuration Diagnostic</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Gemini API Key:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConfigured ? 'Configured' : 'Missing'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Environment:</strong> {configStatus.environment}</p>
          <p><strong>Node Env:</strong> {configStatus.nodeEnv}</p>
          <p><strong>API Key Length:</strong> {configStatus.apiKeyLength}</p>
          <p><strong>Service Configured:</strong> {configStatus.isConfigured ? 'Yes' : 'No'}</p>
        </div>
        
        {!isConfigured && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>Issue:</strong> Gemini API key is not configured. This will cause AI features to fail.
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              To fix: Add VITE_GEMINI_API_KEY to your environment variables in your hosting platform.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 