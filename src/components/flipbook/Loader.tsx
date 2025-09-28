import React from 'react';

interface LoaderProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  message = 'Loading...', 
  progress = 0,
  showProgress = false 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        {showProgress && progress > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{message}</p>
      
      {showProgress && (
        <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      )}
      
      {showProgress && progress > 0 && progress < 100 && (
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {progress < 50 ? 'Downloading PDF...' : 
           progress < 75 ? 'Processing document...' : 
           'Almost ready...'}
        </p>
      )}
    </div>
  );
};

export default Loader; 