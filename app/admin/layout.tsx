import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin Dashboard', template: '%s | Liena Q Perez Admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#060f1c]">{children}</div>;
}
