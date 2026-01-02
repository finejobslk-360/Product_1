import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    // Check if already saved
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          jobId: id,
          userId: user.id,
        },
      },
    });

    if (existingSavedJob) {
      // Toggle save (unsave)
      await prisma.savedJob.delete({
        where: {
          id: existingSavedJob.id,
        },
      });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedJob.create({
        data: {
          jobId: id,
          userId: user.id,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
