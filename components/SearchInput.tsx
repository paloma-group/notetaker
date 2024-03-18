'use client';

import React, { useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export const SearchInput = () => {
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

  return (
    <input
      ref={ref}
      type="text"
      name="search"
      placeholder="Search"
      className="w-full py-2 px-4 border border-gray-300 rounded-full placeholder:text-black"
    />
  );
};
