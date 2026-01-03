'use client';

import { usePathname } from 'next/navigation';
import Header from './header';
import Footer from './footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes where header and footer should be hidden
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/user');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
