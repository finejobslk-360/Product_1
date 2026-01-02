import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if DATABASE_URL is set before attempting database operations
    if (!process.env.DATABASE_URL) {
      // If database is not configured, allow admin signup (no admin exists yet)
      return NextResponse.json({
        adminExists: false,
      });
    }

    // Check if admin user exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    return NextResponse.json({
      adminExists: !!adminExists,
    });
  } catch (error) {
    console.error('Error checking admin:', error);
    // On error, assume no admin exists (safer to allow signup)
    return NextResponse.json({
      adminExists: false,
    });
  }
}
