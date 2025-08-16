import React from 'react';
import { Plus, Palette, Type, Shield, Users, Database, Trash2, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { admins, addAdmin, removeAdmin, changePassword } = useAdminAuth();
  const [newAdmin, setNewAdmin] = React.useState({ username: '', password: '', confirm: '' });
  const [message, setMessage] = React.useState<string | null>(null);

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

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!newAdmin.username || !newAdmin.password) return setMessage('Username and password are required');
    if (newAdmin.password !== newAdmin.confirm) return setMessage('Passwords do not match');
    try {
      await addAdmin(newAdmin.username.trim(), newAdmin.password);
      setNewAdmin({ username: '', password: '', confirm: '' });
      setMessage('Admin added');
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const handleChangePassword = async (username: string) => {
    const pw = prompt(`New password for ${username}`);
    if (!pw) return;
    try {
      await changePassword(username, pw);
      setMessage('Password updated');
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

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

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {adminTools.map((tool) => (
          <Link key={tool.title} to={tool.to} className="group block">
            <div className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md`}>
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

      {/* Admin Users management */}
      <div className="bg-white rounded-lg border p-5">
        <h2 className="text-lg font-semibold mb-3">Admin Users</h2>
        {message && <div className="mb-3 p-2 rounded bg-yellow-50 border text-yellow-800">{message}</div>}
        <form onSubmit={handleAddAdmin} className="grid md:grid-cols-3 gap-3 mb-4">
          <input className="border rounded p-2" placeholder="Username" value={newAdmin.username} onChange={e => setNewAdmin(s => ({ ...s, username: e.target.value }))} />
          <input className="border rounded p-2" type="password" placeholder="Password" value={newAdmin.password} onChange={e => setNewAdmin(s => ({ ...s, password: e.target.value }))} />
          <input className="border rounded p-2" type="password" placeholder="Confirm Password" value={newAdmin.confirm} onChange={e => setNewAdmin(s => ({ ...s, confirm: e.target.value }))} />
          <button className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Add Admin</button>
        </form>
        <div className="divide-y border rounded">
          {admins.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No admins yet.</div>
          ) : admins.map(a => (
            <div key={a.username} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{a.username}</div>
                <div className="text-xs text-gray-500">Created {new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-sm border rounded" onClick={() => handleChangePassword(a.username)}>
                  <KeyRound className="h-4 w-4" />
                </button>
                <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={() => removeAdmin(a.username)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;