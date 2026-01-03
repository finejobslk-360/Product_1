'use client';

import { ReactNode, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Building2,
  Ticket,
  DollarSign,
  Server,
  Shield,
} from 'lucide-react';
import { auth, signOut } from '@/lib/firebaseClient';
import ProfileSettingsModal from '@/components/admin/ProfileSettingsModal';

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
  { label: 'Admin Management', href: '/dashboard/admin/admins', icon: Shield },
  { label: 'Employer Management', href: '/dashboard/admin/employers', icon: Users },
  { label: 'Company Management', href: '/dashboard/admin/companies', icon: Building2 },
  { label: 'Gig Management', href: '/dashboard/admin/gigs', icon: Wallet },
  { label: 'Support Tickets', href: '/dashboard/admin/tickets', icon: Ticket },
  { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  { label: 'Revenue', href: '/dashboard/admin/revenue', icon: DollarSign },
  { label: 'System Settings', href: '/dashboard/admin/system-settings', icon: Server },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [role] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return (window.localStorage.getItem('userRole') as UserRole) || null;
    }
    return null;
  });
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('userName') || 'User';
    }
    return 'User';
  });
  const [userSubtitle] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('userSubtitle') || 'Workspace member';
    }
    return 'Workspace member';
  });
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile');
        const data = await response.json();
        if (response.ok && data.profile) {
          if (data.profile.fullName) {
            setUserName(data.profile.fullName);
            window.localStorage.setItem('userName', data.profile.fullName);
          }
          if (data.profile.profileImageUrl) {
            setProfileImageUrl(data.profile.profileImageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (role === 'JOB_SEEKER') {
      router.push('/user');
    }
  }, [role, router]);

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
          <div className="leading-tight">
            <p className="text-[15px] uppercase tracking-[0.4em] font-semibold text-gray-900">
              Finejobs
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
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
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white text-xs flex items-center justify-center font-semibold overflow-hidden border-2 border-gray-200">
                {profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-900">{userName}</p>
                <p className="text-[11px] text-gray-500">{userSubtitle}</p>
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>

      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onUpdate={fetchProfile}
      />
    </div>
  );
}
