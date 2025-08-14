import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { checkDatabaseConnection } from '../lib/database-check';

interface DatabaseStatusProps {
  onClose?: () => void;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ onClose }) => {
  const [status, setStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkDatabaseConnection();
      setStatus(result);
    } catch (error) {
      setStatus({
        connected: false,
        error: 'Failed to run database check',
        details: error
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Database Connection Status</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={runCheck}
                disabled={isChecking}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
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

          {/* Status Content */}
          {isChecking ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Checking database connection...</p>
            </div>
          ) : status ? (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className={`p-4 rounded-lg border-2 ${
                status.connected 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center mb-2">
                  {status.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-semibold ${
                    status.connected ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {status.connected ? 'Database Connected' : 'Database Connection Failed'}
                  </span>
                </div>
                {status.error && (
                  <p className="text-sm text-red-700 mt-2">
                    Error: {status.error}
                  </p>
                )}
              </div>

              {/* Environment Variables */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Environment Configuration
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_URL:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      import.meta.env.VITE_SUPABASE_URL 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_ANON_KEY:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      import.meta.env.VITE_SUPABASE_ANON_KEY 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
                    </span>
                  </div>
                  {import.meta.env.VITE_SUPABASE_URL && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <span className="text-xs text-gray-500">URL: </span>
                      <span className="text-xs font-mono">{import.meta.env.VITE_SUPABASE_URL}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Database Details */}
              {status.connected && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Database Details</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center justify-between">
                      <span>Profiles Table:</span>
                      <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                        {status.profilesCount !== null ? 'Accessible' : 'Not accessible'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Authentication:</span>
                      <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                        {status.authStatus === 'authenticated' ? 'Signed In' : 'Not Signed In'}
                      </span>
                    </div>
                    {status.user && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <span className="text-xs text-gray-500">Current User: </span>
                        <span className="text-xs">{status.user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Setup Instructions */}
              {!status.connected && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Setup Required
                  </h3>
                  <div className="text-sm text-yellow-800 space-y-2">
                    <p>To connect to Supabase, you need to:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">supabase.com</a></li>
                      <li>Copy your project URL and anon key from the API settings</li>
                      <li>Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in your project root</li>
                      <li>Add your credentials:
                        <pre className="bg-yellow-100 p-2 rounded mt-1 text-xs">
{`VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key`}
                        </pre>
                      </li>
                      <li>Run the database migration from the <code className="bg-yellow-100 px-1 rounded">supabase/migrations/</code> folder</li>
                      <li>Restart your development server</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Click "Refresh" to check database status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;