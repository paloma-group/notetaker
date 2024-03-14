import Link from 'next/link';
import { PiCaretLeft } from 'react-icons/pi';

export default async function AllNotesLink() {
  return (
    <Link href={'/'} className={'flex items-center p-4'}>
      <PiCaretLeft /> All notes
    </Link>
  );
}
