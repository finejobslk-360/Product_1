import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, issuer, date, url } = body;

    if (!userId || !name || !issuer) {
      return NextResponse.json({ error: 'User ID, Name and Issuer are required' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const certificate = await prisma.certificate.create({
      data: {
        profileId: profile.id,
        name,
        issuer,
        date,
        url,
      },
    });

    return NextResponse.json(certificate);
  } catch (error: unknown) {
    console.error('Error adding certificate:', error);
    return NextResponse.json({ error: 'Failed to add certificate' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    await prisma.certificate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
