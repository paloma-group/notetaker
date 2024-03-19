'use server';

import { createServerActionClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const updatePassword = async (code: string, formData: FormData) => {
  const password = formData.get('password') as string;
  const supabase = createServerActionClient();

  const authToken = await supabase.auth.exchangeCodeForSession(code);

  if (authToken.data.session) {
    await supabase.auth.setSession(authToken.data.session);
  }

  const user = await supabase.auth.updateUser({ password });

  if (authToken.error || user.error) {
    return redirect(
      '/login?message=There was a problem whilst updating password'
    );
  }

  redirect('/');
};
