'use server';

import { createServerActionClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient();

export const updateEmail = async (data: FormData) => {
  const email = data.get('input') as string;

  if (!email) {
    return;
  }

  const result = await supabase.auth.updateUser({ email });

  revalidatePath(`/profile`);

  return result;
};
