import Header from '@/components/Header';

export default function AppLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <Header>{children}</Header>;
}
