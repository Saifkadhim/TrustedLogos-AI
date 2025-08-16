import React, { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';

const AdminSignInPage: React.FC = () => {
  const { signIn, isAuthenticated, currentUsername, ownerVerified, verifyOwner, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [ownerCode, setOwnerCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    try {
      await signIn(username.trim(), password);
      setMessage('Signed in successfully');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const ok = await verifyOwner(ownerCode);
      setMessage(ok ? 'Owner verified successfully' : 'Invalid owner code');
      if (ok) setOwnerCode('');
    } catch (err) {
      setMessage('Error verifying owner code');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setMessage('Signed out successfully');
    setUsername('');
    setPassword('');
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access Granted</h1>
            <p className="text-gray-600 mt-2">Welcome back, {currentUsername}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/admin')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go to Admin Dashboard
            </button>
            
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          {ownerVerified && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <Shield className="w-4 h-4 inline mr-1" />
                Owner privileges active
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
          <p className="text-gray-600 mt-2">Sign in to manage TrustedLogos</p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg border text-sm ${
            message.includes('successfully') 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Owner Code Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-3">
              <Shield className="w-4 h-4 inline mr-1" />
              Owner Access {ownerVerified ? '(Verified)' : ''}
            </summary>
            
            {!ownerVerified && (
              <form onSubmit={handleVerifyOwner} className="space-y-3">
                <input
                  type="password"
                  value={ownerCode}
                  onChange={(e) => setOwnerCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                  placeholder="Enter owner code"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !ownerCode}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  {loading ? 'Verifying...' : 'Verify Owner'}
                </button>
                <p className="text-xs text-gray-500">
                  Owner code provides additional administrative privileges
                </p>
              </form>
            )}
          </details>
        </div>
      </div>
    </div>
  );
};

export default AdminSignInPage;