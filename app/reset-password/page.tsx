import { resetPassword } from '@/actions/resetPassword';
import { SubmitButton } from '@/components/SubmitButton';

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string; email: string };
}) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex-1 flex flex-col w-full p-8 sm:max-w-md justify-center gap-2 bg-white rounded-3xl">
      <h2 className="text-xl text-center">
        Please enter your email to reset your password.
      </h2>
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <input
          className="rounded-md px-4 py-2 border mb-6"
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue={searchParams?.email}
          required
        />
        <SubmitButton
          formAction={resetPassword}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Sending password reset email..."
        >
          Reset password
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
