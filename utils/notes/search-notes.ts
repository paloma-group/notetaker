import { NoteTableView } from '@/components/NotesTable';
import { createClient } from '@/utils/supabase/client';

export async function searchNotes({
  supabase,
  search,
  tag,
}: {
  supabase: ReturnType<typeof createClient>;
  search?: string;
  tag?: string;
}) {
  let notes: NoteTableView[] | null = [];
  if (tag) {
    const { data: notesByTags } = await supabase
      .from('tags')
      .select(`note_tags ( notes ( id, title, note_tags ( tags ( name ) ) ) )`)
      .eq('name', tag);

    if (notesByTags?.length) {
      const notesByTagsMapped = notesByTags[0].note_tags.reduce<
        NoteTableView[]
      >((mappedNotes, note_tag) => {
        if (note_tag.notes) return [...mappedNotes, note_tag.notes];
        return mappedNotes;
      }, []);

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
  return notes;
}
