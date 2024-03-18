'use server';

import { createServerActionClient } from '@/utils/supabase/server';
const supabase = createServerActionClient();
import { redirect } from 'next/navigation';

export const resetPassword = async (formData: FormData) => {
  console.log({ formData, redirect });
  const email = (formData.get('email') || formData.get('input')) as string;

  const result = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.BASE_URL}/update-password`,
  });

  redirect('/reset-password/submitted');
};
