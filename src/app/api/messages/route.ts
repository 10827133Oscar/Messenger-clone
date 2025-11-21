import { NextResponse } from 'next/server';
import getCurrentUser from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?._id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDatabase();

    const newMessage = await Message.create({
      body: message,
      image: image,
      conversationId: conversationId,
      senderId: currentUser._id,
      seenIds: [currentUser._id],
    });

    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessageAt: new Date(),
        $push: { messagesIds: newMessage._id },
      },
      { new: true }
    )
      .populate({ path: 'userIds', model: User })
      .populate({
        path: 'messagesIds',
        model: Message,
        populate: [
          { path: 'senderId', model: User },
          { path: 'seenIds', model: User },
        ],
      });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate({ path: 'senderId', model: User })
      .populate({ path: 'seenIds', model: User })
      .lean();

    const formattedMessage = {
      ...populatedMessage,
      _id: (populatedMessage as any)._id.toString(),
      conversationId: (populatedMessage as any).conversationId.toString(),
      sender: {
        ...(populatedMessage as any).senderId,
        _id: (populatedMessage as any).senderId._id.toString(),
      },
      seen: (populatedMessage as any).seenIds.map((user: any) => ({
        ...user,
        _id: user._id.toString(),
      })),
    };

    await pusherServer.trigger(conversationId, 'messages:new', formattedMessage);

    const lastMessage = updatedConversation.messagesIds[
      updatedConversation.messagesIds.length - 1
    ];

    updatedConversation.userIds.forEach((user: any) => {
      pusherServer.trigger(user.email, 'conversation:update', {
        id: conversationId,
        messages: [formattedMessage],
      });
    });

    return NextResponse.json(formattedMessage);
  } catch (error) {
    console.error('MESSAGES_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
