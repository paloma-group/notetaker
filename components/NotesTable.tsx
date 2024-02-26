"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";
import Link from "next/link";

export default function NotesTable() {
  const [notes, setNotes] = useState<Tables<"notes">[] | null>([]);
  const [urls, setUrls] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function getNotes() {
      const { data: notesData } = await supabase
        .from("notes")
        .select()
        .order("created_at", { ascending: false }); //.eq('user_id', user.id); can leave off it policy is setup correctly

      if (!notesData || !notesData?.length) return;

      setNotes(notesData);

      const urlsToSign = notesData
        .map((n) => n.audio_file_path || "")
        .filter(Boolean);

      if (!urlsToSign?.length) return;

      const { data: urlsData } = await supabase.storage
        .from("voice-notes")
        .createSignedUrls(urlsToSign, 60 * 5 /* 5mins */);

      if (!urlsData || !urlsData?.length) return;

      setUrls(urlsData.map((u) => u.signedUrl));
    }
    getNotes();
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold mb-8">Notes</h2>
      {!!notes?.length ? (
        <table className="w-full text-center">
          <thead>
            <tr className="border border-black">
              <th className="p-2">ID</th>
              <th className="p-2">MP3</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, i) => (
              <tr key={note.id} className="border border-black">
                <td className="p-2">
                  <Link
                    href={`/recording/${note.id}`}
                    className="text-blue-500 underline"
                  >
                    #{note.id}
                  </Link>
                </td>
                <td className="p-2">
                  {urls?.[i] && (
                    <a href={urls[i]} className="text-blue-500 underline">
                      Link to audio
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No notes to display</p>
      )}
    </>
  );
}
