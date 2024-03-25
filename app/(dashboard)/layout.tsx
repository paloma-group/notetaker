import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-svh layout-container flex flex-col justify-between sm:space-y-8">
      <div className="container">
        <Header />
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
