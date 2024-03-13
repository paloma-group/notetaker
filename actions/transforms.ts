'use server';

import { Tables } from '@/types/supabase';
import { transform } from '@/utils/openai/transform';
import { createServerActionClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createServerActionClient();

export const refreshTransform = async (transformId: number) => {
  const currentTransform = await supabase
    .from('transformation_outputs')
    .select('transformation_prompts (prompt), notes (id, transcript)')
    .eq('id', transformId)
    .single();

  if (!currentTransform.data) {
    throw Error(currentTransform.error?.message);
  }

  const note = currentTransform.data.notes as unknown as Tables<'notes'>;
  const prompt = currentTransform.data
    .transformation_prompts as unknown as Tables<'transformation_prompts'>;

  const transformedText = await transform(note.transcript ?? '', prompt.prompt);

  await supabase
    .from('transformation_outputs')
    .update({ transformed_text: transformedText })
    .eq('id', transformId);

  revalidatePath(`/recording/${note.id}`);

  return transformedText;
};

export const createTransform = async (promptId: number, noteId: number) => {
  const { data: prompt } = await supabase
    .from('transformation_prompts')
    .select('prompt')
    .eq('id', promptId)
    .single();
  const { data: note } = await supabase
    .from('notes')
    .select('user_id, transcript')
    .eq('id', noteId)
    .single();

  if (!prompt) {
    throw Error('Could not find prompt');
  }
  if (!note) {
    throw Error('Could not find note');
  }

  const text = await transform(note.transcript, prompt.prompt);

  if (!text) return;

  const { data, error } = await supabase
    .from('transformation_outputs')
    .insert({
      prompt_id: promptId,
      note_id: noteId,
      transformed_text: text,
      user_id: note.user_id,
    })
    .select('transformed_text, transformation_prompts ( type ), created_at')
    .limit(1)
    .single();

  if (error) {
    throw Error(error.message);
  }

  revalidatePath(`/recording/${noteId}`);

  return data;
};
