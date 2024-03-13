'use server';

import { createServerActionClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient();

export const updateTranscript = async (noteId: number, data: FormData) => {
  const newTranscript = data.get('transcript');

  const result = await supabase
    .from('notes')
    .update({ transcript: newTranscript })
    .eq('id', noteId);

  revalidatePath(`/recording/${noteId}`);

  return result;
};
