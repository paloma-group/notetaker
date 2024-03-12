import Note from '@/components/Note';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PiCaretLeft } from 'react-icons/pi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Recording({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: note } = await supabase
    .from('notes')
    .select(
      `id, title, transcript, highlights, created_at, user_id, note_tags ( tags ( name ) ), transformation_outputs ( id, transformed_text, transformation_prompts ( type ), created_at )`
    )
    .order('created_at', {
      referencedTable: 'transformation_outputs',
      ascending: false,
    })
    .eq('id', id)
    .limit(1)
    .single();

  const { data: prompts } = await supabase
    .from('transformation_prompts')
    .select(`id, prompt, type`);

  return (
    <>
      <Link href={'/'} className={'flex items-center p-4'}>
        <PiCaretLeft /> All notes
      </Link>
      {note && prompts ? <Note note={note} prompts={prompts} /> : null}
    </>
  );
}
