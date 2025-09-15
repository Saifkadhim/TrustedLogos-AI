import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { ErrorDisplayProps } from '../../types/flipbook';

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry, 
  retryText = 'Try Again' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <p className="text-lg text-red-600 dark:text-red-400 mb-6 max-w-md">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <RefreshCw className="h-5 w-5" />
        {retryText}
      </button>
    </div>
  );
};

export default ErrorDisplay; 