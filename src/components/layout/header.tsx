'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, signOut as firebaseSignOut } from '@/lib/firebaseClient';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/#jobs', label: 'Jobs' },
  { href: '/#gigs', label: 'Gigs' },
  { href: '/contact-us', label: 'Contact' },
  { href: '/about-us', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const [sessionUser, setSessionUser] = useState<null | {
    id: string;
    email: string;
    role: string;
    profile?: { fullName?: string };
  }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!mounted) return;
        if (data?.authenticated) {
          setSessionUser(data.user || null);
        } else {
          setSessionUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
        setSessionUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSession();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold text-base md:text-lg">
          <div className="hidden sm:block leading-tight">
            <p className="text-[15px] uppercase tracking-[0.4em] ">Finejobs</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground',
                pathname === item.href ? 'text-foreground' : undefined
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : !sessionUser ? (
            <>
              <Link
                href="/auth/signin"
                className="hidden md:flex h-9 px-4 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Login
              </Link>
              <Button asChild className="text-xs font-semibold uppercase tracking-wide">
                <Link href="/auth/signup">Register</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild className="text-xs font-semibold uppercase tracking-wide">
                <Link href={sessionUser.role === 'JOB_SEEKER' ? '/user' : '/dashboard'}>
                  Dashboard
                </Link>
              </Button>
              <div className="text-sm text-gray-700">
                {sessionUser.profile?.fullName || sessionUser.email}
              </div>
              <Button
                variant="ghost"
                className="text-xs font-semibold uppercase tracking-wide"
                onClick={async () => {
                  try {
                    await fetch('/api/auth/signout', { method: 'POST' });
                    // Also sign out the firebase client to clear client auth state
                    try {
                      await firebaseSignOut(auth);
                    } catch (e) {
                      console.warn('Firebase client signout failed:', e);
                    }
                    // Refresh to reflect signed-out state
                    window.location.reload();
                  } catch (err) {
                    console.error('Sign out failed:', err);
                  }
                }}
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
