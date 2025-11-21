import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';

export default async function getMessages(conversationId: string) {
  try {
    await connectToDatabase();

    const messages = await Message.find({
      conversationId: conversationId,
    })
      .sort({ createdAt: 1 })
      .populate({ path: 'senderId', model: User })
      .populate({ path: 'seenIds', model: User })
      .lean();

    return messages.map((msg: any) => ({
      _id: msg._id.toString(),
      body: msg.body,
      image: msg.image,
      conversationId: msg.conversationId.toString(),
      senderId: msg.senderId._id.toString(),
      createdAt: msg.createdAt?.toISOString() || null,
      updatedAt: msg.updatedAt?.toISOString() || null,
      sender: {
        _id: msg.senderId._id.toString(),
        name: msg.senderId.name,
        email: msg.senderId.email,
        emailVerified: msg.senderId.emailVerified?.toISOString() || null,
        image: msg.senderId.image,
        createdAt: msg.senderId.createdAt?.toISOString() || null,
        updatedAt: msg.senderId.updatedAt?.toISOString() || null,
      },
      seen: msg.seenIds.map((user: any) => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified?.toISOString() || null,
        image: user.image,
        createdAt: user.createdAt?.toISOString() || null,
        updatedAt: user.updatedAt?.toISOString() || null,
      })),
    }));
  } catch {
    return [];
  }
}
