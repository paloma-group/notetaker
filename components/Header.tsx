import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

interface Props {
  query?: string;
}

export default function Header({ query = '' }: Props) {
  return (
    <header className="sticky py-8 top-0">
      <div className="container bg-white rounded-full">
        <div className="flex h-20 py-4 px-5 md:px-8 justify-center items-center">
          <div className="flex flex-1">
            <Link
              href="/record"
              className="hidden md:flex items-center justify-center w-10 h-10 text-white bg-orange-500 rounded-full mr-5"
              scroll={false}
            >
              <span>+</span>
            </Link>
            <form action="/notes" className="grow md:grow-0">
              <input
                type="text"
                name="search"
                placeholder="Search"
                className="w-full py-2 px-4 border border-gray-300 rounded-full placeholder:text-black"
                defaultValue={query}
              />
            </form>
          </div>
          <h1 className="text-xl font-semibold italic self-center flex-none px-4">
            <Link href="/">Dictation app</Link>
          </h1>
          <div className="flex flex-1">
            <div className="ml-auto">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
