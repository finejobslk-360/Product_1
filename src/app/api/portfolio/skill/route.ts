import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skill } = body;

    if (!userId || !skill) {
      return NextResponse.json({ error: 'User ID and skill are required' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updatedSkills = [...profile.skills, skill];

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { skills: updatedSkills },
    });

    return NextResponse.json(updatedProfile.skills);
  } catch (error: unknown) {
    console.error('Error adding skill:', error);
    return NextResponse.json({ error: 'Failed to add skill' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, skill } = body;

    if (!userId || !skill) {
      return NextResponse.json({ error: 'User ID and skill are required' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updatedSkills = profile.skills.filter((s: string) => s !== skill);

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { skills: updatedSkills },
    });

    return NextResponse.json(updatedProfile.skills);
  } catch (error: unknown) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
