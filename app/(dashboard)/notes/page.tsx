import NotesTable, { NoteTableView } from '@/components/NotesTable';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PiCaretLeft } from 'react-icons/pi';

export default async function Notes({
  searchParams,
}: {
  searchParams: { search?: string; tag?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { search, tag } = searchParams;

  if (!search && !tag) {
    return redirect('/');
  }

  let notes: NoteTableView[] | null = [];

  if (tag) {
    const { data: notesByTags } = await supabase
      .from('tags')
      .select(`note_tags ( notes ( id, title, note_tags ( tags ( name ) ) ) )`)
      .eq('name', tag);

    if (notesByTags?.length) {
      const notesByTagsMapped: NoteTableView[] = [];
      notesByTags[0].note_tags.map((note_tag) => {
        if (note_tag.notes) notesByTagsMapped.push(note_tag.notes);
      });
      notes = notesByTagsMapped;
    }
  }

  if (search) {
    const searchQuery = supabase
      .from('notes')
      .select(
        `
      id,
      title,
      note_tags!inner(tags!inner(name))
      `
      )
      .textSearch(`fts_query`, `${search}`, {
        type: 'websearch',
        config: 'english',
      });

    if (tag) {
      searchQuery.in(
        'id',
        notes.map((note) => note.id)
      );
    }

    const { data: notesBySearch, error } = await searchQuery;
    notes = notesBySearch;
  }

  return (
    <div>
      <Link href={'/'} className={'flex items-center p-4'}>
        <PiCaretLeft /> All notes
      </Link>
      <NotesTable notes={notes} search={search} tag={tag} />
    </div>
  );
}
