import NotesTable from '@/components/NotesTable';
import Recorder from '@/components/Recorder';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, note_tags ( tags ( name ) )')
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="h-dvh flex flex-col items-center justify-center -mt-36">
        <div className="">
          <Recorder userId={user.id} />
        </div>
      </div>
      <NotesTable notes={notes} />
    </>
  );
}
