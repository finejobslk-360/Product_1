'use server';

import { createSession, removeSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/firebaseAdmin';

export async function loginAction(idToken: string) {
  // 1. Verify the ID token first to get the UID and email
  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return { success: false, error: 'Invalid credentials' };
  }

  const firebaseUid = decodedToken.uid;
  const email = decodedToken.email || '';
  const name = decodedToken.name || email.split('@')[0] || 'User';
  const picture = decodedToken.picture || '';

  // 2. Sync user with database (Upsert)
  // We do this here to ensure the user exists in our DB before we set the session
  try {
    await prisma.user.upsert({
      where: { firebaseUid },
      update: { email },
      create: {
        firebaseUid,
        email,
        role: 'JOB_SEEKER', // Default role, logic might need adjustment if role is passed from client
        profile: {
          create: {
            fullName: name,
            profileImageUrl: picture,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error syncing user to DB:', error);
    // We might still want to proceed with session creation even if DB sync fails,
    // but usually we want the user in DB. For now, we proceed.
  }

  // 3. Create Session Cookie
  const success = await createSession(idToken);
  if (!success) {
    return { success: false, error: 'Failed to create session' };
  }

  // 4. Determine redirect path based on role (fetching from DB again to be sure of role)
  const user = await prisma.user.findUnique({ where: { firebaseUid } });
  let redirectPath = '/dashboard';

  if (user?.role === 'JOB_SEEKER') {
    redirectPath = '/user';
  }

  return { success: true, redirectPath };
}

export async function logoutAction() {
  await removeSession();
  redirect('/auth/siginin');
}
