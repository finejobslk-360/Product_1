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
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: Prisma.FreelanceProjectWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [gigs, total] = await Promise.all([
      prisma.freelanceProject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          bids: {
            select: { id: true },
          },
          _count: {
            select: {
              bids: true,
            },
          },
        },
      }),
      prisma.freelanceProject.count({ where }),
    ]);

    const stats = {
      total: await prisma.freelanceProject.count(),
      active: await prisma.freelanceProject.count({ where: { status: 'open' } }),
      totalBids: await prisma.freelanceBid.count(),
      completed: await prisma.freelanceProject.count({ where: { status: 'completed' } }),
    };

    return NextResponse.json({
      gigs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching gigs:', error);
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
    const { gigId, action } = body;

    if (!gigId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let updateData: Prisma.FreelanceProjectUpdateInput = {};

    switch (action) {
      case 'approve':
        updateData = { status: 'open' };
        break;
      case 'reject':
        updateData = { status: 'closed' };
        break;
      case 'complete':
        updateData = { status: 'completed' };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedGig = await prisma.freelanceProject.update({
      where: { id: gigId },
      data: updateData,
    });

    return NextResponse.json({ success: true, gig: updatedGig });
  } catch (error) {
    console.error('Error updating gig:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
