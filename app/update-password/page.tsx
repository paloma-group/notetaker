import UpdatePasswordForm from '@/components/UpdatePasswordForm';

export default async function UpdatePassword({
  searchParams,
}: {
  searchParams: { code: string; error_description: string };
}) {
  if (searchParams.error_description) {
    return <p className="text-center">{searchParams.error_description}</p>;
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex-1 flex flex-col w-full p-8 sm:max-w-md justify-center gap-2 bg-white rounded-3xl space-y-4">
      <h2 className="text-xl text-center">Update password</h2>
      <UpdatePasswordForm code={searchParams.code} />
    </div>
  );
}
