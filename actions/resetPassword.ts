'use server';

import { createServerActionClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const resetPassword = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const supabase = createServerActionClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.BASE_URL}/update-password`,
  });

  if (error) {
    return redirect(
      `/reset-password?email=${email}&message=There was a problem whilst sending reset password link`
    );
  }

  redirect(`/reset-password/submitted?email=${email}`);
};
