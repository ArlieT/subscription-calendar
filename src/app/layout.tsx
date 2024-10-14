import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Sora } from 'next/font/google';

import './globals.css';
import ReactQueryProvider from '@/components/provider/ReactQueryProvider';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

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
  title: 'Create Next App',
  description: 'Generated by create next app',
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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`dark ${sora.className} ${geistSans.variable} ${geistMono.variable}`}
        >
          <ReactQueryProvider>
            <nav>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
            <div className="h-dvh w-full bg-background">
              <main className="h-full w-full">{children}</main>
            </div>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
