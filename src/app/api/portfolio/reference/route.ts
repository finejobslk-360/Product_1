import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, position, company, email, phone } = body;

    if (!userId || !name) {
      return NextResponse.json({ error: 'User ID and Name are required' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const reference = await prisma.reference.create({
      data: {
        profileId: profile.id,
        name,
        position,
        company,
        email,
        phone,
      },
    });

    return NextResponse.json(reference);
  } catch (error: unknown) {
    console.error('Error adding reference:', error);
    return NextResponse.json({ error: 'Failed to add reference' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
    }

    await prisma.reference.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting reference:', error);
    return NextResponse.json({ error: 'Failed to delete reference' }, { status: 500 });
  }
}
