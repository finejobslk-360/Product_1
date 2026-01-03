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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { firebaseUid: session.uid },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const verified = searchParams.get('verified');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {
      role: 'EMPLOYER',
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
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
            select: { id: true },
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

    // Get stats
    const stats = {
      total: await prisma.user.count({ where: { role: 'EMPLOYER' } }),
      active: await prisma.user.count({ where: { role: 'EMPLOYER', isActive: true } }),
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
    };

    return NextResponse.json({
      employers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching employers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let updateData: Prisma.UserUpdateInput = {};

    switch (action) {
      case 'verify':
        updateData = {
          profile: {
            update: {
              onboardingCompleted: true,
            },
          },
        };
        break;
      case 'unverify':
        updateData = {
          profile: {
            update: {
              onboardingCompleted: false,
            },
          },
        };
        break;
      case 'activate':
        updateData = { isActive: true };
        break;
      case 'deactivate':
        updateData = { isActive: false };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        profile: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating employer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
