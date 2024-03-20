'use server';

import { createServerActionClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient();

export const updateApiKey = async (apiKeyId: number, data: FormData) => {
  const api_key = data.get('input');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await supabase
    .from('ai_integration')
    .upsert({ id: apiKeyId, user_id: user?.id, api_key });

  revalidatePath(`/profile`);

  return result;
};
