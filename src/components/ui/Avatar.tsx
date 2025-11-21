'use client';

import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ src, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`relative inline-block rounded-full overflow-hidden ${sizeClasses[size]}`}>
      <Image
        fill
        src={src || '/images/placeholder.jpg'}
        alt="Avatar"
        className="object-cover"
      />
    </div>
  );
}
