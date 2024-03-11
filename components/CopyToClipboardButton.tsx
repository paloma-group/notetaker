import React, { useState } from 'react';
import { FaCheck, FaRegCopy, FaX } from 'react-icons/fa6';

interface Props {
  text: string | null;
}

type CopyState = 'pending' | 'error' | 'copied';

const CopyIcon = ({ state }: { state: CopyState }) => {
  switch (state) {
    case 'error':
      return <FaX className={'text-red-500'} />;
    case 'copied':
      return <FaCheck className={'text-green-500'} />;
    default:
      return <FaRegCopy />;
  }
};

export const CopyToClipboardButton = ({ text }: Props) => {
  const [state, setState] = useState<CopyState>('pending');

  if (!text) {
    return null;
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch (e) {
      setState('error');
    } finally {
      setTimeout(() => setState('pending'), 1000);
    }
  };

  return (
    <button onClick={state === 'pending' ? handleCopyClick : undefined}>
      <CopyIcon state={state} />
    </button>
  );
};
