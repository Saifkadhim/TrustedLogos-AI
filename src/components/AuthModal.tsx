import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, CheckCircle, Chrome, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signInWithGoogle, signInWithTempCredentials } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Email and password are required' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await signIn(formData.email, formData.password);
      setMessage({ type: 'success', text: 'Successfully logged in!' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message });
      setIsLoading(false);
    }
  };

  const handleTempLogin = async (role: 'admin' | 'user') => {
    setIsLoading(true);
    setMessage(null);
    try {
      await signInWithTempCredentials(role);
      setMessage({ type: 'success', text: role === 'admin' ? 'Logged in as temporary admin' : 'Logged in as temporary user' });
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      setMessage({ type: 'error', text: 'Temporary login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Login</h2>
              <p className="text-gray-600 mt-1">Access your TrustedLogos account</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <span className="text-sm">Hide</span> : <span className="text-sm">Show</span>}
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm flex items-center ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.type === 'error' ? <AlertCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Or */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-500 uppercase">Or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Temporary login buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => handleTempLogin('admin')}
              className="w-full inline-flex items-center justify-center px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
            >
              <Shield className="h-4 w-4 mr-2 text-purple-600" />
              Temp Admin
            </button>
            <button
              onClick={() => handleTempLogin('user')}
              className="w-full inline-flex items-center justify-center px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
            >
              <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
              Temp User
            </button>
          </div>
          <div className="text-xs text-gray-500 mb-4">Temporary accounts are for demo only and are not persisted.</div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            <Chrome className="h-5 w-5 mr-2 text-blue-500" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;