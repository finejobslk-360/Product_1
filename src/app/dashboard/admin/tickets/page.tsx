'use client';

import { useState, useEffect } from 'react';
import { Search, Ticket, AlertCircle, CheckCircle, Clock, Eye } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';

interface SupportTicket {
  id: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    profile: {
      fullName: string | null;
    } | null;
  };
}

export default function SupportTicketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/tickets?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTickets(data.tickets);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) fetchTickets();
      else setPage(1);
    }, 500);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleAction = async (ticketId: string, action: string, status?: string) => {
    try {
      const response = await fetch('/api/admin/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, action, status }),
      });
      if (response.ok) fetchTickets();
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Ticket className="w-4 h-4 text-gray-600" />;
    }
  };

  const columns = [
    {
      header: 'Ticket ID',
      accessor: (row: SupportTicket) => (
        <span className="text-sm font-mono">#{row.id.slice(0, 8)}</span>
      ),
    },
    {
      header: 'User',
      accessor: (row: SupportTicket) => (
        <div>
          <p className="text-sm font-medium">{row.user.profile?.fullName || 'No Name'}</p>
          <p className="text-xs text-muted-foreground">{row.user.email}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (row: SupportTicket) => <span className="text-sm">{row.category}</span>,
    },
    {
      header: 'Description',
      accessor: (row: SupportTicket) => (
        <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">{row.description}</p>
      ),
      className: 'max-w-md',
    },
    {
      header: 'Status',
      accessor: (row: SupportTicket) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <span className="text-sm capitalize">{row.status.replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (row: SupportTicket) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: SupportTicket) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTicket(row);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          {row.status === 'open' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, 'assign');
              }}
              className="px-2 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              Assign
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
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Support Tickets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage customer support tickets, resolve issues, and track support metrics.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets..."
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
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Open Tickets
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.open}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            In Progress
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Resolved
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.resolved}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Closed
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.closed}</p>
        </div>
      </div>

      <DataTable
        data={tickets}
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

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Ticket Details</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Category</p>
                <p className="mt-1 text-sm">{selectedTicket.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Description</p>
                <p className="mt-1 text-sm">{selectedTicket.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
                <p className="mt-1 text-sm capitalize">{selectedTicket.status.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">User</p>
                <p className="mt-1 text-sm">
                  {selectedTicket.user.profile?.fullName || 'No Name'} ({selectedTicket.user.email})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
