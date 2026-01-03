'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Eye, Plus, Trash2, Edit2 } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';

interface Admin {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  profile: {
    fullName: string | null;
    profileImageUrl: string | null;
    onboardingCompleted: boolean;
  } | null;
}

export default function AdminManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    firebaseUid: '',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/admins?${params}`);
      const data = await response.json();

      if (response.ok) {
        setAdmins(data.admins);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) {
        fetchAdmins();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleAction = async (adminId: string, action: string) => {
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
          return;
        }
        const response = await fetch(`/api/admin/admins?id=${adminId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchAdmins();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to delete admin');
        }
      } else {
        const response = await fetch('/api/admin/admins', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminId, action }),
        });

        if (response.ok) {
          fetchAdmins();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to perform action');
        }
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert('An error occurred');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ email: '', fullName: '', firebaseUid: '' });
        fetchAdmins();
        alert('Admin created successfully');
      } else {
        alert(data.error || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('An error occurred');
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: selectedAdmin.id,
          action: 'update',
          data: { fullName: formData.fullName },
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedAdmin(null);
        fetchAdmins();
        alert('Admin updated successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update admin');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('An error occurred');
    }
  };

  const columns = [
    {
      header: 'Admin',
      accessor: (row: Admin) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
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
      accessor: (row: Admin) => (
        <div className="flex items-center gap-2">
          {row.isActive ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              Active
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
              <UserX className="w-3 h-3" />
              Inactive
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (row: Admin) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Admin) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAdmin(row);
              setShowDetailsModal(true);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAdmin(row);
              setFormData({
                email: row.email,
                fullName: row.profile?.fullName || '',
                firebaseUid: '',
              });
              setShowEditModal(true);
            }}
            className="p-1.5 rounded-lg hover:bg-blue-100"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
          {row.isActive ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.id, 'deactivate');
              }}
              className="p-1.5 rounded-lg hover:bg-orange-100"
              title="Deactivate"
            >
              <UserX className="w-4 h-4 text-orange-600" />
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(row.id, 'delete');
            }}
            className="p-1.5 rounded-lg hover:bg-red-100"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage admin accounts, create new admins, and control access permissions.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ email: '', fullName: '', firebaseUid: '' });
            setShowCreateModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search admins by name or email..."
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total Admins
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active Admins
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Inactive Admins
          </p>
          <p className="mt-2 text-2xl font-semibold">{stats.inactive}</p>
        </div>
      </div>

      {/* Admins Table */}
      <DataTable
        data={admins}
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
          setSelectedAdmin(row);
          setShowDetailsModal(true);
        }}
      />

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Create New Admin</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Firebase UID *</label>
                <input
                  type="text"
                  required
                  value={formData.firebaseUid}
                  onChange={(e) => setFormData({ ...formData, firebaseUid: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Firebase User UID"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  The Firebase UID of the user to be made admin
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Edit Admin</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmin(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-gray-50"
                />
                <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAdmin(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Update Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Admin Details</h2>
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
                <p className="mt-1 text-sm">{selectedAdmin.profile?.fullName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Email</p>
                <p className="mt-1 text-sm">{selectedAdmin.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Status</p>
                <p className="mt-1 text-sm">{selectedAdmin.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Role</p>
                <p className="mt-1 text-sm">Administrator</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Created</p>
                <p className="mt-1 text-sm">{new Date(selectedAdmin.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
