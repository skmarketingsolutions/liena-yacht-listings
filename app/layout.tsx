import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com'),
  title: {
    default: 'Liena Q Perez — Luxury Yacht Sales Miami & Miami Beach',
    template: '%s | Liena Q Perez',
  },
  description:
    'Liena Q Perez — Miami luxury yacht sales specialist. Browse exclusive flybridge yachts, motor yachts, and superyachts for sale in Miami, Miami Beach, and South Florida.',
  keywords: [
    'luxury yacht for sale Miami',
    'yacht broker Miami Florida',
    'motor yacht Miami Beach',
    'flybridge yacht Miami',
    'used yacht for sale South Florida',
    'Liena Q Perez yacht',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Liena Q Perez',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
