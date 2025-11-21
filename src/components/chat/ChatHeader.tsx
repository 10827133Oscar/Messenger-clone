'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import { useSession } from 'next-auth/react';
import Avatar from '../ui/Avatar';

interface ChatHeaderProps {
  conversation: any;
}

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  const session = useSession();

  const otherUser = useMemo(() => {
    const users = conversation.users || [];
    return users.filter(
      (user: any) => user.email !== session.data?.user?.email
    )[0];
  }, [conversation.users, session.data?.user?.email]);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return 'Active';
  }, [conversation]);

  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations"
          className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
        >
          <HiChevronLeft size={32} />
        </Link>
        <Avatar src={otherUser?.image} />
        <div className="flex flex-col">
          <div>{conversation.name || otherUser?.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <HiEllipsisHorizontal
        size={32}
        className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
      />
    </div>
  );
}
