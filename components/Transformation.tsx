'use client';

import { formatDate } from '@/utils/date/formatDate';
import { CopyToClipboardButton } from './CopyToClipboardButton';

export default function Transformation({
  title,
  text,
  created_at,
}: {
  title?: string | null;
  text?: string | null;
  created_at?: string | null;
}) {
  return (
    <div className="border-t border-white py-6 grid gap-4">
      <div className={'flex justify-between'}>
        <h3 className="text-xl font-semibold">{title}</h3>
        {text && <CopyToClipboardButton text={text} />}
      </div>
      {created_at && (
        <h4 className="text-sm">{formatDate(new Date(created_at))}</h4>
      )}
      <p>{text}</p>
    </div>
  );
}
