import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';
import { Job } from '@prisma/client';

export default async function UserJobsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/siginin');
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: session.uid },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Profile Incomplete</h2>
          <p className="text-yellow-700">Please complete your profile to see recommended jobs.</p>
          <Link href="/user" className="text-blue-600 hover:underline mt-2 inline-block">
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  const { experienceLevel, preferredJobTypes, skills } = user.profile;

  // Fetch all active jobs
  const jobs = await prisma.job.findMany({
    where: { status: 'active' },
    include: {
      employer: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Scoring Logic
  const scoredJobs = jobs.map((job) => {
    let score = 0;

    // Experience Match
    const normalizedProfileExp = experienceLevel?.toUpperCase().replace(' ', '_');
    if (normalizedProfileExp === job.experienceLevel) {
      score += 10;
    }

    // Job Type Match
    if (preferredJobTypes && preferredJobTypes.length > 0) {
      const jobTypeStr = job.type.toString();
      const match = preferredJobTypes.some(
        (pt) => pt.toUpperCase().replace(' ', '_') === jobTypeStr
      );
      if (match) score += 5;
    }

    // Skills Match
    if (skills && skills.length > 0) {
      const matchingTags = job.tags.filter((tag) =>
        skills.some((skill) => skill.toLowerCase() === tag.toLowerCase())
      );
      score += matchingTags.length * 2;
    }

    return { ...job, score };
  });

  // Sort by score desc
  scoredJobs.sort((a, b) => b.score - a.score);

  // Determine which jobs to show
  const recommendedThreshold = 1; // At least one match
  const goodMatches = scoredJobs.filter((j) => j.score >= recommendedThreshold);

  const displayJobs = goodMatches.length < 5 ? scoredJobs : goodMatches;

  return (
    // RESPONSIVE CHANGE: p-4 for mobile, p-6 for desktop
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recommended Jobs</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Based on your profile, skills, and preferences.
          </p>
        </div>

        {/* RESPONSIVE CHANGE: Button is full width on mobile, auto width on desktop */}
        <Link
          href="/jobs"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
        >
          View All Jobs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {displayJobs.length > 0 ? (
        <div className="grid gap-4">
          {displayJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 px-4">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t find any jobs matching your profile.
          </p>
          <Link href="/jobs" className="text-blue-600 hover:underline font-medium">
            Browse all available jobs
          </Link>
        </div>
      )}
    </div>
  );
}

function JobCard({
  job,
}: {
  job: Job & {
    employer: {
      profile: { fullName: string; profileImageUrl: string | null } | null;
      email: string;
    };
  };
}) {
  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300">
        {/* RESPONSIVE CHANGE: Flex column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-start justify-between mb-2">
              <div className="w-full">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 font-medium flex flex-wrap items-center gap-x-2">
                  <span>
                    {job.employer?.profile?.fullName || job.employer?.email || 'Unknown Company'}
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-gray-400 md:text-gray-500">{job.location}</span>
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium border border-gray-100"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 5 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-md font-medium border border-gray-100">
                  +{job.tags.length - 5} more
                </span>
              )}
            </div>

            {/* RESPONSIVE CHANGE: Added flex-wrap and gap-y-2 to handle small screens */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                <Clock className="w-3.5 h-3.5" />
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2 py-1 rounded">
                <Briefcase className="w-3.5 h-3.5" />
                {job.type.replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            </div>
          </div>

          {/* RESPONSIVE CHANGE: Button is full width on mobile (w-full), auto on desktop. 
              Removed self-center to allow button to stretch properly on mobile */}
          <div className="w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm text-center">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
