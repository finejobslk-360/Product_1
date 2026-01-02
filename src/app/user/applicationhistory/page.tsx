// app/applications/page.tsx (or your specific path)
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ApplicationHistoryClient from '../components/ApplicationHistoryClient'; // Adjust path as needed

export default async function ApplicationHistoryPage() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/siginin');
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: session.uid },
    include: {
      applications: {
        include: {
          job: {
            include: {
              employer: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    redirect('/auth/siginin');
  }

  return <ApplicationHistoryClient initialApplications={user.applications} />;
}
