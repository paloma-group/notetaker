'use server';

import { createServerActionClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const supabase = createServerActionClient();
  await supabase.auth.signOut();
  return redirect('/login');
};
