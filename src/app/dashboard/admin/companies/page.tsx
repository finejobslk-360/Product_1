'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';

interface Company {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  activeJobs: number;
  totalJobs: number;
  createdAt: string;
  profileImageUrl: string | null;
}

export default function CompanyManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pendingVerification: 0,
    activeJobPostings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (searchTerm) params.append('search', searchTerm);
      if (verifiedFilter !== 'all') params.append('verified', verifiedFilter);

      const response = await fetch(`/api/admin/companies?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCompanies(data.companies);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, verifiedFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) fetchCompanies();
      else setPage(1);
    }, 500);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const columns = [
    {
      header: 'Company',
      accessor: (row: Company) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-semibold">
            {row.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Verification',
      accessor: (row: Company) => (
        <div className="flex items-center gap-2">
          {row.verified ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700">Verified</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-700">Pending</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: 'Jobs',
      accessor: (row: Company) => (
        <div>
          <p className="text-sm font-medium">{row.activeJobs} active</p>
          <p className="text-xs text-muted-foreground">{row.totalJobs} total</p>
        </div>
      ),
    },
    {
      header: 'Registered',
      accessor: (row: Company) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: () => (
        <button className="p-1.5 rounded-lg hover:bg-gray-100">
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Company Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage company profiles, verify businesses, and handle company-related operations.
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="true">Verified</option>
          <option value="false">Pending</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Companies
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Verified
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.verified}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Pending
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.pendingVerification}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active Jobs
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.activeJobPostings}</p>
        </div>
      </div>

      <DataTable
        data={companies}
        columns={columns}
        loading={loading}
        pagination={{
          page,
          limit: 10,
          total: pagination.total,
          totalPages: pagination.totalPages,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
