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
  query?: string;
}

export default function NotesTable({ notes, query }: Props) {
  return (
    <div
      className={'grid gap-5 p-5 lg:p-10 bg-gray-200 rounded-3xl mb-4 lg:mb-8'}
    >
      {query && (
        <div>
          <p>Search results</p>
          <h6 className={'text-4xl'}>“{query}”</h6>
        </div>
      )}
      {!!notes?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
          {notes.map((note, i) => (
            <Link
              key={note.id}
              href={`/recording/${note.id}`}
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
