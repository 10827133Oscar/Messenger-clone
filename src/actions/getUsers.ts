import getSession from '@/lib/getSession';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export default async function getUsers() {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    await connectToDatabase();

    const users = await User.find({
      email: { $ne: session.user.email },
    })
      .sort({ createdAt: -1 })
      .lean();

    return users.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified?.toISOString() || null,
      image: user.image,
      createdAt: user.createdAt?.toISOString() || null,
      updatedAt: user.updatedAt?.toISOString() || null,
    }));
  } catch {
    return [];
  }
}
