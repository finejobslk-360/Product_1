import { NextRequest, NextResponse } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '@/lib/firebaseAdmin';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  createSessionCookieValue,
} from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

type SignupPayload = {
  idToken?: string;
  fullName?: string;
  email?: string;
  role?: string;
  onboardingData?: {
    jobCategory?: string;
    experience?: string;
    education?: string;
    location?: string;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupPayload;
    const { idToken, fullName, email, role, onboardingData } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
    }

    // Verify the Firebase ID token
    const decodedToken: DecodedIdToken = await auth.verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const userEmail = decodedToken.email || email;
    const userName = decodedToken.name || fullName || decodedToken.email?.split('@')[0] || 'User';

    const sessionCookie = await createSessionCookieValue(idToken);

    const resolvedEmail = (userEmail ?? '').toString();

    // Map role to match Prisma enum: JOB_SEEKER, EMPLOYER, ADMIN
    let resolvedRole: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN' = 'JOB_SEEKER';
    if (role) {
      const upperRole = role.toUpperCase();
      if (upperRole === 'EMPLOYER' || upperRole === 'ADMIN' || upperRole === 'JOB_SEEKER') {
        resolvedRole = upperRole as 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
      }
    }

    // Check if user already exists and create if needed
    let dbUser = null;

    // Only attempt database operations if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      try {
        // Check if user already exists
        dbUser = await prisma.user.findUnique({
          where: { firebaseUid },
          include: { profile: true },
        });

        // If trying to create admin, check if admin already exists
        if (!dbUser && resolvedRole === 'ADMIN') {
          const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
          });

          if (existingAdmin) {
            return NextResponse.json(
              { error: 'Admin account already exists. Only one admin account is allowed.' },
              { status: 403 }
            );
          }
        }

        // Create user if doesn't exist
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              firebaseUid,
              email: resolvedEmail,
              role: resolvedRole as 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN',
              profile: {
                create: {
                  fullName: userName,
                  onboardingCompleted: !!onboardingData,
                  preferredJobTypes: onboardingData?.jobCategory
                    ? [onboardingData.jobCategory]
                    : [],
                  experienceLevel: onboardingData?.experienceLevel || null,
                },
              },
            },
            include: { profile: true },
          });
        }
      } catch (dbError) {
        console.error('Database error during signup:', dbError);
        // If user already exists (unique constraint), try to fetch it
        if (
          dbError &&
          typeof dbError === 'object' &&
          'code' in dbError &&
          dbError.code === 'P2002'
        ) {
          try {
            dbUser = await prisma.user.findUnique({
              where: { firebaseUid },
              include: { profile: true },
            });
          } catch (fetchError) {
            console.error('Error fetching existing user:', fetchError);
          }
        }
      }
    } else {
      console.warn(
        'DATABASE_URL not set - skipping database operations. User will be authenticated in Firebase only.'
      );
    }

    const user = {
      id: dbUser?.id || firebaseUid,
      email: dbUser?.email || resolvedEmail,
      role: dbUser?.role || resolvedRole,
      profile: {
        fullName: dbUser?.profile?.fullName || userName,
        onboardingCompleted: dbUser?.profile?.onboardingCompleted || !!onboardingData,
        preferredJobTypes:
          dbUser?.profile?.preferredJobTypes ||
          (onboardingData?.jobCategory ? [onboardingData.jobCategory] : []),
        experienceLevel:
          dbUser?.profile?.experienceLevel || onboardingData?.experienceLevel || null,
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
    const message = error instanceof Error ? error.message : 'Failed to create account';
    console.error('Sign up error:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
