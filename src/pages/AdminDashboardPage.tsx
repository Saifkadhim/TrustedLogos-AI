import React from 'react';
import { Plus, Palette, Type, Shield, Users, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const adminTools = [
    {
      title: 'Add Logos',
      description: 'Create and manage brand logos',
      icon: Plus,
      to: '/admin/add-logo',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Manage Color Palettes',
      description: 'Create, edit, and organize palettes',
      icon: Palette,
      to: '/admin/color-palettes',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Manage Fonts',
      description: 'Add and curate fonts library',
      icon: Type,
      to: '/admin/fonts',
      color: 'from-purple-500 to-fuchsia-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage content and settings for TrustedLogos</p>
      </div>

      {user && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center text-gray-700">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Role</span>
            </div>
            <div className="mt-2 text-gray-900">{user.role}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center text-gray-700">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Account</span>
            </div>
            <div className="mt-2 text-gray-900">{user.email}</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center text-gray-700">
              <Database className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Content Tools</span>
            </div>
            <div className="mt-2 text-gray-900">Logos, Palettes, Fonts</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {adminTools.map((tool) => (
          <Link
            key={tool.title}
            to={tool.to}
            className="group block"
          >
            <div className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md`}
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${tool.color}`} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border">
                    <tool.icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;