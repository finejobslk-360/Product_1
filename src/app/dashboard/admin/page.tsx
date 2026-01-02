'use client';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            High-level controls for jobs, users, and platform health.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Total users
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
          <p className="mt-1 text-xs text-muted-foreground">Hook this up to real metrics later.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active jobs
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Reports
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
      </div>
    </div>
  );
}
