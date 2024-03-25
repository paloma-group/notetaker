import Image from 'next/image';
import paloma from '@/assets/paloma.svg';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-footer">
      <div className="container px-2 py-4 flex flex-col sm:flex-row-reverse h-80 sm:h-auto justify-between">
        <Link
          className="text-white"
          href="https://github.com/paloma-group/dictaphone"
          rel="noopener noreferrer"
          target="_blank"
        >
          Contribute
        </Link>
        <Link
          className="flex"
          href="https://www.palomagroup.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="mr-2">Created by</span>
          <Image src={paloma} alt="Paloma logo" />
        </Link>
      </div>
    </footer>
  );
}
