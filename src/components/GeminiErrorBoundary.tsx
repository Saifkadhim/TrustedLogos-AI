import React, { Component, ReactNode } from 'react';
import { isGeminiConfigured } from '../services/geminiService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GeminiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Only catch Gemini API key errors
    if (error.message.includes('Gemini API key is not configured')) {
      return { hasError: true, error };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GeminiErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for Gemini API errors
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                AI Service Temporarily Unavailable
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The Gemini AI service is currently unavailable due to configuration issues.
                  {!isGeminiConfigured() && (
                    <span className="block mt-1">
                      <strong>Issue:</strong> API key not configured in production environment.
                    </span>
                  )}
                </p>
                <p className="mt-2">
                  Please contact your administrator or check the diagnostic information in the admin dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 