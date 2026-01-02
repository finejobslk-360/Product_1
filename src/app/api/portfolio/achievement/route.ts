import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, date, description } = body;

    if (!userId || !title) {
      return NextResponse.json({ error: 'User ID and Title are required' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const achievement = await prisma.achievement.create({
      data: {
        profileId: profile.id,
        title,
        date,
        description,
      },
    });

    return NextResponse.json(achievement);
  } catch (error: unknown) {
    console.error('Error adding achievement:', error);
    return NextResponse.json({ error: 'Failed to add achievement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
    }

    await prisma.achievement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
