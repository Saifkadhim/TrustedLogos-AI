import React from 'react';
import { Plus, Palette, Type, LogOut, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { runAllDebugTests } from '../utils/debugSupabase';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentUsername, signOut, ownerVerified } = useAdminAuth();

  const adminTools = [
    { title: 'Add Logos', description: 'Create and manage brand logos', icon: Plus, to: '/admin/add-logo', color: 'from-blue-500 to-indigo-600' },
    { title: 'Manage Color Palettes', description: 'Create, edit, and organize palettes', icon: Palette, to: '/admin/color-palettes', color: 'from-emerald-500 to-teal-600' },
    { title: 'Manage Fonts', description: 'Add and curate fonts library', icon: Type, to: '/admin/fonts', color: 'from-purple-500 to-fuchsia-600' }
  ];

  const handleSignOut = () => {
    signOut();
    window.location.href = '/console-setup';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage content and settings for TrustedLogos</p>
        </div>
        
        <div className="flex items-center gap-4">
          {ownerVerified && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
              Owner Access
            </span>
          )}
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{currentUsername}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          
          <button
            onClick={() => runAllDebugTests()}
            className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:text-orange-800 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Bug className="w-4 h-4" />
            Debug DB
          </button>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Management Tools */}
      <div className="grid md:grid-cols-3 gap-6">
        {adminTools.map((tool) => (
          <Link key={tool.title} to={tool.to} className="group block">
            <div className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105`}>
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${tool.color}`} />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white border shadow-sm">
                    <tool.icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Logos</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Palette className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Color Palettes</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Type className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Font Collections</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;