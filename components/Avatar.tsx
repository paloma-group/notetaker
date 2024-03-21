'use client';

import { getAvatar } from '@/utils/profile/get-avatar';
import avatar from '@/assets/avatar.svg';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Avatar({
  url,
  size = 48,
}: {
  url?: string;
  size?: number;
}) {
  const [avatarUrl, setAvatarUrl] = useState(avatar);

  useEffect(() => {
    if (url) {
      (async () => {
        setAvatarUrl(await getAvatar(url));
      })();
    }
  }, [url]);

  return (
    <Image
      className="mr-4 rounded-full object-cover border border-gray-500 over"
      style={{ width: size, height: size }}
      width={0}
      height={0}
      src={avatarUrl}
      alt={'Avatar'}
    />
  );
}
