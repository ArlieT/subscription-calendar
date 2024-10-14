import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Sora } from 'next/font/google';

import './globals.css';
import ReactQueryProvider from '@/components/provider/ReactQueryProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Navbar from '@/components/navbar';

const sora = Sora({ weight: '400', subsets: ['latin'] });

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Subscription',
  description: 'Subscription calendar for your subscriptions.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body
          className={`dark ${sora.className} ${geistSans.variable} ${geistMono.variable}`}
        >
          <ReactQueryProvider>
            <div className="h-dvh w-full bg-background">
              <Navbar />
              <main className="h-auto w-full">{children}</main>
            </div>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
