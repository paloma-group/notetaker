import {
  createClient,
  createServerActionClient,
} from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import avatar from '@/assets/avatar.svg';

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

  const signOut = async () => {
    'use server';

    const supabase = createServerActionClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/profile" className="">
        <Image
          className="size-8 min-w-6"
          src={profile?.avatar_url || avatar}
          alt={'Avatar'}
        />
      </Link>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
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
