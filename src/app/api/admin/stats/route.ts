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

    // Calculate date range
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

    // Get all stats
    const [
      totalUsers,
      totalJobSeekers,
      totalEmployers,
      activeJobs,
      totalApplications,
      openTickets,
      totalRevenue,
      newUsersThisPeriod,
      newJobsThisPeriod,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'JOB_SEEKER' } }),
      prisma.user.count({ where: { role: 'EMPLOYER' } }),
      prisma.job.count({ where: { status: 'active' } }),
      prisma.application.count(),
      prisma.ticket.count({ where: { status: { in: ['open', 'in_progress'] } } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.job.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Get user growth data (last 30 days)
    const userGrowthData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      userGrowthData.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }

    // Get job postings trend
    const jobTrendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await prisma.job.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      jobTrendData.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }

    // Get jobs by category
    const jobsByCategory = await prisma.job.groupBy({
      by: ['type'],
      _count: true,
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        activeJobs,
        totalApplications,
        openTickets,
        totalRevenue: totalRevenue._sum.amount || 0,
        newUsersThisPeriod,
        newJobsThisPeriod,
      },
      charts: {
        userGrowth: userGrowthData,
        jobTrend: jobTrendData,
        jobsByCategory: jobsByCategory.map((item) => ({
          category: item.type,
          count: item._count,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
