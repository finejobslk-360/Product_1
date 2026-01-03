'use client';

import { ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Menu,
  Bookmark,
  History,
  FileText,
  LogOut,
  X,
} from 'lucide-react';
import { auth, signOut } from '@/lib/firebaseClient';

const navItems = [
  { label: 'Portfolio', href: '/user', icon: User },
  { label: 'Build CV', href: '/user/buildcv', icon: FileText },
  { label: 'Jobs', href: '/user/jobs', icon: Briefcase },
  { label: 'Saved Jobs/Gigs', href: '/user/savedjobs', icon: Bookmark },
  { label: 'Application History', href: '/user/applicationhistory', icon: History },
  { label: 'Messages', href: '/user/messages', icon: MessageSquare },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const current = useMemo(
    () => navItems.find((item) => item.href === pathname) ?? { label: 'Dashboard' },
    [pathname]
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/auth/siginin';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-sm
          transform transition-all duration-300 ease-in-out
          w-64 md:w-16 md:hover:w-64 group peer overflow-hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 min-w-[32px] rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center">
              U
            </div>
            {/* Logo Text */}
            <Link href="/" className="font-bold text-gray-900 text-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
              FineJobs           
            </Link>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 min-w-[20px]" />
                <span className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      {/* Added `peer-hover:md:ml-64` to resize layout when sidebar (peer) is hovered */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out md:ml-16 peer-hover:md:ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 truncate">{current.label}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-2 rounded-full border border-gray-200 text-sm w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <button
              onClick={handleLogout}
              title="Log out"
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
