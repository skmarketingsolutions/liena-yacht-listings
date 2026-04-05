'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Invalid credentials. Please try again.');
        setStatus('error');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please check your connection.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060f1c] px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gold-500/3 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full border-2 border-gold-500/50 flex items-center justify-center mx-auto mb-5">
            <Anchor size={28} className="text-gold-500" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-white">Liena Q Perez</h1>
          <p className="font-label text-[10px] tracking-[4px] uppercase text-gold-500 mt-1">Listings Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#0d1e33] border border-[#1e3050] rounded-2xl p-8 shadow-luxury">
          <h2 className="text-white font-semibold text-lg mb-6">Sign In to Dashboard</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block font-label text-[10px] tracking-[2px] uppercase text-gray-500 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                required
                autoComplete="username"
                className="admin-input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-label text-[10px] tracking-[2px] uppercase text-gray-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="admin-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded px-4 py-3">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 font-label text-xs tracking-[3px] uppercase bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/40 text-navy-950 px-6 py-4 rounded-lg transition-all font-semibold mt-2 shadow-gold"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          For access, contact your brokerage administrator.
        </p>
      </div>
    </div>
  );
}
