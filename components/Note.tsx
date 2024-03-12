'use client';

import Modal from '@/components/Modal';
import Transformation from './Transformation';
import { formatDate } from '@/utils/date/formatDate';
import { useState } from 'react';
import { extractRawTextFromTranscript } from '@/utils/notes/transcript';

// Define a function to render highlights from text
const renderHighlights = (text: string | null): JSX.Element[] => {
  if (!text) {
    return [];
  }

  return text.split('\n').map((highlight, index) => (
    <li key={index} className="my-4">
      {highlight}
    </li>
  ));
};

export type NoteWithTransforms = {
  id: number;
  title: string | null;
  transcript: string | null;
  highlights: string | null;
  created_at: string;
  user_id: string | null;
  note_tags: {
    tags: {
      name: string;
    } | null;
  }[];
  transformation_outputs: {
    id: number;
    transformed_text: string | null;
    transformation_prompts: {
      type: string;
    } | null;
    created_at: string | null;
  }[];
};

export type TTPrompt = {
  id: number;
  prompt: string;
  type: string;
};

export default function Note({
  note,
  prompts,
}: {
  note: NoteWithTransforms;
  prompts: TTPrompt[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [prompt, setPrompt] = useState<TTPrompt>();

  const onPromptClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;

    const promptSelection = prompts.find((i) => i.type === button.id);

    if (!promptSelection) return;

    setPrompt(promptSelection);
    setModalOpen(true);
  };

  if (!note) {
    return <p>No note to display</p>;
  }

  return (
    <>
      <div className="flex p-6 md:p-12 bg-gray-200 rounded-3xl">
        <div className="hidden md:block self-start w-96 flex-none p-8 rounded-3xl bg-gray-300 mr-16">
          <h3 className="text-xl font-semibold">Highlights</h3>
          <ul className="list-disc pl-4">
            {renderHighlights(note.highlights)}
          </ul>
        </div>
        <div className="grow">
          <div>
            <h2 className="text-4xl font-semibold mb-3">
              {note?.title || `Note #${note.id}`}
            </h2>
            <p className="text-sm">{formatDate(new Date(note.created_at))}</p>
            {note?.note_tags?.length ? (
              <div className="flex mt-4">
                {note.note_tags.map((t, i) => (
                  <span
                    key={`tag-${i}`}
                    className="capitalize text-xs py-2 px-4 border border-gray-400 rounded-full mr-3"
                  >
                    {t.tags?.name}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="my-8 p-8 rounded-xl bg-gray-100">
              <h3 className="text-lg mb-3">Transform note</h3>
              <div className="flex flex-wrap">
                {!!prompts?.length &&
                  prompts.map((prompt) => (
                    <button
                      id={prompt.type}
                      key={prompt.type}
                      className="text-sm md:text-normal mb-4 py-1.5 md:py-3 px-3 md:px-6 border border-gray-400 bg-white hover:border-orange-500 rounded-full mr-3"
                      onClick={onPromptClick}
                    >
                      {prompt.type}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="block md:hidden mb-8">
              <h3 className="text-xl font-semibold">Highlights</h3>
              <ul className="list-disc pl-4">
                {renderHighlights(note.highlights)}
              </ul>
            </div>
            {note?.transformation_outputs?.map((transformation) => (
              <div key={transformation.id}>
                <Transformation
                  title={transformation.transformation_prompts?.type}
                  created_at={transformation.created_at}
                  text={
                    transformation.transformed_text &&
                    extractRawTextFromTranscript(
                      transformation.transformed_text
                    )
                  }
                />
              </div>
            ))}
            <Transformation
              title="Transcript"
              created_at={note.created_at}
              text={note.transcript}
            />
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        title={prompt?.type}
        note={note}
        prompt={prompt}
      />
    </>
  );
}
