import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkLoaded,
  ClerkProvider
} from '@clerk/nextjs';
import Loading from "./loading";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Reddit Clone",
  description: "A Reddit clone built with Next.js and Clerk",
  icons: {
    icon: "/reddit.png",
    shortcut: "/reddit.png",
    apple: "/reddit.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <Suspense fallback={<Loading />}>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ClerkLoaded>
              {children}
            </ClerkLoaded>
          </body>
        </html>
      </Suspense>
    </ClerkProvider>

  );
}
