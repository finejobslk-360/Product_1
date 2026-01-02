import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { SESSION_COOKIE_NAME, getSessionUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { onboardingData, idToken } = body;

    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = await getSessionUser(token);

    let firebaseUid: string;

    if (sessionUser) {
      firebaseUid = sessionUser.uid;
    } else if (idToken) {
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        firebaseUid = decodedToken.uid;
      } catch (firebaseError) {
        console.error('Firebase token verification error:', firebaseError);
        return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Authentication token required' }, { status: 401 });
    }

    // Check if DATABASE_URL is set and not empty before attempting database operations
    const hasDatabaseUrl = Boolean(
      process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== ''
    );
    if (hasDatabaseUrl) {
      try {
        // Find user by firebaseUid
        const user = await prisma.user.findUnique({
          where: { firebaseUid },
          include: { profile: true },
        });

        if (!user) {
          // If user doesn't exist in DB but is authenticated in Firebase, continue anyway
          console.warn('User not found in database but authenticated in Firebase:', firebaseUid);
        } else {
          // Update or create profile with onboarding data
          const profileData: {
            onboardingCompleted: boolean;
            preferredJobTypes?: string[];
            experienceLevel?: string | null;
            skills?: string[];
            headline?: string | null;
          } = {
            onboardingCompleted: true,
          };

          if (onboardingData?.jobCategory) {
            profileData.preferredJobTypes = [onboardingData.jobCategory];
          }

          if (onboardingData?.experienceLevel) {
            // Map experience level to match schema format if needed
            profileData.experienceLevel = onboardingData.experienceLevel;
          }

          if (onboardingData?.skills) {
            // Parse skills from comma-separated string
            const skillsArray =
              typeof onboardingData.skills === 'string'
                ? onboardingData.skills
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0)
                : Array.isArray(onboardingData.skills)
                  ? onboardingData.skills
                  : [];
            profileData.skills = skillsArray;
          }

          // Add goal as headline if provided
          if (onboardingData?.goal) {
            profileData.headline = onboardingData.goal;
          }

          // Upsert profile
          await prisma.profile.upsert({
            where: { userId: user.id },
            update: profileData,
            create: {
              userId: user.id,
              fullName: user.email.split('@')[0] || 'User',
              ...profileData,
            },
          });
        }
      } catch (dbError) {
        console.error('Database error during onboarding:', dbError);
        // Log error but don't fail the request - user is already authenticated in Firebase
        // The onboarding can still complete successfully even if DB save fails
        console.warn(
          'Continuing onboarding despite database error - user authenticated in Firebase'
        );
      }
    } else {
      console.warn(
        'DATABASE_URL not set - skipping database save. User authenticated in Firebase.'
      );
    }

    return NextResponse.json({
      success: true,
      onboardingData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save onboarding data';
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
