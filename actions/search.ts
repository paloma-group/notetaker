'use server';

import { redirect } from 'next/navigation';

export const search = async (data: FormData) => {
  const search = data.get('search') as string;

  if (!search) {
    return;
  }

  redirect(`/notes?search=${search}`);
};
