import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, Heart, Download, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-white text-sm font-semibold ${
              user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
            }`}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
          <div className="text-xs text-gray-500 flex items-center">
            {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
            {user.role === 'admin' ? 'Administrator' : 'User'}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white font-semibold ${
                      user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.fullName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  {user.company && (
                    <div className="text-xs text-gray-400">{user.company}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <User className="h-4 w-4 mr-3" />
                Profile Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Heart className="h-4 w-4 mr-3" />
                My Favorites
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Download className="h-4 w-4 mr-3" />
                Downloads
              </button>
              
              {user.role === 'admin' && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Admin Tools
                    </div>
                    <button className="w-full px-0 py-1 text-left text-sm text-purple-700 hover:text-purple-800 flex items-center">
                      <Shield className="h-4 w-4 mr-3" />
                      Admin Dashboard
                    </button>
                  </div>
                </>
              )}
              
              <div className="border-t border-gray-200 my-2"></div>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;