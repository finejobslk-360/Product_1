// components/ApplicationHistoryClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Building2, MapPin, DollarSign, Calendar } from 'lucide-react';

// Define types based on your data structure
type Application = {
  id: string;
  status: string;
  createdAt: Date;
  jobId: string;
  job: {
    title: string;
    type: string;
    location: string;
    salaryRange: string | null;
    employer: {
      profile: {
        fullName: string | null;
      } | null;
    };
  };
};

export default function ApplicationHistoryClient({
  initialApplications,
}: {
  initialApplications: Application[];
}) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate counts for tabs
  const stats = {
    ALL: initialApplications.length,
    JOB: initialApplications.filter((app) => app.job.type !== 'FREELANCE').length,
    FREELANCE: initialApplications.filter((app) => app.job.type === 'FREELANCE').length,
    PENDING: initialApplications.filter((app) => app.status === 'PENDING').length,
    ACCEPTED: initialApplications.filter((app) => ['HIRED', 'SHORTLISTED'].includes(app.status))
      .length,
    REJECTED: initialApplications.filter((app) => app.status === 'REJECTED').length,
  };

  // Filter Logic
  const filteredApplications = initialApplications.filter((app) => {
    // 1. Text Search
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchLower) ||
      (app.job.employer.profile?.fullName || '').toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // 2. Tab Filter
    if (activeTab === 'ALL') return true;
    if (activeTab === 'JOB') return app.job.type !== 'FREELANCE';
    if (activeTab === 'FREELANCE') return app.job.type === 'FREELANCE';
    if (activeTab === 'ACCEPTED') return ['HIRED', 'SHORTLISTED'].includes(app.status);
    return app.status === activeTab;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application History</h1>
          <p className="text-gray-600 mt-1">Track all your job and gig applications</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Link
            href="/jobs"
            className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* Responsive Tabs */}
      <div className="relative mb-6">
        <div className="flex overflow-x-auto border-b border-gray-200 gap-6 scrollbar-hide pb-0.5">
          {Object.entries(stats).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* DESKTOP VIEW: Table (Hidden on small screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4 w-[40%]">Position</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/jobs/${app.jobId}`} className="block">
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {app.job.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {app.job.location} • {app.job.salaryRange || 'Salary N/A'}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {app.job.employer.profile?.fullName?.charAt(0) || 'C'}
                      </div>
                      <div className="font-medium text-gray-900">
                        {app.job.employer.profile?.fullName || 'Unknown'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        app.job.type === 'FREELANCE'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {app.job.type === 'FREELANCE' ? 'Gig' : 'Job'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Card Stack (Hidden on medium screens and up) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredApplications.map((app) => (
            <div key={app.id} className="p-4 flex flex-col gap-4 hover:bg-gray-50">
              <Link href={`/jobs/${app.jobId}`} className="flex justify-between items-start gap-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold">
                    {app.job.employer.profile?.fullName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{app.job.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Building2 className="w-3 h-3" />
                      {app.job.employer.profile?.fullName || 'Unknown'}
                    </div>
                  </div>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {app.job.location}
                </div>
                <div className="flex items-center gap-1.5">
                  {app.job.type === 'FREELANCE' ? (
                    <span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Gig</span>
                  ) : (
                    <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Job</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {app.job.salaryRange || 'N/A'}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No applications found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
