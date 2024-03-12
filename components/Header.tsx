import AuthButton from '@/components/AuthButton';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  query?: string;
}

export default function Header({ children, query = '' }: Props) {
  return (
    <>
      <header className="fixed w-full my-8">
        <div className="container mx-auto bg-white rounded-full">
          <div className="flex h-20 py-4 px-5 md:px-8 justify-center items-center">
            <div className="flex flex-1">
              <Link
                href="/record"
                className="hidden md:flex items-center justify-center w-10 h-10 text-white bg-orange-500 rounded-full mr-5"
                scroll={false}
              >
                <span>+</span>
              </Link>
              <form action="/search" className="grow md:grow-0">
                <input
                  type="text"
                  name="q"
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
      <div className="pt-36 min-h-screen container mx-auto">{children}</div>
    </>
  );
}
