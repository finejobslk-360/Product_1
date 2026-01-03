'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Download } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState<{
    overview: {
      totalUsers: number;
      totalJobSeekers: number;
      totalEmployers: number;
      activeJobs: number;
      totalApplications: number;
      openTickets: number;
      totalRevenue: number;
      newUsersThisPeriod: number;
      newJobsThisPeriod: number;
    };
    charts: {
      userGrowth: Array<{ date: string; count: number }>;
      jobTrend: Array<{ date: string; count: number }>;
      jobsByCategory: Array<{ category: string; count: number }>;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats?range=${timeRange}`);
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comprehensive platform analytics, user metrics, and performance insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Total Users
              </p>
              <p className="mt-2 text-2xl font-semibold">{stats.overview.totalUsers}</p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {stats.overview.newUsersThisPeriod} new this period
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Active Jobs
              </p>
              <p className="mt-2 text-2xl font-semibold">{stats.overview.activeJobs}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Applications
              </p>
              <p className="mt-2 text-2xl font-semibold">{stats.overview.totalApplications}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Open Tickets
              </p>
              <p className="mt-2 text-2xl font-semibold">{stats.overview.openTickets}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-4">User Growth</h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Chart will be displayed here. Data available: {stats.charts.userGrowth.length}{' '}
                  data points
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold mb-4">Job Postings Trend</h3>
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Chart will be displayed here. Data available: {stats.charts.jobTrend.length} data
                  points
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">User Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Job Seekers</span>
                  <span className="text-sm font-medium">{stats.overview.totalJobSeekers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Employers</span>
                  <span className="text-sm font-medium">{stats.overview.totalEmployers}</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Jobs by Category</h3>
              <div className="space-y-2">
                {stats.charts.jobsByCategory?.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Platform Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New Jobs</span>
                  <span className="text-sm font-medium">{stats.overview.newJobsThisPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New Users</span>
                  <span className="text-sm font-medium">{stats.overview.newUsersThisPeriod}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
