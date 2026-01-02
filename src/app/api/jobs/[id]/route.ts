import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();

    let isSaved = false;
    let isApplied = false;

    if (session) {
      const user = await prisma.user.findUnique({
        where: { firebaseUid: session.uid },
      });

      if (user) {
        const savedJob = await prisma.savedJob.findUnique({
          where: {
            userId_jobId: {
              userId: user.id,
              jobId: id,
            },
          },
        });
        if (savedJob) {
          isSaved = true;
        }

        const application = await prisma.application.findUnique({
          where: {
            jobId_seekerId: {
              jobId: id,
              seekerId: user.id,
            },
          },
        });
        if (application) {
          isApplied = true;
        }
      }
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            profile: {
              select: {
                fullName: true,
                profileImageUrl: true,
              },
            },
            email: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ ...job, isSaved, isApplied });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
