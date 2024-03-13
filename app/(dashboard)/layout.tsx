import Header from '@/components/Header';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: Props) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className={'container min-h-svh layout-container'}>
      <Header />
      {children}
    </div>
  );
}
