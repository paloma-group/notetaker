'use client';

import { updatePassword } from '@/actions/updatePassword';
import { SubmitButton } from './SubmitButton';

export default function UpdatePasswordForm({ code }: { code: string }) {
  const handleUpdatePassword = updatePassword.bind(null, code);

  return (
    <form action="" className="flex flex-col">
      <label className="text-md" htmlFor="password">
        Password
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        type="password"
        name="password"
        placeholder="••••••••"
        required
      />
      <SubmitButton
        formAction={handleUpdatePassword}
        className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
        pendingText="Updating password..."
      >
        Submit
      </SubmitButton>
    </form>
  );
}
