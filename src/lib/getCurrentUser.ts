import getSession from './getSession';
import connectToDatabase from './mongodb';
import User from '@/models/User';

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    await connectToDatabase();

    const currentUser = await User.findOne({
      email: session.user.email,
    });

    if (!currentUser) {
      return null;
    }

    return {
      _id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified?.toISOString() || null,
      image: currentUser.image,
      createdAt: currentUser.createdAt?.toISOString() || null,
      updatedAt: currentUser.updatedAt?.toISOString() || null,
    };
  } catch {
    return null;
  }
}
