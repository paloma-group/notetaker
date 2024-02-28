"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";
import Link from "next/link";

const supabase = createClient();

export default function NotesTable() {
  const [notes, setNotes] = useState<Tables<"notes">[] | null>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getNotes() {
      setLoading(true);

      const { data } = await supabase.from("notes").select().order('created_at', { ascending: false }); //.eq('user_id', user.id); can leave off it policy is setup correctly

      if (data && data?.length) {
        setNotes(data);
      }

      setLoading(false);
    }
    getNotes();
  }, []);

  return (
    <>
      <div className="h-dvh flex flex-col items-center justify-center -mt-36">
        <div className="">
          <Link
            href="/record"
            className="flex items-center px-6 py-4 border border-gray-300 hover:border-orange-500 rounded-full"
          >
            <span className="block rounded-full bg-orange-500 mr-2">
              <span className="block w-5 h-5 m-3 rounded-full bg-white"></span>
            </span>
            <span className="text-2xl">Record a note</span>
          </Link>
        </div>
      </div>
      {!!notes?.length ? (
        <div className="grid grid-cols-3 gap-10 p-10 bg-gray-200 rounded-3xl mb-8 -mt-32">
          {notes.map((note, i) => (
            <Link
              key={note.id}
              href={`/recording/${note.id}`}
              className="flex flex-col h-48 px-5 py-6 bg-white rounded-3xl border-2 hover:border-orange-500 cursor-pointer"
            >
              <span className="block mt-auto text-3xl">Note {note.id}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p>No notes to display</p>
      )}
    </>
  );
}
