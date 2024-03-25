'use client';

import { signOut } from '@/actions/signOut';
import { reset } from '@/utils/analytics/mixpanel';

export default async function SignOut() {
  const handleOnSubmit = () => {
    reset();
  };

  return (
    <form className="text-center" action={signOut} onSubmit={handleOnSubmit}>
      <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
        Logout
      </button>
    </form>
  );
}
