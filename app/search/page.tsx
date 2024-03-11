import Header from '@/components/Header';
import NotesTable from '@/components/NotesTable';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PiCaretLeft } from 'react-icons/pi';

export default async function Search({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const q = searchParams.q;

  const { data: notes, error } = await supabase
    .from('notes')
    .select(
      `
      id,
      title,
      note_tags!inner(tags!inner(name))
    `
    )
    .textSearch(`fts_query`, `${q}`, {
      type: 'websearch',
      config: 'english',
    });

  return (
    <Header query={q}>
      <Link href={'/'} className={'flex items-center p-4'}>
        <PiCaretLeft /> All notes
      </Link>
      <div className="mt-32">
        <NotesTable notes={notes} query={q} />
      </div>
    </Header>
  );
}
