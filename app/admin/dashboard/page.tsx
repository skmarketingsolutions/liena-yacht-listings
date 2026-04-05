import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthFromCookies } from '@/lib/auth';
import {
  getAllListingsAdmin,
  getListingsBySalesman,
  getAllAdmins,
  getAdminById,
  type Listing,
} from '@/lib/db';
import AdminNav from '@/components/AdminNav';
import { Plus, Edit, Trash2, Eye, Star, Users, LayoutGrid, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function DashboardPage() {
  const auth = await getAuthFromCookies();
  if (!auth) redirect('/admin/login');

  const listings =
    auth.role === 'broker'
      ? getAllListingsAdmin()
      : getListingsBySalesman(auth.adminId);

  // Attach salesman name to each listing for broker view
  const listingsWithSalesman = listings.map((l) => ({
    ...l,
    salesman_name: l.salesman_id ? getAdminById(l.salesman_id)?.name ?? '—' : '—',
  }));

  const admins = auth.role === 'broker' ? getAllAdmins() : [];

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === 'active').length,
    featured: listings.filter((l) => l.featured).length,
    sold: listings.filter((l) => l.status === 'sold').length,
  };

  return (
    <div className="min-h-screen bg-[#060f1c]">
      <AdminNav auth={auth} />

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl font-semibold text-white">
              {auth.role === 'broker' ? 'All Listings' : 'My Listings'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {auth.name || auth.username}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 font-label text-xs tracking-[2px] uppercase border border-[#1e3050] hover:border-gold-500/40 text-gray-400 hover:text-gold-400 px-5 py-3 rounded-lg transition-colors"
            >
              <MessageSquare size={14} /> Leads
            </Link>
            {auth.role === 'broker' && (
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 font-label text-xs tracking-[2px] uppercase border border-[#1e3050] hover:border-gold-500/40 text-gray-400 hover:text-gold-400 px-5 py-3 rounded-lg transition-colors"
              >
                <Users size={14} /> Users
              </Link>
            )}
            <Link
              href="/admin/listings/new"
              className="inline-flex items-center gap-2 font-label text-xs tracking-[2px] uppercase bg-gold-500 hover:bg-gold-400 text-navy-950 px-5 py-3 rounded-lg transition-colors font-semibold"
            >
              <Plus size={14} /> Add Listing
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: LayoutGrid, label: 'Total', val: stats.total, color: 'text-blue-400' },
            { icon: Eye, label: 'Active', val: stats.active, color: 'text-green-400' },
            { icon: Star, label: 'Featured', val: stats.featured, color: 'text-gold-400' },
            { icon: Users, label: 'Sold', val: stats.sold, color: 'text-red-400' },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-5 text-center">
              <Icon size={20} className={`${color} mx-auto mb-2`} />
              <div className="font-display text-2xl font-semibold text-white">{val}</div>
              <div className="font-label text-[9px] tracking-[2px] uppercase text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Listings table */}
        <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e3050] flex items-center justify-between">
            <h2 className="text-white font-semibold">Listings</h2>
            <span className="text-gray-500 text-sm">{listings.length} total</span>
          </div>

          {listingsWithSalesman.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 mb-4">No listings yet.</p>
              <Link
                href="/admin/listings/new"
                className="inline-flex items-center gap-2 font-label text-xs tracking-[2px] uppercase bg-gold-500 text-navy-950 px-5 py-3 rounded-lg font-semibold"
              >
                <Plus size={14} /> Add Your First Listing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e3050]">
                    {[
                      'Listing',
                      'Price',
                      'Location',
                      'Status',
                      ...(auth.role === 'broker' ? ['Salesman'] : []),
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 font-label text-[9px] tracking-[2px] uppercase text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listingsWithSalesman.map((listing, i) => (
                    <tr
                      key={listing.id}
                      className={`border-b border-[#1e3050] last:border-0 hover:bg-[#091629] transition-colors ${
                        i % 2 === 0 ? '' : 'bg-[#091629]/40'
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {listing.featured && (
                            <Star size={12} className="text-gold-500 shrink-0" />
                          )}
                          <div>
                            <p className="text-white font-medium text-sm line-clamp-1">
                              {listing.title}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {listing.year} · {listing.make} {listing.model}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-white text-sm font-medium whitespace-nowrap">
                        {formatPrice(listing.price)}
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm whitespace-nowrap">
                        {listing.location}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-label text-[9px] tracking-[2px] uppercase px-2.5 py-1 rounded ${
                            listing.status === 'active'
                              ? 'bg-green-900/40 text-green-400'
                              : listing.status === 'sold'
                              ? 'bg-red-900/40 text-red-400'
                              : 'bg-gray-700/40 text-gray-400'
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      {auth.role === 'broker' && (
                        <td className="px-5 py-4 text-gray-400 text-sm">
                          {listing.salesman_name}
                        </td>
                      )}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/listings/${listing.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-500 hover:text-gold-400 transition-colors"
                            title="View live listing"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/admin/listings/${listing.id}/edit`}
                            className="p-1.5 text-gray-500 hover:text-gold-400 transition-colors"
                            title="Edit listing"
                          >
                            <Edit size={15} />
                          </Link>
                          <DeleteButton listingId={listing.id} title={listing.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Team section — broker only */}
        {auth.role === 'broker' && admins.length > 0 && (
          <div className="mt-10 bg-[#0d1e33] border border-[#1e3050] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1e3050]">
              <h2 className="text-white font-semibold">Team Members</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e3050]">
                    {['Name', 'Username', 'Role', 'Email', 'Phone'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 font-label text-[9px] tracking-[2px] uppercase text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-[#1e3050] last:border-0 hover:bg-[#091629] transition-colors"
                    >
                      <td className="px-5 py-3 text-white text-sm">{a.name || '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-sm">{a.username}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`font-label text-[9px] tracking-wider uppercase px-2.5 py-1 rounded ${
                            a.role === 'broker'
                              ? 'bg-gold-500/20 text-gold-400'
                              : 'bg-blue-900/30 text-blue-400'
                          }`}
                        >
                          {a.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-sm">{a.email || '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-sm">{a.phone || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DeleteButton({ listingId, title }: { listingId: number; title: string }) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/listings/${listingId}`, { method: 'DELETE' });
        if (res.ok) window.location.reload();
        else alert('Failed to delete listing.');
      }}
    >
      <button
        type="submit"
        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
        title="Delete listing"
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
}
