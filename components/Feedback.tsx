import Link from 'next/link';

export default function Feedback() {
  return (
    <Link
      className="underline"
      href="https://forms.gle/miMjxnaDTmqEWrYh7"
      rel="noopener noreferrer"
      target="_blank"
    >
      Feedback? Let us know!
    </Link>
  );
}
