import { NextResponse } from 'next/server';
import getCurrentUser from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import User from '@/models/User';
import { pusherServer } from '@/lib/pusher';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser?._id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: 'messagesIds',
        model: Message,
      })
      .populate({
        path: 'userIds',
        model: User,
      });

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const lastMessage = conversation.messagesIds[conversation.messagesIds.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      lastMessage._id,
      {
        $addToSet: { seenIds: currentUser._id },
      },
      { new: true }
    )
      .populate({ path: 'senderId', model: User })
      .populate({ path: 'seenIds', model: User })
      .lean();

    await pusherServer.trigger(currentUser.email!, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    });

    if ((lastMessage.seenIds as any[]).includes(currentUser._id)) {
      return NextResponse.json(conversation);
    }

    const formattedMessage = {
      ...updatedMessage,
      _id: (updatedMessage as any)._id.toString(),
      conversationId: (updatedMessage as any).conversationId.toString(),
      sender: {
        ...(updatedMessage as any).senderId,
        _id: (updatedMessage as any).senderId._id.toString(),
      },
      seen: (updatedMessage as any).seenIds.map((user: any) => ({
        ...user,
        _id: user._id.toString(),
      })),
    };

    await pusherServer.trigger(
      conversationId,
      'message:update',
      formattedMessage
    );

    return NextResponse.json(formattedMessage);
  } catch (error) {
    console.error('SEEN_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
