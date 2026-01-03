import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: session.uid },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('range') || 'month';

    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const [
      totalRevenue,
      subscriptionRevenue,
      transactionFees,
      pendingPayments,
      revenueThisPeriod,
      revenueData,
    ] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'completed',
          // You might need to add a payment type field
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'completed',
          // Transaction fees calculation
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'pending' },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'completed',
          createdAt: { gte: startDate },
        },
      }),
      // Get daily revenue for chart
      (async () => {
        const data = [];
        const days =
          timeRange === 'week'
            ? 7
            : timeRange === 'month'
              ? 30
              : timeRange === 'quarter'
                ? 90
                : 365;
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const result = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
              status: 'completed',
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
          });

          data.push({
            date: date.toISOString().split('T')[0],
            amount: result._sum.amount || 0,
          });
        }
        return data;
      })(),
    ]);

    // Get recent transactions
    const recentTransactions = await prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        // You might need to add relations
      },
    });

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue._sum.amount || 0,
        subscriptionRevenue: subscriptionRevenue._sum.amount || 0,
        transactionFees: transactionFees._sum.amount || 0,
        pendingPayments: pendingPayments._sum.amount || 0,
        revenueThisPeriod: revenueThisPeriod._sum.amount || 0,
      },
      chartData: await revenueData,
      recentTransactions,
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
