'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Tag } from 'lucide-react';

type SavedPost = {
  id: string;
  title: string;
  company?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  workMode?: string;
  experienceLevel?: string;
  status?: string;
  budget?: string;
  coverImage?: string;
  tags?: string[];
  lastUpdated?: string;
};

export default function ManageJobsPage() {
  const [posts] = useState<SavedPost[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = window.localStorage.getItem('employerPosts');
    if (!stored) return [];
    try {
      return JSON.parse(stored) as SavedPost[];
    } catch (err) {
      console.warn('Failed to parse stored posts', err);
      return [];
    }
  });

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Manage Jobs & Gigs</h2>
            <p className="text-sm text-gray-500">
              Review everything you’ve posted from the dashboard wizard.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
            No roles yet. Create one from the dashboard to see it listed here.
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border border-gray-200 rounded-xl bg-white p-4 flex gap-4 items-start shadow-sm"
              >
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-20 h-16 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{post.title}</h3>
                    <span className="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-600">
                      {post.status || 'Draft'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {post.company || 'Company'} - {post.department || 'Dept'} -{' '}
                    {post.employmentType || 'Type'} - {post.workMode || 'Mode'}
                  </p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {post.location || 'Location'} - {post.experienceLevel || 'Level'}
                  </p>
                  {post.budget && (
                    <p className="text-[11px] text-gray-500">Budget / salary: {post.budget}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-gray-400">
                    Updated {post.lastUpdated || 'recently'} • Synced from dashboard wizard
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
