import React, { useState, useEffect } from 'react';
import { Bug, Database, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DiagnosticInfoProps {
  onClose?: () => void;
}

const DiagnosticInfo: React.FC<DiagnosticInfoProps> = ({ onClose }) => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runDiagnostics = async () => {
    setIsChecking(true);
    try {
      const results = await performDiagnostics();
      setDiagnostics(results);
    } catch (error) {
      setDiagnostics({
        error: 'Failed to run diagnostics',
        details: error
      });
    } finally {
      setIsChecking(false);
    }
  };

  const performDiagnostics = async () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      }
    };

    try {
      // Test 1: Basic connection
      console.log('🔍 Testing basic connection...');
      const { data: testData, error: testError } = await supabase
        .from('logos')
        .select('count', { count: 'exact', head: true });
      
      results.basicConnection = {
        success: !testError,
        error: testError?.message,
        data: testData
      };

      // Test 2: Count total logos
      console.log('🔍 Counting total logos...');
      const { count: totalCount, error: countError } = await supabase
        .from('logos')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true);
      
      results.totalCount = {
        success: !countError,
        error: countError?.message,
        count: totalCount
      };

      // Test 3: Fetch with different page sizes
      console.log('🔍 Testing different page sizes...');
      const pageSizeTests = [100, 1000, 2000, 3000];
      results.pageSizeTests = {};

      for (const pageSize of pageSizeTests) {
        try {
          const { data, error } = await supabase
            .from('logos')
            .select('*')
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .range(0, pageSize - 1);

          results.pageSizeTests[pageSize] = {
            success: !error,
            error: error?.message,
            dataLength: data?.length || 0,
            hasData: !!data && data.length > 0
          };
        } catch (err) {
          results.pageSizeTests[pageSize] = {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error',
            dataLength: 0,
            hasData: false
          };
        }
      }

      // Test 4: Check for any RLS policies
      console.log('🔍 Checking RLS status...');
      try {
        const { data: rlsData, error: rlsError } = await supabase
          .rpc('get_rls_status', { table_name: 'logos' });
        
        results.rlsStatus = {
          success: !rlsError,
          error: rlsError?.message,
          data: rlsData
        };
      } catch (err) {
        results.rlsStatus = {
          success: false,
          error: 'RLS check not available',
          data: null
        };
      }

      // Test 5: Check storage bucket
      console.log('🔍 Checking storage bucket...');
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage
          .listBuckets();
        
        results.storageBuckets = {
          success: !bucketError,
          error: bucketError?.message,
          buckets: bucketData?.map(b => b.name) || []
        };
      } catch (err) {
        results.storageBuckets = {
          success: false,
          error: 'Storage check failed',
          buckets: []
        };
      }

      // Test 6: Performance test with large query
      console.log('🔍 Testing large query performance...');
      const startTime = performance.now();
      try {
        const { data: largeData, error: largeError } = await supabase
          .from('logos')
          .select('id, name, type, industry, created_at')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(5000);

        const endTime = performance.now();
        results.largeQueryTest = {
          success: !largeError,
          error: largeError?.message,
          dataLength: largeData?.length || 0,
          executionTime: `${(endTime - startTime).toFixed(2)}ms`,
          hasData: !!largeData && largeData.length > 0
        };
      } catch (err) {
        results.largeQueryTest = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          dataLength: 0,
          executionTime: 'N/A',
          hasData: false
        };
      }

    } catch (error) {
      results.generalError = error instanceof Error ? error.message : 'Unknown error';
    }

    return results;
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bug className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Logo Loading Diagnostics</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={runDiagnostics}
                disabled={isChecking}
                className="flex items-center px-3 py-1 text-sm text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Diagnostics Content */}
          {isChecking ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Running diagnostics...</p>
            </div>
          ) : diagnostics ? (
            <div className="space-y-6">
              {/* Environment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Environment Configuration
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_URL:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      diagnostics.environment?.supabaseUrl 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {diagnostics.environment?.supabaseUrl ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_ANON_KEY:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      diagnostics.environment?.supabaseAnonKey === 'Set'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {diagnostics.environment?.supabaseAnonKey}
                    </span>
                  </div>
                </div>
              </div>

              {/* Basic Connection */}
              <div className={`p-4 rounded-lg border-2 ${
                diagnostics.basicConnection?.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <h3 className="font-semibold mb-2">Basic Connection Test</h3>
                <div className="text-sm">
                  <p><strong>Status:</strong> {diagnostics.basicConnection?.success ? '✅ Success' : '❌ Failed'}</p>
                  {diagnostics.basicConnection?.error && (
                    <p className="text-red-700 mt-1"><strong>Error:</strong> {diagnostics.basicConnection.error}</p>
                  )}
                </div>
              </div>

              {/* Total Count */}
              <div className={`p-4 rounded-lg border-2 ${
                diagnostics.totalCount?.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <h3 className="font-semibold mb-2">Total Logo Count</h3>
                <div className="text-sm">
                  <p><strong>Status:</strong> {diagnostics.totalCount?.success ? '✅ Success' : '❌ Failed'}</p>
                  <p><strong>Total Logos:</strong> {diagnostics.totalCount?.count || 'Unknown'}</p>
                  {diagnostics.totalCount?.error && (
                    <p className="text-red-700 mt-1"><strong>Error:</strong> {diagnostics.totalCount.error}</p>
                  )}
                </div>
              </div>

              {/* Page Size Tests */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Page Size Tests</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(diagnostics.pageSizeTests || {}).map(([pageSize, test]: [string, any]) => (
                    <div key={pageSize} className={`p-3 rounded border ${
                      test.success ? 'border-green-200 bg-green-100' : 'border-red-200 bg-red-100'
                    }`}>
                      <div className="text-center">
                        <div className="font-semibold text-sm">{pageSize}</div>
                        <div className={`text-xs ${test.success ? 'text-green-700' : 'text-red-700'}`}>
                          {test.success ? '✅ Success' : '❌ Failed'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {test.dataLength} logos
                        </div>
                        {test.error && (
                          <div className="text-xs text-red-600 mt-1 truncate" title={test.error}>
                            {test.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Large Query Test */}
              <div className={`p-4 rounded-lg border-2 ${
                diagnostics.largeQueryTest?.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <h3 className="font-semibold mb-2">Large Query Performance Test</h3>
                <div className="text-sm">
                  <p><strong>Status:</strong> {diagnostics.largeQueryTest?.success ? '✅ Success' : '❌ Failed'}</p>
                  <p><strong>Data Retrieved:</strong> {diagnostics.largeQueryTest?.dataLength || 0} logos</p>
                  <p><strong>Execution Time:</strong> {diagnostics.largeQueryTest?.executionTime || 'N/A'}</p>
                  {diagnostics.largeQueryTest?.error && (
                    <p className="text-red-700 mt-1"><strong>Error:</strong> {diagnostics.largeQueryTest.error}</p>
                  )}
                </div>
              </div>

              {/* Storage Buckets */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3">Storage Buckets</h3>
                <div className="text-sm">
                  <p><strong>Status:</strong> {diagnostics.storageBuckets?.success ? '✅ Success' : '❌ Failed'}</p>
                  <p><strong>Available Buckets:</strong> {diagnostics.storageBuckets?.buckets?.join(', ') || 'None'}</p>
                  {diagnostics.storageBuckets?.error && (
                    <p className="text-yellow-700 mt-1"><strong>Error:</strong> {diagnostics.storageBuckets.error}</p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Analysis Summary
                </h3>
                <div className="text-sm text-purple-800 space-y-2">
                  {diagnostics.totalCount?.count && diagnostics.totalCount.count > 1000 && (
                    <p><strong>⚠️ Large Dataset Detected:</strong> Your database contains {diagnostics.totalCount.count} logos, which may require special handling.</p>
                  )}
                  
                  {diagnostics.pageSizeTests && Object.values(diagnostics.pageSizeTests).some((test: any) => !test.success) && (
                    <p><strong>🚨 Page Size Issues:</strong> Some page size tests failed, indicating potential query limitations.</p>
                  )}
                  
                  {diagnostics.largeQueryTest?.success && diagnostics.largeQueryTest.dataLength > 0 && (
                    <p><strong>✅ Large Queries Working:</strong> Successfully retrieved {diagnostics.largeQueryTest.dataLength} logos in {diagnostics.largeQueryTest.executionTime}.</p>
                  )}
                  
                  {diagnostics.totalCount?.count && diagnostics.pageSizeTests && (
                    <p><strong>📊 Recommendation:</strong> 
                      {diagnostics.totalCount.count <= 3000 
                        ? ' Your dataset should fit within the current 3000 logo limit.'
                        : ' Consider implementing server-side pagination for better performance.'
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Raw Data */}
              <details className="bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700">Raw Diagnostic Data</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                  {JSON.stringify(diagnostics, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="text-center py-8">
              <Bug className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Click "Refresh" to run diagnostics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticInfo; 