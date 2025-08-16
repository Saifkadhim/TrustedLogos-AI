import React, { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminSignInPage: React.FC = () => {
  const { signIn, isAuthenticated, currentUsername, noAdmins, addAdmin, ownerVerified, verifyOwner } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [bootstrap, setBootstrap] = useState({ username: '', password: '', confirm: '' });
  const [ownerCode, setOwnerCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await signIn(username.trim(), password);
      setMessage('Signed in successfully');
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!bootstrap.username || !bootstrap.password) return setMessage('Username and password are required');
    if (bootstrap.password !== bootstrap.confirm) return setMessage('Passwords do not match');
    try {
      await addAdmin(bootstrap.username.trim(), bootstrap.password);
      setMessage('Initial admin created. You can now sign in.');
      setBootstrap({ username: '', password: '', confirm: '' });
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const handleVerifyOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await verifyOwner(ownerCode);
    setMessage(ok ? 'Owner verified' : 'Invalid owner code');
    if (ok) setOwnerCode('');
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Sign-In</h1>

      {message && (
        <div className="mb-4 p-3 rounded border bg-yellow-50 text-yellow-800">{message}</div>
      )}

      {!ownerVerified && (
        <form onSubmit={handleVerifyOwner} className="bg-white rounded border p-4 space-y-3 mb-6">
          <div className="text-sm text-gray-600">Enter owner code to manage admin accounts</div>
          <input className="w-full border rounded p-2" type="password" placeholder="Owner code" value={ownerCode} onChange={(e) => setOwnerCode(e.target.value)} />
          <button className="w-full bg-blue-600 text-white rounded p-2">Verify Owner</button>
          <div className="text-xs text-gray-500">Set VITE_OWNER_CODE in your .env to define the owner code.</div>
        </form>
      )}

      {isAuthenticated ? (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          You are signed in{currentUsername ? ` as ${currentUsername}` : ''}.
        </div>
      ) : noAdmins ? (
        ownerVerified ? (
          <div className="bg-white rounded border p-4 mb-6">
            <h2 className="font-semibold mb-2">Create Initial Admin</h2>
            <form onSubmit={handleBootstrap} className="space-y-3">
              <input className="w-full border rounded p-2" placeholder="Username" value={bootstrap.username} onChange={(e) => setBootstrap(s => ({ ...s, username: e.target.value }))} />
              <input className="w-full border rounded p-2" type="password" placeholder="Password" value={bootstrap.password} onChange={(e) => setBootstrap(s => ({ ...s, password: e.target.value }))} />
              <input className="w-full border rounded p-2" type="password" placeholder="Confirm Password" value={bootstrap.confirm} onChange={(e) => setBootstrap(s => ({ ...s, confirm: e.target.value }))} />
              <button className="w-full bg-blue-600 text-white rounded p-2">Create Admin</button>
            </form>
          </div>
        ) : (
          <div className="text-sm text-gray-600">Owner verification required to create the first admin.</div>
        )
      ) : (
        <form onSubmit={handleLogin} className="bg-white rounded border p-4 space-y-3">
          <input className="w-full border rounded p-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white rounded p-2">Sign In</button>
        </form>
      )}
    </div>
  );
};

export default AdminSignInPage;