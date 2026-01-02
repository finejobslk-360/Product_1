'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { CVData } from '@/types/cv';
import { revalidatePath } from 'next/cache';

export async function saveCV(data: CVData, templateId: string, title: string) {
  try {
    const session = await getSession();
    if (!session || !session.uid) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: session.uid },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Create or update CV
    // For now, we'll just create a new one every time or you might want to update if an ID is passed
    // But the requirement says "save it in database", so creating a new entry is safe.

    const cv = await prisma.cV.create({
      data: {
        userId: user.id,
        title: title || 'My CV',
        templateId: templateId,
        content: data as Prisma.InputJsonValue,
      },
    });

    revalidatePath('/user/buildcv');
    revalidatePath('/user'); // Revalidate profile page
    return { success: true, cvId: cv.id };
  } catch (error: unknown) {
    console.error('Error saving CV:', error);
    return { success: false, error: 'Failed to save CV' };
  }
}

export async function getCVs() {
  try {
    const session = await getSession();
    if (!session || !session.uid) {
      return [];
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: session.uid },
    });

    if (!user) {
      return [];
    }

    const cvs = await prisma.cV.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return cvs;
  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    return [];
  }
}
