import React from 'react';
import { useLogos } from '../hooks/useLogos-safe';

export const LogoCountDisplay: React.FC = () => {
  const { totalLogos, currentPage, hasMore, pageSize, logos } = useLogos();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900">Logo Collection Status</h3>
          <p className="text-sm text-blue-700">
            Showing <strong>{logos.length}</strong> of <strong>{totalLogos}</strong> total logos
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Page {currentPage} • {hasMore ? 'More pages available' : 'Last page'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{totalLogos}</div>
          <div className="text-xs text-blue-500">Total Logos</div>
        </div>
      </div>
      
      {totalLogos > 1000 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> Your collection has {totalLogos} logos, but only {pageSize} are loaded per page. 
            Use pagination controls to view all logos.
          </p>
        </div>
      )}
    </div>
  );
}; 