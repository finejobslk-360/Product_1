'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold text-base md:text-lg">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.4em] text-primary-foreground">
            360°
          </span>
          <div className="hidden sm:block leading-tight">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Product 1
            </p>
            <p>Career OS</p>
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
          <Button
            variant="ghost"
            asChild
            className="hidden text-xs font-semibold uppercase tracking-wide md:flex"
          >
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button asChild className="text-xs font-semibold uppercase tracking-wide">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
