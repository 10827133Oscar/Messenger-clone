import { NextResponse } from 'next/server';
import getCurrentUser from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?._id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      const newConversation = await Conversation.create({
        name,
        isGroup,
        userIds: [...members.map((member: { value: string }) => member.value), currentUser._id],
      });

      const populatedConversation = await Conversation.findById(newConversation._id)
        .populate({ path: 'userIds', model: User })
        .lean();

      (populatedConversation as any).userIds.forEach((user: any) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', populatedConversation);
        }
      });

      return NextResponse.json(populatedConversation);
    }

    const existingConversations = await Conversation.find({
      $or: [
        { userIds: { $all: [currentUser._id, userId] } },
        { userIds: { $all: [userId, currentUser._id] } },
      ],
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await Conversation.create({
      userIds: [currentUser._id, userId],
    });

    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate({ path: 'userIds', model: User })
      .lean();

    (populatedConversation as any).userIds.forEach((user: any) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', populatedConversation);
      }
    });

    return NextResponse.json(populatedConversation);
  } catch (error) {
    console.error('CONVERSATIONS_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
