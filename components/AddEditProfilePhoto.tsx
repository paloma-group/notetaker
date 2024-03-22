'use client';

import { uploadAvatar } from '@/utils/profile/upload-avatar';
import { ChangeEvent, useState } from 'react';
import spinner from '@/assets/spinner.svg';
import Avatar from './Avatar';
import Image from 'next/image';

export default function AddEditProfilePhoto({
  profileId,
  avatar_url,
}: {
  profileId: number;
  avatar_url?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [avatarUrl, setAvatarUrl] = useState(avatar_url);

  const handleAddEditPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image: File = event.target.files[0];

      if (image.size > 5000000) {
        setError('Image must be less than 5mb');
      } else {
        setIsLoading(true);
        setError(undefined);

        const result = await uploadAvatar(profileId, image);

        if (result.error) {
          setError('An error occurred when setting profile photo');
        } else {
          setAvatarUrl(result.data?.avatar_url);
        }
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-row">
      <Avatar url={avatarUrl} />
      {isLoading && (
        <Image className="m-auto size-6" src={spinner} alt={'Loading'} />
      )}
      <div className="flex flex-col justify-center">
        {!isLoading && (
          <form>
            <label htmlFor="inputTag" className="underline cursor-pointer">
              Add/edit profile photo
              <input
                id="inputTag"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleAddEditPhoto}
              />
            </label>
          </form>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
