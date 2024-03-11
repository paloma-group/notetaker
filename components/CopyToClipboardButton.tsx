import React, { useState } from 'react';

import { PiCheck, PiCopy, PiX } from 'react-icons/pi';
import { Tooltip } from 'react-tooltip';

interface Props {
  text: string | null;
}

type CopyState = 'pending' | 'error' | 'copied';

const CopyIcon = ({ state }: { state: CopyState }) => {
  switch (state) {
    case 'error':
      return <PiX className={'text-red-500'} />;
    case 'copied':
      return <PiCheck className={'text-green-500'} />;
    default:
      return <PiCopy />;
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
    <button
      onClick={state === 'pending' ? handleCopyClick : undefined}
      data-tooltip-id="clipboard-tooltip"
      data-tooltip-content="Copied!"
    >
      <CopyIcon state={state} />
      <Tooltip
        id="clipboard-tooltip"
        place="left"
        isOpen={state === 'copied'}
      />
    </button>
  );
};
