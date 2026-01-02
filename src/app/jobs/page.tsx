'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import Link from 'next/link';

// Define Job interface based on API response
interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  experienceLevel: string;
  salaryRange: string | null;
  tags: string[];
  createdAt: string;
  employer: {
    profile: {
      fullName: string;
      profileImageUrl: string | null;
    } | null;
    email: string;
  };
}

interface Filters {
  jobType: string;
  location: string;
  experience: string;
  dateAdded: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    jobType: 'All Types',
    location: '',
    experience: 'Any Level',
    dateAdded: 'Any Time',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    if (
      filters.jobType !== 'All Types' &&
      job.type !== filters.jobType.toUpperCase().replace(' ', '_')
    )
      return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false;
    if (
      filters.experience !== 'Any Level' &&
      job.experienceLevel !== filters.experience.toUpperCase().replace(' ', '_')
    )
      return false;

    if (filters.dateAdded !== 'Any Time') {
      const jobDate = new Date(job.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - jobDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filters.dateAdded === 'Past 24 hours' && diffDays > 1) return false;
      if (filters.dateAdded === 'Past Week' && diffDays > 7) return false;
      if (filters.dateAdded === 'Past Month' && diffDays > 30) return false;
    }

    return true;
  });

  // Sort by Date Added (Newest first)
  const sortedJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const recommendedJobs = sortedJobs.slice(0, 2);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option>All Types</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="FREELANCE">Freelance</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Any Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option>Any Level</option>
            <option value="ENTRY_LEVEL">Entry Level</option>
            <option value="MID_LEVEL">Mid Level</option>
            <option value="SENIOR">Senior Level</option>
          </select>
        </div>

        {/* Date Added Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date Added</label>
          <select
            value={filters.dateAdded}
            onChange={(e) => handleFilterChange('dateAdded', e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option>Any Time</option>
            <option>Past 24 hours</option>
            <option>Past Week</option>
            <option>Past Month</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Listings</h1>

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <JobCard key={`rec-${job.id}`} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* All Jobs */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Jobs</h2>
          <div className="space-y-4">
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {job.employer?.profile?.fullName || job.employer?.email || 'Unknown Company'} |{' '}
                  {job.location}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map((req, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
                >
                  {req}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {job.type.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
