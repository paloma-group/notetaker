'use client';

import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { PiCopy, PiCheck } from 'react-icons/pi';

export default function CopyToClipboard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {copied ? (
        <>
          <PiCheck
            color="green"
            data-tooltip-id="clipboard-tooltip"
            data-tooltip-content="Copied!"
          />
          <Tooltip id="clipboard-tooltip" place="left" isOpen />
        </>
      ) : (
        <button onClick={copyToClipboard}>
          <PiCopy className="hover:opacity-30" />
        </button>
      )}
    </>
  );
}
