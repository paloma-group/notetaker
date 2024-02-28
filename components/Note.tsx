"use client";

import { Tables } from "@/types/supabase";
import { useState } from "react";
import Modal from "@/components/Modal";

// Define a function to render highlights from text
const renderHighlights = (text: string | null): JSX.Element[] => {
  if(!text){
    return [];
  }

  return text.split('\n').map((highlight, index) => (
    <li key={index} className="my-4">{highlight}</li>
  ));
};

export type NoteWithTransforms = {
  id: number;
  transcript: string | null;
  highlights: string | null;
  created_at: string;
  user_id: string | null;
  transcript_transformations: {
    transformed_text: string | null;
    transcript_transformation_inputs: {
      type: string;
    } | null;
  }[];
};

export type TTInput = {
  id: number;
  input: string;
  type: string;
};

export default function Note({
  note,
  inputs,
}: {
  note: NoteWithTransforms;
  inputs: TTInput[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState<TTInput>();

  const onInputClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;

    const inputSelection = inputs.find((i) => i.type === button.id);

    if (!inputSelection) return;

    setInput(inputSelection);
    setModalOpen(true);
  };

  return note ? (
    <>
      <div className="flex p-12 bg-gray-200 rounded-3xl mb-16">
        <div className="self-start w-96 flex-none p-8 rounded-3xl bg-gray-300 mr-16">
          <h3 className="text-xl font-semibold">Highlights</h3>
          <ul className="list-disc pl-4">
            {renderHighlights(note.highlights)}
          </ul>
        </div>
        <div className="grow">
          <div className="border-b border-white pb-6">
            <h2 className="text-4xl font-semibold mb-3">Note #{note.id}</h2>
            <p className="text-sm">
              {new Date(note.created_at).toDateString()}
            </p>
            <div className="mt-8 p-8 rounded-xl bg-gray-100">
              <h3 className="text-lg mb-3">Transform note</h3>
              <div className="flex flex-wrap">
                {!!inputs?.length &&
                  inputs.map((input) => (
                    <button
                      id={input.type}
                      key={input.type}
                      className="py-3 px-6 border border-gray-400 bg-white hover:border-orange-500 rounded-full mr-3"
                      onClick={onInputClick}
                    >
                      {input.type}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <div className="pt-6">
            <h3 className="text-xl font-semibold">Transcript</h3>
            <p className="my-4">{note.transcript}</p>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title={input?.type}
        note={note}
        input={input}
      />
    </>
  ) : (
    <p>No note to display</p>
  );
}
