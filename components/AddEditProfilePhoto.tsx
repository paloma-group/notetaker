'use client';

import avatar from '@/assets/avatar.svg';
import Image from 'next/image';

export default function AddEditProfilePhoto() {
  const handleAddEditPhoto = () => {
    // TODO:
  };

  return (
    <div className="flex">
      <Image className="mr-4 size-12" src={avatar} alt={'Avatar'} />
      <button className="underline" onClick={handleAddEditPhoto}>
        Add/edit profile photo
      </button>
    </div>
  );
}
