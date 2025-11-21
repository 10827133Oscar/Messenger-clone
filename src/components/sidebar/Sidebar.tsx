'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HiChat, HiUsers } from 'react-icons/hi';
import { HiArrowLeftOnRectangle } from 'react-icons/hi2';
import { signOut } from 'next-auth/react';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from '../ui/Avatar';

interface SidebarProps {
  currentUser?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Chat',
      href: '/conversations',
      icon: HiChat,
      active: pathname === '/conversations' || pathname?.startsWith('/conversations/'),
    },
    {
      label: 'Users',
      href: '/users',
      icon: HiUsers,
      active: pathname === '/users',
    },
    {
      label: 'Logout',
      href: '#',
      icon: HiArrowLeftOnRectangle,
      onClick: () => signOut(),
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <li key={item.label}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={clsx(
                    'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  <span className="sr-only">{item.label}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100',
                    item.active && 'bg-gray-100 text-black'
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <nav className="mt-4 flex flex-col justify-between items-center">
        <div className="cursor-pointer hover:opacity-75 transition">
          <Avatar src={currentUser?.image} />
        </div>
      </nav>
    </div>
  );
}
