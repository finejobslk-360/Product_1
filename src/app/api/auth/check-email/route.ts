import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || '';

    if (!email) return NextResponse.json({ exists: false });

    if (!process.env.DATABASE_URL) {
      // If no DB configured, we can't check - return false
      return NextResponse.json({ exists: false });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error in /api/auth/check-email:', error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
