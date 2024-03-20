import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import avatar from '@/assets/avatar.svg';
import SignOut from './SignOut';

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .limit(1)
    .single();

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/profile" className="">
        <Image
          className="size-8 min-w-6"
          src={profile?.avatar_url || avatar}
          alt={'Avatar'}
        />
      </Link>
      <SignOut />
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
