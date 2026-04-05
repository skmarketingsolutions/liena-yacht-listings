'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Anchor, LayoutGrid, Plus, LogOut, ExternalLink, Users, MessageSquare } from 'lucide-react';
import type { JwtPayload } from '@/lib/auth';

interface Props {
  auth: JwtPayload;
}

export default function AdminNav({ auth }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navLink = (href: string, icon: React.ReactNode, label: string) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
          active ? 'text-gold-400 bg-gold-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {icon} {label}
      </Link>
    );
  };

  return (
    <nav className="bg-[#0a1628] border-b border-[#1e3050] px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-gold-500/50 flex items-center justify-center">
            <Anchor size={14} className="text-gold-500" />
          </div>
          <div className="leading-tight hidden sm:block">
            <span className="font-display text-sm font-semibold tracking-widest text-white block">LIENA Q PEREZ</span>
            <span className="font-label text-[8px] tracking-[3px] text-gold-500 block -mt-0.5">YACHTS ADMIN</span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLink('/admin/dashboard', <LayoutGrid size={14} />, 'Listings')}
          {navLink('/admin/listings/new', <Plus size={14} />, 'Add Listing')}
          {navLink('/admin/leads', <MessageSquare size={14} />, 'Leads')}
          {auth.role === 'broker' && navLink('/admin/users', <Users size={14} />, 'Users')}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded text-sm transition-colors"
          >
            <ExternalLink size={14} /> View Site
          </Link>
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-white text-xs font-medium">{auth.name || auth.username}</p>
            <p className="text-gold-500 text-[9px] font-label tracking-wider uppercase">
              {auth.role === 'broker' ? 'Admin' : 'Salesman'}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 transition-colors p-1.5"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
