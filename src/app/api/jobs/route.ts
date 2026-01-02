import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { prisma } from '@/lib/prisma';

// Define types locally to avoid issues if Prisma Client is not fully generated
type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'FREELANCE';
type ExperienceLevel = 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, description, type, location, experienceLevel, salaryRange, tags, expiryDate } =
      body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        type: type as JobType,
        location,
        experienceLevel: experienceLevel as ExperienceLevel,
        salaryRange,
        tags,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        employerId: user.id,
        status: 'active',
      },
    });

    return NextResponse.json(job);
  } catch (error: unknown) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
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
            id: true,
          },
        },
      },
    });
    return NextResponse.json(jobs);
  } catch (error: unknown) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
