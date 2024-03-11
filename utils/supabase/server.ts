import { Database } from '@/types/supabase';
import {
  createServerActionClient as createSupabaseServerActionClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

export const createServerActionClient = () => {
  return createSupabaseServerActionClient({ cookies });
};
