'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import { Plus, Trash2, Edit, X, Check, Eye, EyeOff } from 'lucide-react';
import type { JwtPayload } from '@/lib/auth';

interface User {
  id: number;
  username: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'broker' | 'salesman';
  created_at: string;
  password_hash: string;
}

const inputCls = 'w-full bg-[#060f1c] border border-[#1e3050] rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gold-500/60 transition-colors';
const labelCls = 'block font-label text-[10px] tracking-[2px] uppercase text-gray-500 mb-1';

export default function UsersPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<JwtPayload | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', name: '', email: '', phone: '', role: 'salesman' as 'broker' | 'salesman' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get auth from cookie by checking the dashboard redirect
    fetch('/api/leads').then(r => {
      if (r.status === 401) router.replace('/admin/login');
    });
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const r = await fetch('/api/users');
    if (r.status === 401) { router.replace('/admin/login'); return; }
    if (r.status === 403) { router.replace('/admin/dashboard'); return; }
    const data = await r.json();
    setUsers(data);
    setLoading(false);
  }

  function openAddForm() {
    setEditingUser(null);
    setForm({ username: '', password: '', name: '', email: '', phone: '', role: 'salesman' });
    setError('');
    setShowForm(true);
  }

  function openEditForm(user: User) {
    setEditingUser(user);
    setForm({ username: user.username, password: '', name: user.name || '', email: user.email || '', phone: user.phone || '', role: user.role });
    setError('');
    setShowForm(true);
  }

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      if (editingUser) {
        // Update existing
        const body: Record<string, string> = { name: form.name, email: form.email, phone: form.phone, role: form.role };
        if (form.password) body.password = form.password;
        const r = await fetch(`/api/users/${editingUser.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await r.json();
        if (!r.ok) { setError(data.error || 'Failed to save'); setSaving(false); return; }
      } else {
        // Create new
        if (!form.username || !form.password) { setError('Username and password are required'); setSaving(false); return; }
        const r = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const data = await r.json();
        if (!r.ok) { setError(data.error || 'Failed to create user'); setSaving(false); return; }
      }
      setShowForm(false);
      fetchUsers();
    } catch {
      setError('Network error');
    }
    setSaving(false);
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete account for "${user.name || user.username}"? This cannot be undone.`)) return;
    const r = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
    const data = await r.json();
    if (!r.ok) { alert(data.error || 'Failed to delete'); return; }
    fetchUsers();
  }

  // We need auth for AdminNav - get it from a simple state trick
  const mockAuth: JwtPayload = { adminId: 0, username: 'admin', role: 'broker', name: 'Admin' };

  return (
    <div className="min-h-screen bg-[#060f1c]">
      <AdminNav auth={mockAuth} />

      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl font-semibold text-white">Manage Users</h1>
            <p className="text-gray-500 text-sm mt-1">Add and manage salesman accounts</p>
          </div>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-5 py-3 rounded-lg transition-colors font-semibold"
          >
            <Plus size={14} /> Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e3050] flex items-center justify-between">
            <h2 className="text-white font-semibold">All Accounts</h2>
            <span className="text-gray-500 text-sm">{users.length} users</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e3050]">
                    {['Name', 'Username', 'Role', 'Email', 'Phone', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-label text-[9px] tracking-[2px] uppercase text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={`border-b border-[#1e3050] last:border-0 hover:bg-[#091629] transition-colors ${i % 2 === 1 ? 'bg-[#091629]/40' : ''}`}>
                      <td className="px-5 py-4 text-white text-sm font-medium">{u.name || '—'}</td>
                      <td className="px-5 py-4 text-gray-400 text-sm font-mono">{u.username}</td>
                      <td className="px-5 py-4">
                        <span className={`font-label text-[9px] tracking-wider uppercase px-2.5 py-1 rounded ${u.role === 'broker' ? 'bg-gold-500/20 text-gold-400' : 'bg-blue-900/30 text-blue-400'}`}>
                          {u.role === 'broker' ? 'Admin' : 'Salesman'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm">{u.email || '—'}</td>
                      <td className="px-5 py-4 text-gray-400 text-sm">{u.phone || '—'}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditForm(u)} className="p-1.5 text-gray-500 hover:text-gold-400 transition-colors" title="Edit user">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => handleDelete(u)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors" title="Delete user">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl w-full max-w-md shadow-2xl">
              <div className="px-6 py-4 border-b border-[#1e3050] flex items-center justify-between">
                <h3 className="text-white font-semibold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">
                {!editingUser && (
                  <div>
                    <label className={labelCls}>Username <span className="text-gold-500">*</span></label>
                    <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="jsmith" autoComplete="off" className={inputCls} />
                  </div>
                )}

                <div>
                  <label className={labelCls}>Full Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" autoComplete="off" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Email</label>
                  <input type="text" inputMode="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" autoComplete="off" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="text" inputMode="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(786) 000-0000" autoComplete="off" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>{editingUser ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder={editingUser ? 'Leave blank to keep current' : 'Min 8 characters'}
                      autoComplete="new-password"
                      className={`${inputCls} pr-10`}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'broker' | 'salesman' }))} className={`${inputCls} cursor-pointer`}>
                    <option value="salesman">Salesman (restricted)</option>
                    <option value="broker">Admin (full access)</option>
                  </select>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-3 py-2">{error}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setShowForm(false)} className="flex-1 font-label text-xs tracking-[2px] uppercase border border-[#1e3050] hover:border-gray-500 text-gray-400 hover:text-white px-4 py-2.5 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-950 px-4 py-2.5 rounded-lg transition-colors font-semibold">
                    {saving ? 'Saving...' : <><Check size={13} /> {editingUser ? 'Save Changes' : 'Create User'}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
