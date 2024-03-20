import Link from 'next/link';

export default function NavLinks() {
  return (
    <div className="text-xs text-gray-500 space-x-4">
      <Link
        className="hover:text-gray-700"
        href="https://forms.gle/miMjxnaDTmqEWrYh7"
        rel="noopener noreferrer"
        target="_blank"
      >
        Feedback
      </Link>
      <span>|</span>
      <Link
        className="hover:text-gray-700"
        href="https://github.com/paloma-group/dictaphone"
        rel="noopener noreferrer"
        target="_blank"
      >
        Contribute
      </Link>
    </div>
  );
}
