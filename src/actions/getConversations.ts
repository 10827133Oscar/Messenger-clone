import getCurrentUser from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import Message from '@/models/Message';

export default async function getConversations() {
  const currentUser = await getCurrentUser();

  if (!currentUser?._id) {
    return [];
  }

  try {
    await connectToDatabase();

    const conversations = await Conversation.find({
      userIds: currentUser._id,
    })
      .sort({ lastMessageAt: -1 })
      .populate({
        path: 'userIds',
        model: User,
      })
      .populate({
        path: 'messagesIds',
        model: Message,
        populate: [
          { path: 'senderId', model: User },
          { path: 'seenIds', model: User },
        ],
      })
      .lean();

    return conversations.map((conv: any) => ({
      _id: conv._id.toString(),
      name: conv.name,
      isGroup: conv.isGroup,
      lastMessageAt: conv.lastMessageAt?.toISOString() || null,
      createdAt: conv.createdAt?.toISOString() || null,
      updatedAt: conv.updatedAt?.toISOString() || null,
      users: conv.userIds.map((user: any) => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified?.toISOString() || null,
        image: user.image,
        createdAt: user.createdAt?.toISOString() || null,
        updatedAt: user.updatedAt?.toISOString() || null,
      })),
      messages: conv.messagesIds.map((msg: any) => ({
        _id: msg._id.toString(),
        body: msg.body,
        image: msg.image,
        createdAt: msg.createdAt?.toISOString() || null,
        updatedAt: msg.updatedAt?.toISOString() || null,
        sender: msg.senderId
          ? {
              _id: msg.senderId._id.toString(),
              name: msg.senderId.name,
              email: msg.senderId.email,
              emailVerified: msg.senderId.emailVerified?.toISOString() || null,
              image: msg.senderId.image,
              createdAt: msg.senderId.createdAt?.toISOString() || null,
              updatedAt: msg.senderId.updatedAt?.toISOString() || null,
            }
          : null,
        seen: msg.seenIds.map((user: any) => ({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified?.toISOString() || null,
          image: user.image,
          createdAt: user.createdAt?.toISOString() || null,
          updatedAt: user.updatedAt?.toISOString() || null,
        })),
      })),
    }));
  } catch {
    return [];
  }
}
