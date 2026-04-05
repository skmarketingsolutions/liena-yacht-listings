import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import { getAuthFromCookies } from '@/lib/auth';
import { getAllLeads, getLeadsByListingIds, getListingsBySalesman } from '@/lib/db';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function LeadsPage() {
  const auth = await getAuthFromCookies();
  if (!auth) redirect('/admin/login');

  let leads;
  if (auth.role === 'broker') {
    leads = await getAllLeads();
  } else {
    const myListings = await getListingsBySalesman(auth.adminId);
    leads = await getLeadsByListingIds(myListings.map((l) => l.id));
  }

  return (
    <div className="min-h-screen bg-[#060f1c]">
      <AdminNav auth={auth} />

      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold text-white">
            {auth.role === 'broker' ? 'All Leads' : 'My Leads'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {leads.length} form submission{leads.length !== 1 ? 's' : ''}
            {auth.role === 'salesman' ? ' on your listings' : ''}
          </p>
        </div>

        {leads.length === 0 ? (
          <div className="bg-[#0d1e33] border border-[#1e3050] rounded-xl py-20 text-center">
            <MessageSquare size={36} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No leads yet. They will appear here when visitors submit the contact form.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-[#0d1e33] border border-[#1e3050] rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                        <span className="font-display text-gold-400 text-sm font-semibold">
                          {(lead.name || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        {lead.listing_title && (
                          <p className="text-gold-500/70 text-xs font-label tracking-wide">Re: {lead.listing_title}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-gray-400 hover:text-gold-400 transition-colors">
                        <Mail size={13} /> {lead.email}
                      </a>
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-gray-400 hover:text-gold-400 transition-colors">
                        <Phone size={13} /> {lead.phone}
                      </a>
                    </div>

                    {lead.message && (
                      <p className="text-gray-400 text-sm bg-[#060f1c] rounded-lg px-4 py-3 border border-[#1e3050]">
                        &quot;{lead.message}&quot;
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-gray-600 text-xs">{fmt(lead.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
