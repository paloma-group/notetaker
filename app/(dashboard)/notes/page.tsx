import NotesTable, { NoteTableView } from '@/components/NotesTable';
import { createClient } from '@/utils/supabase/server';
import { searchNotes } from '@/utils/notes/search-notes';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PiCaretLeft } from 'react-icons/pi';

export default async function Notes({
  searchParams,
}: {
  searchParams: { search?: string; tag?: string };
}) {
  const supabase = createClient();
  const { search, tag } = searchParams;

  if (!search && !tag) {
    return redirect('/');
  }

  const notes = await searchNotes({ supabase, search, tag });

  return (
    <div>
      <Link href={'/'} className={'flex items-center p-4'}>
        <PiCaretLeft /> All notes
      </Link>
      <NotesTable notes={notes} search={search} tag={tag} />
    </div>
  );
}
