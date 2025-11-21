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

    return {
      _id: conversation._id.toString(),
      name: conversation.name || null,
      isGroup: conversation.isGroup || false,
      lastMessageAt: conversation.lastMessageAt?.toISOString() || null,
      createdAt: conversation.createdAt?.toISOString() || null,
      updatedAt: conversation.updatedAt?.toISOString() || null,
      users: (conversation as any).userIds.map((user: any) => ({
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
