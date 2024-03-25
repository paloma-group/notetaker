import AuthButton from '@/components/AuthButton';
import { Search } from '@/components/Search';
import Link from 'next/link';
import NavLinks from './NavLinks';
import Image from 'next/image';
import logo from '@/assets/logo.svg';
import record from '@/assets/record.svg';

export default function Header() {
  return (
    <header className="sticky py-8 top-0 z-40">
      <div className="absolute top-2 right-4">
        <NavLinks />
      </div>
      <div className="container bg-white rounded-xl">
        <div className="flex h-20 py-4 px-5 md:px-8 justify-center items-center">
          <div className="flex flex-1">
            <Link href="/?record=true" scroll={false}>
              <Image
                className="drop-shadow-lg hover:drop-shadow-none"
                src={record}
                alt="Record icon"
              />
            </Link>
            <Search />
          </div>
          <Link href="/" className="w-36">
            <Image className="m-auto" src={logo} alt="Logo" />
          </Link>
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
