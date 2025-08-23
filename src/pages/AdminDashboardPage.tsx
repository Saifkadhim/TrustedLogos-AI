import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Palette, 
  Type, 
  LogOut, 
  Bug, 
  BookOpen, 
  Upload, 
  Settings, 
  BarChart3, 
  Users, 
  Eye,
  Star,
  TrendingUp,
  Activity,
  Zap,
  HandMetal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useLogos } from '../hooks/useLogos-safe';
import { useBooks } from '../hooks/useBooks';
import { useColorPalettes } from '../hooks/useColorPalettes';
import { useFonts } from '../hooks/useFonts';
import { useAIVisibility } from '../hooks/useAIVisibility';
import { runAllDebugTests } from '../utils/debugSupabase';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { currentUsername, signOut, ownerVerified } = useAdminAuth();
  const { logos } = useLogos();
  const { books } = useBooks();
  const { palettes } = useColorPalettes();
  const { fonts } = useFonts();
  const { isAIVisible, toggleAIVisibility } = useAIVisibility();

  // Main admin tools organized by category
  const contentManagementTools = [
    { 
      title: 'Add Logo', 
      description: 'Upload and manage brand logos', 
      icon: Plus, 
      to: '/admin/add-logo', 
      color: 'from-blue-500 to-indigo-600',
      stats: `${logos?.length || 0} logos`
    },
    { 
      title: 'Bulk Upload', 
      description: 'Upload multiple logos at once', 
      icon: Upload, 
      to: '/admin/bulk-upload', 
      color: 'from-green-500 to-emerald-600',
      stats: 'Batch operations'
    },
    { 
      title: 'Manage Books', 
      description: 'Curate learning resources', 
      icon: BookOpen, 
      to: '/admin/books', 
      color: 'from-purple-500 to-fuchsia-600',
      stats: `${books?.length || 0} books`
    }
  ];

  const designTools = [
    { 
      title: 'Color Palettes', 
      description: 'Create and organize color schemes', 
      icon: Palette, 
      to: '/admin/color-palettes', 
      color: 'from-pink-500 to-rose-600',
      stats: `${palettes?.length || 0} palettes`
    },
    { 
      title: 'Font Collections', 
      description: 'Manage typography resources', 
      icon: Type, 
      to: '/admin/fonts', 
      color: 'from-amber-500 to-orange-600',
      stats: `${fonts?.length || 0} fonts`
    }
  ];

  const handleSignOut = () => {
    signOut();
    window.location.href = '/console-setup';
  };

  // Calculate statistics
  const stats = {
    totalLogos: logos?.length || 0,
    totalBooks: books?.length || 0,
    publishedBooks: books?.filter(book => book.is_published).length || 0,
    featuredBooks: books?.filter(book => book.is_featured).length || 0,
    totalPalettes: palettes?.length || 0,
    totalFonts: fonts?.length || 0,
    totalViews: logos?.reduce((sum, logo) => sum + (logo.downloads || 0), 0) || 0,
    totalLikes: logos?.reduce((sum, logo) => sum + (logo.likes || 0), 0) || 0
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Centralized control panel for TrustedLogos platform</p>
        </div>
        
        <div className="flex items-center gap-4">
          {ownerVerified && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-medium">
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

      {/* Quick Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <HandMetal className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalLogos}</p>
          <p className="text-xs text-gray-500">Total Logos</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <BookOpen className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
          <p className="text-xs text-gray-500">Total Books</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Palette className="h-4 w-4 text-pink-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalPalettes}</p>
          <p className="text-xs text-gray-500">Color Palettes</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Type className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalFonts}</p>
          <p className="text-xs text-gray-500">Font Collections</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
          <p className="text-xs text-gray-500">Total Downloads</p>
        </div>
        
        <div className="bg-white rounded-lg border p-4 text-center">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Star className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
          <p className="text-xs text-gray-500">Total Likes</p>
        </div>
      </div>

      {/* Content Management Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Content Management
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {contentManagementTools.map((tool) => (
            <Link key={tool.title} to={tool.to} className="group block">
              <div className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105`}>
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${tool.color}`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white border shadow-sm">
                      <tool.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {tool.stats}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Design Tools Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Design Tools
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {designTools.map((tool) => (
            <Link key={tool.title} to={tool.to} className="group block">
              <div className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105`}>
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${tool.color}`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white border shadow-sm">
                      <tool.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {tool.stats}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/add-logo" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center"
          >
            <Plus className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Add Logo</p>
          </Link>
          
          <Link 
            to="/admin/bulk-upload" 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-center"
          >
            <Upload className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Bulk Upload</p>
          </Link>
          
          <Link 
            to="/admin/books" 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center"
          >
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Add Book</p>
          </Link>
          
          <button
            onClick={() => runAllDebugTests()}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-center"
          >
            <Bug className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Debug DB</p>
          </button>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Platform Overview
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <HandMetal className="h-5 w-5 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalLogos}</p>
            <p className="text-sm text-blue-700">Logo Collection</p>
            <p className="text-xs text-blue-600 mt-1">{stats.totalViews} downloads</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <Star className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.publishedBooks}</p>
            <p className="text-sm text-purple-700">Published Books</p>
            <p className="text-xs text-purple-600 mt-1">{stats.featuredBooks} featured</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pink-500 rounded-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <Activity className="h-4 w-4 text-pink-600" />
            </div>
            <p className="text-2xl font-bold text-pink-900">{stats.totalPalettes}</p>
            <p className="text-sm text-pink-700">Color Palettes</p>
            <p className="text-xs text-pink-600 mt-1">Design resources</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Type className="h-5 w-5 text-white" />
              </div>
              <Eye className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-900">{stats.totalFonts}</p>
            <p className="text-sm text-amber-700">Font Collections</p>
            <p className="text-xs text-amber-600 mt-1">Typography assets</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg border p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Logo management system</p>
                  <p className="text-xs text-gray-500">Content management active</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">Active</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Books learning system</p>
                  <p className="text-xs text-gray-500">Educational resources ready</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">Ready</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Platform operational</p>
                  <p className="text-xs text-gray-500">All systems running smoothly</p>
                </div>
              </div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Controls */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Platform Controls
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Tools Visibility Control */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Tools Section</h3>
                  <p className="text-sm text-gray-600">Control visibility of AI tools in sidebar</p>
                </div>
              </div>
              <button
                onClick={toggleAIVisibility}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  isAIVisible ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    isAIVisible ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Status: {isAIVisible ? 'Visible to Public' : 'Hidden (Development Mode)'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isAIVisible 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isAIVisible ? 'Public' : 'Private'}
              </span>
            </div>
          </div>

          {/* Future Controls Placeholder */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-dashed border-gray-300 p-6 flex items-center justify-center">
            <div className="text-center">
              <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">More Controls</p>
              <p className="text-xs text-gray-400">Additional platform controls will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-700">Database Connected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-700">Storage Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-700">Admin Access Active</span>
          </div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${isAIVisible ? 'bg-purple-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-gray-700">AI Tools {isAIVisible ? 'Public' : 'Private'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;