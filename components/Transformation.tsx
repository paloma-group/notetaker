'use client';

import { formatDate } from '@/utils/date/formatDate';
import CopyToClipboard from './CopyToClipboard';

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
    <div className="relative border-t border-white py-6">
      {text && (
        <div className="absolute right-0">
          <CopyToClipboard text={text} />
        </div>
      )}
      {title && <h3 className="text-xl font-semibold">{title}</h3>}
      {created_at && (
        <h4 className="text-sm pt-4">{formatDate(new Date(created_at))}</h4>
      )}
      {text && <p className="pt-4">{text}</p>}
    </div>
  );
}
