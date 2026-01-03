import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Portal - Your Next Opportunity Awaits',
  description: 'Connect talent with opportunity',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
