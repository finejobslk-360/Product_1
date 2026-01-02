'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Briefcase, DollarSign, ArrowUpDown, Building2 } from 'lucide-react';

// Define a type for the props based on your Prisma query structure
type SavedJob = {
  id: string;
  createdAt: Date;
  job: {
    id: string;
    title: string;
    type: string;
    location: string;
    salaryRange: string | null;
    createdAt: Date;
    tags: string[];
    description: string;
    employer: {
      profile: {
        fullName: string | null;
      } | null;
    };
  };
};

export default function SavedJobsClient({ initialJobs }: { initialJobs: SavedJob[] }) {
  // State for filtering and sorting
  const [filterType, setFilterType] = useState<'ALL' | 'JOB' | 'FREELANCE'>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Stats calculation
  const totalSaved = initialJobs.length;
  const jobsCount = initialJobs.filter((sj) => sj.job.type !== 'FREELANCE').length;
  const gigsCount = totalSaved - jobsCount;

  // Filter and Sort Logic
  const filteredJobs = initialJobs
    .filter((savedJob) => {
      if (filterType === 'ALL') return true;
      if (filterType === 'FREELANCE') return savedJob.job.type === 'FREELANCE';
      return savedJob.job.type !== 'FREELANCE';
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header: Sort Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSort}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors shadow-sm"
        >
          <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Stats/Filter Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        {/* Button 1: All Saved */}
        <button
          onClick={() => setFilterType('ALL')}
          className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center ${
            filterType === 'ALL'
              ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div
            className={`text-lg sm:text-2xl font-bold leading-none mb-1 ${filterType === 'ALL' ? 'text-blue-700' : 'text-gray-900'}`}
          >
            {totalSaved}
          </div>
          <div
            className={`text-[10px] sm:text-sm font-medium ${filterType === 'ALL' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            All Saved
          </div>
        </button>

        {/* Button 2: Jobs */}
        <button
          onClick={() => setFilterType('JOB')}
          className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center ${
            filterType === 'JOB'
              ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div
            className={`text-lg sm:text-2xl font-bold leading-none mb-1 ${filterType === 'JOB' ? 'text-blue-700' : 'text-gray-900'}`}
          >
            {jobsCount}
          </div>
          <div
            className={`text-[10px] sm:text-sm font-medium ${filterType === 'JOB' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            Jobs Only
          </div>
        </button>

        {/* Button 3: Gigs */}
        <button
          onClick={() => setFilterType('FREELANCE')}
          className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center ${
            filterType === 'FREELANCE'
              ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
              : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div
            className={`text-lg sm:text-2xl font-bold leading-none mb-1 ${filterType === 'FREELANCE' ? 'text-blue-700' : 'text-gray-900'}`}
          >
            {gigsCount}
          </div>
          <div
            className={`text-[10px] sm:text-sm font-medium ${filterType === 'FREELANCE' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            Gigs Only
          </div>
        </button>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((savedJob) => (
            <div
              key={savedJob.id}
              className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex gap-3 sm:gap-4">
                {/* Company Logo Placeholder */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-lg sm:text-xl border border-blue-100">
                  {savedJob.job.employer.profile?.fullName?.charAt(0) || (
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header: Title + Company + Date */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                    <div>
                      <Link
                        href={`/jobs/${savedJob.job.id}`}
                        className="hover:text-blue-600 transition-colors block"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug break-words">
                          {savedJob.job.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 font-medium text-xs sm:text-sm truncate mt-0.5">
                        {savedJob.job.employer.profile?.fullName || 'Unknown Company'}
                      </p>
                    </div>

                    <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap pt-0.5">
                      Saved {new Date(savedJob.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-[200px]">
                        {savedJob.job.location}
                      </span>
                    </div>
                    {savedJob.job.salaryRange && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>{savedJob.job.salaryRange}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Posted {new Date(savedJob.job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium uppercase tracking-wide border ${
                        savedJob.job.type === 'FREELANCE'
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}
                    >
                      {savedJob.job.type.replace('_', ' ')}
                    </span>
                    {savedJob.job.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-[10px] sm:text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                    {savedJob.job.description}
                  </p>

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Link
                        href={`/jobs/${savedJob.job.id}`}
                        className="flex-1 sm:flex-none text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
                      >
                        View Details
                      </Link>
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterType === 'ALL'
                ? 'No saved jobs yet'
                : `No saved ${filterType.toLowerCase()}s found`}
            </h3>
            <p className="text-gray-500 mb-6 px-4">
              Jobs you save will appear here for easy access.
            </p>
            <Link href="/jobs" className="text-blue-600 hover:underline font-medium">
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
