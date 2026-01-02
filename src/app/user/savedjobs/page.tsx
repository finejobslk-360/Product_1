// app/saved-jobs/page.tsx (or wherever your page is located)
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SavedJobsClient from '../components/SavedJobsClient'; // Adjust path if needed

export default async function SavedJobsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/siginin');
  }

  const user = await prisma.user.findUnique({
    where: { firebaseUid: session.uid },
    include: {
      savedJobs: {
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

  return <SavedJobsClient initialJobs={user.savedJobs} />;
}
