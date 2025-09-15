import React from 'react';
import type { LoaderProps } from '../../types/flipbook';

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center">{message}</p>
    </div>
  );
};

export default Loader; 