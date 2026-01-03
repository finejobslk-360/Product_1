import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ authenticated: false });

    const user = await prisma.user.findUnique({
      where: { firebaseUid: session.uid },
      include: { profile: true },
    });

    if (!user) return NextResponse.json({ authenticated: false });

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
