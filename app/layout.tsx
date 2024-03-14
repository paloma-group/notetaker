import './globals.css';
import { DM_Sans } from 'next/font/google';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Dictaphone',
  description: 'Record, transcribe and summarize voice recordings in seconds.',
};

const dmSans = DM_Sans({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.className}>
      <body className="bg-background">
        <main>{children}</main>
      </body>
    </html>
  );
}
