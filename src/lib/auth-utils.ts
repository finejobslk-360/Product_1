import { NextRequest } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { prisma } from '@/lib/prisma';

export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });
    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
