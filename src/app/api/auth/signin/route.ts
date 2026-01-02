import { NextRequest, NextResponse } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '@/lib/firebaseAdmin';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  createSessionCookieValue,
} from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

type SignInPayload = {
  idToken?: string;
};

export async function POST(request: NextRequest) {
  try {
    let body: SignInPayload;
    try {
      body = (await request.json()) as SignInPayload;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
    }

    // Verify the Firebase ID token
    let decodedToken: DecodedIdToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (firebaseError) {
      const message =
        firebaseError instanceof Error ? firebaseError.message : 'Unknown authentication error';
      console.error('Firebase token verification error:', firebaseError);
      return NextResponse.json(
        { error: `Invalid authentication token: ${message}` },
        { status: 401 }
      );
    }

    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email || '';
    const name = decodedToken.name || email.split('@')[0] || 'User';

    const sessionCookie = await createSessionCookieValue(idToken);

    // Try to find user in database
    let dbUser = null;

    // Only attempt database operations if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      try {
        dbUser = await prisma.user.findUnique({
          where: { firebaseUid },
          include: { profile: true },
        });
      } catch (dbError) {
        console.error('Database query error:', dbError);
        // Continue with basic user object if DB query fails
      }
    } else {
      console.warn(
        'DATABASE_URL not set - skipping database query. User authenticated in Firebase only.'
      );
    }

    // Get role from database
    const userRole: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN' = dbUser?.role || 'JOB_SEEKER';

    // Basic user shape compatible with the frontend expectations
    const user = {
      id: dbUser?.id || firebaseUid,
      email,
      role: userRole,
      profile: {
        fullName: dbUser?.profile?.fullName || name,
        onboardingCompleted: dbUser?.profile?.onboardingCompleted || false,
      },
    };

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign in';
    console.error('Sign in error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
