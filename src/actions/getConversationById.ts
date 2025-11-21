import getCurrentUser from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

export default async function getConversationById(conversationId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    await connectToDatabase();

    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: 'userIds',
        model: User,
      })
      .lean();

    if (!conversation) {
      return null;
    }

    const conv = conversation as any;
    return {
      _id: conv._id.toString(),
      name: conv.name || null,
      isGroup: conv.isGroup || false,
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
    };
  } catch {
    return null;
  }
}
