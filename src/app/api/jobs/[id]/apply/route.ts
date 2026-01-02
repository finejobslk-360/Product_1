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
    const body = await request.json();
    const { message } = body;

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_seekerId: {
          jobId: id,
          seekerId: user.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        jobId: id,
        seekerId: user.id,
        message,
        status: 'PENDING',
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
