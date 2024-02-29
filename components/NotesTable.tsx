"use client";

import { Tables } from "@/types/supabase";
import Link from "next/link";

export default function NotesTable({ notes }: { notes?: Tables<"notes">[] | null }) {
  return (
    <>
      {!!notes?.length ? (
        <div className="grid md:grid-cols-3 gap-5 md:gap-10 p-5 md:p-10 bg-gray-200 rounded-3xl mb-4 md:mb-8 -mt-32">
          {notes.map((note, i) => (
            <Link
              key={note.id}
              href={`/recording/${note.id}`}
              className="flex flex-col h-48 px-5 py-6 bg-white rounded-3xl border-2 hover:border-orange-500 cursor-pointer"
            >
              <span className="block mt-auto text-3xl">{note?.title ? note.title : `Note #${note.id}`}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p>No notes to display</p>
      )}
    </>
  );
}
