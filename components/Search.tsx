'use client';

import { search } from '@/actions/search';
import React, { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { track } from '@/utils/analytics/mixpanel';

export const Search = () => {
  const ref = useRef<HTMLInputElement>(null);

  useHotkeys('meta+k, ctrl+k', () => {
    if (!ref.current) {
      return;
    }

    const selectedText = window.getSelection()?.toString();

    if (selectedText) {
      ref.current.value = selectedText;
    }

    ref.current.focus();
  });

  const handleOnSubmit = () => {
    track('search', { search: ref.current?.value });
  };

  return (
    <form
      action={search}
      onSubmit={handleOnSubmit}
      className="hidden sm:block grow md:grow-0 my-auto ml-2"
    >
      <input
        ref={ref}
        type="text"
        name="search"
        placeholder="Search"
        className="w-full py-2 px-4 border border-gray-300 rounded-full placeholder:text-black"
      />
    </form>
  );
};
