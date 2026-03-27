import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mwanje Ronnie — Events Newsletter',
  description:
    'Stay updated on tech events in Kampala and beyond. Subscribe to the events newsletter on Luma.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
