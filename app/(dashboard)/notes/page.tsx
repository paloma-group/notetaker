import NotesTable from '@/components/NotesTable';
import { createClient } from '@/utils/supabase/server';
import { searchNotes } from '@/utils/notes/search-notes';
import { redirect } from 'next/navigation';
import AllNotesLink from '@/components/AllNotesLink';

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
      <AllNotesLink />
      <NotesTable notes={notes} search={search} tag={tag} />
    </div>
  );
}
