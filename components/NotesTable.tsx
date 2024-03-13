'use client';

import Link from 'next/link';

export type NoteTableView = {
  id: number;
  title: string | null;
  note_tags: {
    tags: {
      name: string;
    } | null;
  }[];
};

interface Props {
  notes?: NoteTableView[] | null;
  search?: string;
  tag?: string;
}

export default function NotesTable({ notes, search, tag }: Props) {
  return (
    <div
      className={'grid gap-5 p-5 lg:p-10 bg-gray-200 rounded-3xl mb-4 lg:mb-8'}
    >
      {tag && (
        <div>
          <p>Tag results</p>
          <h6 className={'text-4xl'}>“{tag}”</h6>
        </div>
      )}
      {search && (
        <div>
          <p>Search results</p>
          <h6 className={'text-4xl'}>“{search}”</h6>
        </div>
      )}
      {tag && notes?.length && notes.length > 1 && (
        <form action="/notes" className="grow md:grow-0">
          <input
            type="text"
            name="search"
            placeholder="Search tag results"
            className="py-2 px-4 border border-gray-300 rounded-full placeholder:text-black"
          />
          <input type="text" name="tag" hidden defaultValue={tag} />
          <input type="submit" hidden />
        </form>
      )}
      {!!notes?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
          {notes.map((note, i) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="flex flex-col h-48 px-5 py-6 bg-white rounded-3xl border-2 hover:border-orange-500 cursor-pointer"
            >
              {note?.note_tags?.length ? (
                <div className="flex flex-wrap">
                  {note.note_tags.map((t, i) => (
                    <span
                      key={`tag-${i}`}
                      className="capitalize text-xs py-2 px-4 border border-gray-400 rounded-full mr-3 whitespace-pre mb-4"
                    >
                      {t.tags?.name}
                    </span>
                  ))}
                </div>
              ) : null}
              <span className="block mt-auto text-2xl xl:text-3xl truncate">
                {note?.title ? note.title : `Note #${note.id}`}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No notes to display</p>
      )}
    </div>
  );
}
