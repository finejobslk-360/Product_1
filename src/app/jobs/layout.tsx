'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Nav */}
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">360 Technologies</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link
                  href="/jobs"
                  className="text-gray-900 font-medium hover:text-blue-600 px-3 py-2 text-sm"
                >
                  Home
                </Link>
                <Link href="/jobs" className="text-orange-500 font-semibold px-3 py-2 text-sm">
                  Jobs
                </Link>
                <Link
                  href="/jobs/saved"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  My Saved Jobs
                </Link>
                <Link
                  href="/user"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  CV Builder
                </Link>
              </nav>
            </div>

            {/* Search and Profile */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?img=5"
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
