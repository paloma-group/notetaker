'use client';

import Link from 'next/link';
import Image from 'next/image';
import RecordCard from '@/assets/record_card.svg';

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
      className={'grid gap-5 p-5 lg:p-10 bg-white rounded-t-lg sm:rounded-3xl'}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10">
        {notes?.map((note, i) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className="flex flex-col h-48 px-5 py-6 bg-gray-200 rounded-3xl border-2 hover:border-orange-da cursor-pointer"
          >
            {note?.note_tags?.at(0) ? (
              <span className="capitalize text-xs py-2 px-4 border border-gray-400 rounded-full whitespace-pre place-self-start">
                {note?.note_tags?.at(0)?.tags?.name}
              </span>
            ) : null}
            <span className="block mt-auto text-2xl xl:text-3xl truncate">
              {note?.title ? note.title : `Note #${note.id}`}
            </span>
          </Link>
        ))}
        <Link
          href="/?record=true"
          className="h-48 px-5 py-6 bg-orange-da rounded-3xl border-orange-da border-2 hover:border-gray-200 cursor-pointer flex flex-col justify-center items-center space-y-4"
        >
          <span className="text-white">Record a note</span>
          <Image src={RecordCard} alt="Record" />
        </Link>
      </div>
    </div>
  );
}
