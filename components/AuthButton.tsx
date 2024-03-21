import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Avatar from './Avatar';
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
        <Avatar url={profile?.avatar_url} size={32} />
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
