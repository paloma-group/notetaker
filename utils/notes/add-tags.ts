'use server';

import { createServerActionClient } from '@/utils/supabase/server';

const supabase = createServerActionClient();

export async function addTags({
  noteId,
  keywords,
}: {
  noteId: number;
  keywords: string[];
}) {
  // generate tags - check if tags already exists
  const { data: existingTags } = await supabase
    .from('tags')
    .select()
    .in('name', keywords);

  // create new Tags - if tag (name) already exists ignore
  const { data: newTags } = await supabase
    .from('tags')
    .upsert(
      keywords.map((k) => ({ name: k.toLowerCase() })),
      { ignoreDuplicates: true, onConflict: 'name' }
    )
    .select();

  // merge both sets of tags
  const tags = [...(existingTags || []), ...(newTags || [])];

  if (!tags.length) return;

  // insert new NoteTags
  await supabase
    .from('note_tags')
    .insert(tags.map((t) => ({ note_id: noteId, tag_id: t.id })));
}
