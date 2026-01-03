'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';

interface Employer {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  profile: {
    fullName: string | null;
    profileImageUrl: string | null;
    onboardingCompleted: boolean;
  } | null;
  _count: {
    postedJobs: number;
  };
}

export default function EmployerManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
    pendingVerification: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchEmployers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (verifiedFilter !== 'all') params.append('verified', verifiedFilter);

      const response = await fetch(`/api/admin/employers?${params}`);
      const data = await response.json();

      if (response.ok) {
        setEmployers(data.employers);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching employers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, verifiedFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) {
        fetchEmployers();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleAction = async (employerId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/employers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: employerId, action }),
      });

      if (response.ok) {
        fetchEmployers();
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const columns = [
    {
      header: 'Employer',
      accessor: (row: Employer) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
            {row.profile?.fullName?.[0] || row.email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{row.profile?.fullName || 'No Name'}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: Employer) => (
        <div className="flex items-center gap-2">
          {row.isActive ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              Inactive
            </span>
          )}
          {row.profile?.onboardingCompleted ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-orange-600" />
          )}
        </div>
      ),
    },
    {
      header: 'Jobs Posted',
      accessor: (row: Employer) => <span className="text-sm">{row._count.postedJobs}</span>,
    },
    {
      header: 'Joined',
      accessor: (row: Employer) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Employer) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEmployer(row);
              setShowDetailsModal(true);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          {!row.profile?.onboardingCompleted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, 'verify');
              }}
              className="p-1.5 rounded-lg hover:bg-green-100"
              title="Verify"
            >
              <UserCheck className="w-4 h-4 text-green-600" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, 'unverify');
              }}
              className="p-1.5 rounded-lg hover:bg-orange-100"
              title="Unverify"
            >
              <UserX className="w-4 h-4 text-orange-600" />
            </button>
          )}
          {row.isActive ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, 'deactivate');
              }}
              className="p-1.5 rounded-lg hover:bg-red-100"
              title="Deactivate"
            >
              <UserX className="w-4 h-4 text-red-600" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, 'activate');
              }}
              className="p-1.5 rounded-lg hover:bg-green-100"
              title="Activate"
            >
              <UserCheck className="w-4 h-4 text-green-600" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Employer Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all employer accounts, verify profiles, and monitor activity.
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employers by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Verification</option>
          <option value="true">Verified</option>
          <option value="false">Pending</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Employers
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active Employers
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Verified Accounts
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.verified}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Pending Verification
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.pendingVerification}</p>
        </div>
      </div>

      {/* Employers Table */}
      <DataTable
        data={employers}
        columns={columns}
        loading={loading}
        pagination={{
          page,
          limit: 10,
          total: pagination.total,
          totalPages: pagination.totalPages,
          onPageChange: setPage,
        }}
        onRowClick={(row) => {
          setSelectedEmployer(row);
          setShowDetailsModal(true);
        }}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Employer Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Name</p>
                <p className="mt-1 text-sm">{selectedEmployer.profile?.fullName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Email</p>
                <p className="mt-1 text-sm">{selectedEmployer.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
                <p className="mt-1 text-sm">
                  {selectedEmployer.isActive ? 'Active' : 'Inactive'} |{' '}
                  {selectedEmployer.profile?.onboardingCompleted
                    ? 'Verified'
                    : 'Pending Verification'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Jobs Posted</p>
                <p className="mt-1 text-sm">{selectedEmployer._count.postedJobs}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Joined</p>
                <p className="mt-1 text-sm">
                  {new Date(selectedEmployer.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
