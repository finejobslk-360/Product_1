"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Jobs', href: '/#jobs' },
  { label: 'Gigs', href: '/#gigs' },
  { label: 'Contact', href: '/contact-us' },
  { label: 'About', href: '/about-us' },
];

export default function Footer() {
  const pathname = usePathname();

  // Hide the left banner block on any `/user` route
  const showBanner = !pathname?.startsWith('/user');

  return (
    <footer className="border-t border-border/60 bg-background/90">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-10 md:px-6 md:flex-row md:items-center md:justify-between">
        {showBanner && (
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
               Product 1
            </p>
            <p className="text-2xl font-semibold">Career OS for modern teams</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Curated opportunities, intelligent workflows, and guided onboarding for seekers and
              teams.
            </p>
          </div>
        )}

        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
