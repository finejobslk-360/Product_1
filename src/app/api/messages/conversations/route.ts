import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // Format the response
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find((p) => p.userId !== user.id)?.user;
      const lastMessage = conv.messages[0];

      return {
        id: conv.id,
        otherParticipant: otherParticipant
          ? {
              id: otherParticipant.id,
              name: otherParticipant.profile?.fullName || otherParticipant.email,
              avatar: otherParticipant.profile?.profileImageUrl,
              role: otherParticipant.role,
            }
          : null,
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderId: lastMessage.senderId,
            }
          : null,
        updatedAt: conv.updatedAt,
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only EMPLOYER (Job Poster) or ADMIN can start conversations
  if (user.role !== 'EMPLOYER' && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only employers can start conversations' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { recipientId } = body;

    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient ID is required' }, { status: 400 });
    }

    // Check if conversation already exists
    // This query is a bit tricky in Prisma to ensure EXACTLY these two participants,
    // but checking if there is a conversation where both are participants is usually enough for 1-on-1
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json({ id: existingConversation.id });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: user.id }, { userId: recipientId }],
        },
      },
    });

    return NextResponse.json({ id: conversation.id });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
