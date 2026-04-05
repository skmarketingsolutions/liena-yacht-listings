import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';
import AdminNav from '@/components/AdminNav';
import ListingForm from '@/components/ListingForm';
import { getAllAdmins } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function NewListingPage() {
  const auth = await getAuthFromCookies();
  if (!auth) redirect('/admin/login');

  const admins = auth.role === 'broker' ? getAllAdmins() : [];

  return (
    <div className="min-h-screen bg-[#060f1c]">
      <AdminNav auth={auth} />
      <main className="max-w-4xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-white">Add New Listing</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details below to create a new yacht listing.</p>
        </div>
        <ListingForm mode="new" auth={auth} admins={admins} />
      </main>
    </div>
  );
}
