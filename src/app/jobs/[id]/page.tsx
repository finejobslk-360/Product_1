'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search, Leaf, X, Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/lib/firebaseClient';

// Define Job interface
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
  isSaved?: boolean;
  isApplied?: boolean;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (params.id) {
      const fetchJob = async () => {
        try {
          const response = await fetch(`/api/jobs/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            setJob(data);
            if (data.isSaved) {
              setIsSaved(true);
            }
            if (data.isApplied) {
              setIsApplied(true);
            }
          } else {
            console.error('Job not found');
          }
        } catch (error) {
          console.error('Error fetching job:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [params.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in to apply');
        return;
      }
      const token = await user.getIdToken();
      const response = await fetch(`/api/jobs/${job?.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: 'Applied via portal' }), // Can add cover letter here
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Error applying');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in to save jobs');
        return;
      }
      const token = await user.getIdToken();
      const response = await fetch(`/api/jobs/${job?.id}/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
        alert(data.saved ? 'Job saved!' : 'Job removed from saved list');
      } else {
        alert('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <Link href="/jobs" className="text-blue-600 hover:underline">
          Return to Job Listings
        </Link>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <nav className="border-b sticky top-0 bg-white z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <span className="text-xl font-bold text-gray-900">360 Technologies</span>
                <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
                  <Link href="/" className="hover:text-gray-900">
                    Home
                  </Link>
                  <Link href="/jobs" className="text-yellow-600">
                    Jobs
                  </Link>
                  <Link href="#" className="hover:text-gray-900">
                    My Saved Jobs
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-100 block w-full pl-10 pr-3 py-2 border-none rounded-md text-sm focus:ring-1 focus:ring-gray-200"
                  />
                </div>
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src="https://ui-avatars.com/api/?name=User&background=random"
                    alt="User"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Your application for the position of <span className="font-semibold">{job.title}</span>{' '}
            at <span className="font-semibold">{job.employer?.profile?.fullName || 'Company'}</span>{' '}
            has been successfully submitted. You will receive an email confirmation shortly with
            further details.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => router.push('/user/applicationhistory')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              View Applied Jobs
            </button>
            <button
              onClick={() => router.push('/user/jobs')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
            >
              Return to Job Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 relative">
      {/* Navigation Bar */}
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold text-gray-900">360 Technologies</span>
              <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
                <Link href="/" className="hover:text-gray-900">
                  Home
                </Link>
                <Link href="/jobs" className="text-yellow-600">
                  Jobs
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  My Saved Jobs
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 block w-full pl-10 pr-3 py-2 border-none rounded-md text-sm focus:ring-1 focus:ring-gray-200"
                />
              </div>
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                {/* Placeholder for User Avatar */}
                <Image
                  src="https://ui-avatars.com/api/?name=User&background=random"
                  alt="User"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/jobs" className="hover:text-gray-900 cursor-pointer">
            Jobs
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Banner Image Placeholder */}
            <div className="w-full h-64 rounded-xl bg-gradient-to-r from-stone-600 via-stone-500 to-stone-400 shadow-sm relative overflow-hidden">
              {/* You could add a real image here if available */}
            </div>

            {/* Header Info */}
            <div>
              <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
                <span className="font-medium text-gray-700">
                  {job.employer?.profile?.fullName || 'Company'}
                </span>
                <span>•</span>
                <span>{job.location}</span>
              </div>
              <div className="text-xs text-gray-400 mb-6">
                {new Date(job.createdAt).toLocaleDateString()} • {job.type.replace('_', ' ')}
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200">
                <button className="pb-3 border-b-2 border-black font-semibold text-sm">
                  About
                </button>
                <button className="pb-3 text-gray-500 font-medium text-sm hover:text-gray-800">
                  People
                </button>
              </div>
            </div>

            {/* Job Description */}
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-3">About the job</h2>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {/* Requirements/Tags */}
              <div>
                <h3 className="text-lg font-bold mb-3">Skills & Requirements</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Card */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-4 sticky top-24">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {job.employer?.profile?.fullName || 'Company'}
                  </p>
                  <h3 className="font-bold text-lg">
                    {job.employer?.profile?.fullName || 'Company'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Technology, Information and Internet</p>
                </div>
                <div className="w-12 h-12 bg-emerald-900 rounded flex items-center justify-center text-white overflow-hidden">
                  <Leaf className="w-6 h-6" />
                </div>
              </div>

              <button
                onClick={() => setShowApplyModal(true)}
                disabled={isApplied}
                className={`w-full font-semibold py-2.5 rounded-lg transition-colors text-sm ${
                  isApplied
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isApplied ? 'Applied' : 'Apply'}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 font-medium py-2 rounded-lg transition-colors text-sm ${isSaved ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors text-sm">
                  Report job
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleApply}>
                <div className="space-y-6">
                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resume</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag and drop or <span className="text-blue-600 font-medium">browse</span>
                      </p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
