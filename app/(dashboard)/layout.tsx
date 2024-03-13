import Header from '@/components/Header';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className={'container min-h-svh layout-container'}>
      <Header />
      {children}
    </div>
  );
}
