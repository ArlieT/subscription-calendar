import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import localFont from "next/font/local";

import Navbar from "@/components/navbar";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const sora = Sora({ weight: "400", subsets: ["latin"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Subscription calendar",
  description: "Subscription calendar for your subscriptions.",
  openGraph: {
    title: "Subscription calendar",
    description: "Easily track and manage your subscriptions.",
    images: [
      {
        url: "/images/main.png",
        width: 1200,
        height: 630,
        alt: "Subscription calendar preview",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
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
              <main className="relative h-auto w-full">{children}</main>
            </div>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
