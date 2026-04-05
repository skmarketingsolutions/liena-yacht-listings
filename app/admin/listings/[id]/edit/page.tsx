import { redirect, notFound } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';
import AdminNav from '@/components/AdminNav';
import ListingForm from '@/components/ListingForm';
import { getListingById, getAllAdmins } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function EditListingPage({ params }: PageProps) {
  const auth = await getAuthFromCookies();
  if (!auth) redirect('/admin/login');

  const [listing, admins] = await Promise.all([
    getListingById(parseInt(params.id)),
    auth.role === 'broker' ? getAllAdmins() : Promise.resolve([]),
  ]);

  if (!listing) notFound();

  // Salesmen can only edit their own listings
  if (auth.role === 'salesman' && listing.salesman_id !== auth.adminId) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#060f1c]">
      <AdminNav auth={auth} />
      <main className="max-w-4xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-white">Edit Listing</h1>
          <p className="text-gray-500 text-sm mt-1">{listing.title}</p>
        </div>
        <ListingForm mode="edit" listing={listing} auth={auth} admins={admins} />
      </main>
    </div>
  );
}
