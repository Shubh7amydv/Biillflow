import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { SiteConfigProvider } from '@/context/SiteConfigContext';

export const metadata: Metadata = {
  title: 'BillFlow — Simple Invoicing & Billing for Freelancers & Studios',
  description:
    'Create sleek, professional invoices in seconds. Get paid faster with one-click payments, automatic reminders, and effortless tracking built for modern independents.',
  keywords: ['invoicing', 'billing', 'freelancer tools', 'invoice generator', 'studio billing'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 min-h-screen font-sans">
        <AuthProvider>
          <SiteConfigProvider>{children}</SiteConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
