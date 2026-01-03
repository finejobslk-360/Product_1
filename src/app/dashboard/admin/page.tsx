'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Briefcase,
  Ticket,
  TrendingUp,
  AlertCircle,
  Clock,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
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
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats?range=month');
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
  }, []);

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
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform overview, key metrics, and quick access to management sections.
          </p>
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
                {stats.overview.newUsersThisPeriod} new this month
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
                Open Tickets
              </p>
              <p className="mt-2 text-2xl font-semibold">{stats.overview.openTickets}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Total Revenue
              </p>
              <p className="mt-2 text-2xl font-semibold">
                ${stats.overview.totalRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard/admin/admins"
              className="rounded-xl border border-border bg-card p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Admin Management</p>
                  <p className="text-xs text-muted-foreground">Manage admin accounts</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/admin/employers"
              className="rounded-xl border border-border bg-card p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Employer Management</p>
                  <p className="text-xs text-muted-foreground">Manage employer accounts</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/admin/companies"
              className="rounded-xl border border-border bg-card p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Company Management</p>
                  <p className="text-xs text-muted-foreground">Manage companies</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/admin/gigs"
              className="rounded-xl border border-border bg-card p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Gig Management</p>
                  <p className="text-xs text-muted-foreground">Manage freelance gigs</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/admin/tickets"
              className="rounded-xl border border-border bg-card p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Support Tickets</p>
                  <p className="text-xs text-muted-foreground">Handle support requests</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {stats.overview.newUsersThisPeriod} new users registered
                    </p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {stats.overview.newJobsThisPeriod} new jobs posted
                    </p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-semibold mb-4">System Alerts</h2>
              <div className="space-y-3">
                {stats.overview.openTickets > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {stats.overview.openTickets} open support tickets
                      </p>
                      <p className="text-xs text-muted-foreground">Requires attention</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System running normally</p>
                    <p className="text-xs text-muted-foreground">All services operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
