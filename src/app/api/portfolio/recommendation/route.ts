import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, date, text, image } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        profileId: profile.id,
        name,
        date,
        text,
        image,
      },
    });

    return NextResponse.json(recommendation);
  } catch (error: unknown) {
    console.error('Error adding recommendation:', error);
    return NextResponse.json({ error: 'Failed to add recommendation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Recommendation ID is required' }, { status: 400 });
  }

  try {
    await prisma.recommendation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting recommendation:', error);
    return NextResponse.json({ error: 'Failed to delete recommendation' }, { status: 500 });
  }
}
