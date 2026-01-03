'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: string;
  status: string;
  createdAt: string;
  _count: {
    bids: number;
  };
}

export default function GigManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalBids: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/gigs?${params}`);
      const data = await response.json();

      if (response.ok) {
        setGigs(data.gigs);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) fetchGigs();
      else setPage(1);
    }, 500);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleAction = async (gigId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/gigs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gigId, action }),
      });
      if (response.ok) fetchGigs();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const columns = [
    {
      header: 'Gig Title',
      accessor: (row: Gig) => (
        <div>
          <p className="text-sm font-medium">{row.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.description}</p>
        </div>
      ),
      className: 'max-w-md',
    },
    {
      header: 'Budget',
      accessor: (row: Gig) => <span className="text-sm font-medium">{row.budget}</span>,
    },
    {
      header: 'Status',
      accessor: (row: Gig) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'open'
              ? 'bg-green-100 text-green-700'
              : row.status === 'completed'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Bids',
      accessor: (row: Gig) => <span className="text-sm">{row._count.bids}</span>,
    },
    {
      header: 'Posted',
      accessor: (row: Gig) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Gig) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-gray-100">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          {row.status === 'open' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, 'complete');
              }}
              className="p-1.5 rounded-lg hover:bg-green-100"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
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
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Gig Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage all freelance projects, gigs, and freelance-related activities.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gigs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Gigs
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active Gigs
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Bids
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.totalBids}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Completed
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.completed}</p>
        </div>
      </div>

      <DataTable
        data={gigs}
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
