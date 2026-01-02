'use client';

import Link from 'next/link';

export default function ManageGigsPage() {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Manage Gigs</h2>
          <p className="text-sm text-gray-500">
            Create and track freelance/contract postings. Use the dashboard wizard to add new gigs
            or jobs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard?open=gig"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Create gig
          </Link>
          <Link
            href="/dashboard?open=job"
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Post job
          </Link>
        </div>
      </div>

      <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
        Your gigs will appear here after you post them from the dashboard wizard.
      </div>
    </section>
  );
}
