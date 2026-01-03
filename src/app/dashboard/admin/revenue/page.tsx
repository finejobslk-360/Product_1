'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Download } from 'lucide-react';

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState('month');
  const [revenue, setRevenue] = useState<{
    stats: {
      totalRevenue: number;
      subscriptionRevenue: number;
      transactionFees: number;
      pendingPayments: number;
      revenueThisPeriod: number;
    };
    chartData: Array<{ date: string; amount: number }>;
    recentTransactions: Array<{ createdAt: string; amount: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/revenue?range=${timeRange}`);
      const data = await response.json();
      if (response.ok) {
        setRevenue(data);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
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
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Revenue Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track platform revenue, payments, subscriptions, and financial analytics.
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

      {revenue && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Total Revenue
              </p>
              <p className="mt-2 text-2xl font-semibold">
                ${revenue.stats.totalRevenue.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />$
                {revenue.stats.revenueThisPeriod.toFixed(2)} this period
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subscription Revenue
              </p>
              <p className="mt-2 text-2xl font-semibold">
                ${revenue.stats.subscriptionRevenue.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Transaction Fees
              </p>
              <p className="mt-2 text-2xl font-semibold">
                ${revenue.stats.transactionFees.toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pending Payments
              </p>
              <p className="mt-2 text-2xl font-semibold">
                ${revenue.stats.pendingPayments.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold mb-4">Revenue Overview</h2>
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Revenue chart will be displayed here. Data available:{' '}
                {revenue.chartData?.length || 0} data points
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Revenue by Source</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subscriptions</span>
                  <span className="text-sm font-medium">
                    ${revenue.stats.subscriptionRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Fees</span>
                  <span className="text-sm font-medium">
                    ${revenue.stats.transactionFees.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {revenue.recentTransactions?.slice(0, 5).map((tx, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                    <span className="font-medium">${tx.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
