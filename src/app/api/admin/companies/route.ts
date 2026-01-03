import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import type { Prisma } from '@prisma/client';

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
    const search = searchParams.get('search') || '';
    const verified = searchParams.get('verified');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // For now, we'll get companies from employer users
    // In the future, you might have a separate Company model
    const where: Prisma.UserWhereInput = {
      role: 'EMPLOYER',
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (verified === 'true') {
      where.profile = { ...where.profile, onboardingCompleted: true };
    } else if (verified === 'false') {
      where.profile = { ...where.profile, onboardingCompleted: false };
    }

    const [employers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: {
            select: {
              fullName: true,
              profileImageUrl: true,
              onboardingCompleted: true,
            },
          },
          postedJobs: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          _count: {
            select: {
              postedJobs: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Transform to company-like structure
    const companies = employers.map((emp) => ({
      id: emp.id,
      name: emp.profile?.fullName || emp.email,
      email: emp.email,
      verified: emp.profile?.onboardingCompleted || false,
      activeJobs: emp.postedJobs.filter((j) => j.status === 'active').length,
      totalJobs: emp._count.postedJobs,
      createdAt: emp.createdAt,
      profileImageUrl: emp.profile?.profileImageUrl,
    }));

    const stats = {
      total: await prisma.user.count({ where: { role: 'EMPLOYER' } }),
      verified: await prisma.user.count({
        where: {
          role: 'EMPLOYER',
          profile: { onboardingCompleted: true },
        },
      }),
      pendingVerification: await prisma.user.count({
        where: {
          role: 'EMPLOYER',
          profile: { onboardingCompleted: false },
        },
      }),
      activeJobPostings: await prisma.job.count({
        where: { status: 'active', employer: { role: 'EMPLOYER' } },
      }),
    };

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
