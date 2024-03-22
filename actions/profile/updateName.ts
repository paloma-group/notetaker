'use server';

import { createServerActionClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient();

export const updateName = async (profileId: number, data: FormData) => {
  const name = data.get('input');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await supabase
    .from('profiles')
    .upsert({ id: profileId, user_id: user?.id, full_name: name });

  revalidatePath(`/profile`);

  return result;
};
