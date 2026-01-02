'use client';

import { ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Search,
  LogOut,
} from 'lucide-react';
import { auth, signOut } from '@/lib/firebaseClient';

type UserRole = 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER' | null;

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const employerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Manage Jobs', href: '/dashboard/manage-jobs', icon: Briefcase },
  { label: 'Manage Gigs', href: '/dashboard/manage-gigs', icon: Wallet },
  { label: 'Applicants', href: '/dashboard/applicants', icon: Users },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Jobs', href: '/dashboard/manage-jobs', icon: Briefcase },
  { label: 'Applicants', href: '/dashboard/applicants', icon: Users },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isClient = typeof window !== 'undefined';
  const [role] = useState<UserRole>(() =>
    isClient ? (window.localStorage.getItem('userRole') as UserRole | null) : null
  );
  const [userName] = useState<string>(() =>
    isClient ? window.localStorage.getItem('userName') || 'User' : 'User'
  );
  const [userSubtitle] = useState<string>(
    () =>
      (isClient ? window.localStorage.getItem('userSubtitle') || 'Workspace member' : undefined) ||
      'Workspace member'
  );
  const notificationCount: number | null = null;

  const initials = useMemo(() => {
    return (
      userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'U'
    );
  }, [userName]);

  const navItems = role === 'ADMIN' ? adminNavItems : employerNavItems;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      await signOut(auth);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('userRole');
      }
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-gray-50">
      <aside className="bg-white border-r border-gray-200 flex flex-col w-64 overflow-hidden">
        <div className="px-4 py-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
            360A
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">360 Technologies</p>
            <p className="text-xs text-gray-500">
              {role === 'ADMIN' ? 'Admin' : 'Company'} workspace
            </p>
          </div>
        </div>

        <nav className="flex-1 px-2 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full text-xs font-semibold text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search jobs, talent..."
                className="pl-9 pr-3 py-2 rounded-full border border-gray-200 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Bell className="w-4 h-4 text-gray-600" />
              {notificationCount && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white text-xs flex items-center justify-center font-semibold">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-900">{userName}</p>
                <p className="text-[11px] text-gray-500">{userSubtitle}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
