"use client";

import { Tables } from "@/types/supabase";

export default function NotesTable({ note }: { note?: Tables<"notes"> }) {
  return note ? (
    <div className="flex p-12 bg-gray-200 rounded-3xl mb-16">
      <div className="self-start w-96 flex-none p-8 rounded-3xl bg-gray-300 mr-16">
        <h3 className="text-xl font-semibold">Highlights</h3>
        <ul className="list-disc pl-4">
          <li className="my-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt
          </li>
          <li className="my-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt
          </li>
          <li className="my-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt
          </li>
        </ul>
      </div>
      <div className="grow">
        <div className="border-b border-black pb-6">
          <h2 className="text-4xl font-semibold mb-3">Note #{note.id}</h2>
          <p className="text-sm">{note.created_at}</p>
        </div>
        <div className="pt-6">
          <h3 className="text-xl font-semibold">Transcript</h3>
          <p className="my-4">
            {note.transcript}
          </p>
          <div className="p-8 rounded-xl bg-gray-100">
            <h3 className="text-lg mb-3">Transform note</h3>
            <div className="flex flex-wrap">
              <button className="py-3 px-6 border border-gray-400 rounded-full mr-3">Summary</button>
              <button className="py-3 px-6 border border-gray-400 rounded-full mr-3">Email</button>
              <button className="py-3 px-6 border border-gray-400 rounded-full mr-3">Notes</button>
              <button className="py-3 px-6 border border-gray-400 rounded-full mr-3">Social Post</button>
              <button className="py-3 px-6 border border-gray-400 rounded-full mr-3">Enhance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>No note to display</p>
  );
}
