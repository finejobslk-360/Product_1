import 'server-only';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function getUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid: session.uid },
      include: {
        profile: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
