import AuthButton from '@/components/AuthButton';
import { Search } from '@/components/Search';
import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <header className="sticky py-8 top-0 z-40">
      <div className="absolute top-2 right-4">
        <NavLinks />
      </div>
      <div className="container bg-white rounded-xl">
        <div className="flex h-20 py-4 px-5 md:px-8 justify-center items-center">
          <div className="flex flex-1">
            <Link
              href="/"
              className="hidden md:flex items-center justify-center w-10 h-10 text-white bg-orange-500 rounded-full mr-5"
              scroll={false}
            >
              <span>+</span>
            </Link>
            <Search />
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
