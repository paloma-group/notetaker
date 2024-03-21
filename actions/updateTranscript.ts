'use server';

import { addTags } from '@/utils/notes/add-tags';
import { highlights as generateHighlights } from '@/utils/openai/highlights';
import { createServerActionClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient();

export const updateTranscript = async (noteId: number, data: FormData) => {
  const newTranscript = data.get('transcript') as string;

  const { title, highlights, keywords } = (await generateHighlights(
    newTranscript
  )) || { title: '', highlights: [], keywords: [] };

  console.log({ title, highlights, keywords });

  const result = await supabase
    .from('notes')
    .update({
      transcript: newTranscript,
      title,
      highlights: highlights.join('\n'),
    })
    .eq('id', noteId);

  await supabase.from('note_tags').delete().match({ note_id: noteId });

  await addTags({ noteId, keywords });

  revalidatePath(`/recording/${noteId}`);

  return result;
};
