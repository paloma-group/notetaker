'use client';

import { highlights as generateHighlights } from '@/utils/openai/highlights';
import { transcript } from '@/utils/openai/transcript';
import { createClient } from '@/utils/supabase/client';
import { v4 } from 'uuid';
import { track } from '@/utils/analytics/mixpanel';
import { addTags } from './add-tags';

const supabase = createClient();

export async function createNote({
  userId,
  audioBlob,
}: {
  userId: string;
  audioBlob: Blob;
}) {
  track('note-created');
  // get audio transcript
  const transcription = await transcript(audioBlob);

  // generate AI responses from transcript
  const { title, highlights, keywords } = (await generateHighlights(
    transcription
  )) || { title: '', highlights: [], keywords: [] };

  // save the audio as an mp3 to Supabase storage
  const arrayBuffer = await audioBlob.arrayBuffer();
  const { data: audioData } = await supabase.storage
    .from('voice-notes')
    .upload(`/${userId}/${v4()}/voice-note.mp3`, arrayBuffer, {
      contentType: 'audio/mpeg',
    });

  // create a new Note entity
  const { data: noteData, error } = await supabase
    .from('notes')
    .insert({
      audio_file_path: audioData?.path || '',
      // @ts-ignore
      audio_file_id: audioData?.id || '',
      user_id: userId,
      transcript: transcription,
      highlights: highlights.join('\n'),
      title,
    })
    .select()
    .limit(1)
    .single();

  if (!noteData || !keywords?.length) {
    if (error) {
      throw Error(error.message);
    }
    throw Error('Could not create new note');
  }

  addTags({ noteId: noteData.id, keywords });

  return noteData;
}
