import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type ProfileUpdate = {
  bio?: string;
  fullName?: string;
  profileImageUrl?: string;
  socialLinks?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, about, fullName, profileImageUrl, socialLinks } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: ProfileUpdate = {};
    if (about !== undefined) updateData.bio = about;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

    const profile = await prisma.profile.update({
      where: { userId },
      data: updateData,
    });

    return NextResponse.json(profile);
  } catch (error: unknown) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
