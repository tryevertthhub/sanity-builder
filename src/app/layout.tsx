import "@/src/globals.css";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";
import { FooterServer, FooterSkeleton } from "../components/footer";
import { NavbarServer } from "../components/navbar";
import { SanityLive } from "../sanity/lib/live";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/src/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanity Builder",
  description: "A Sanity.io content builder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  return (
    <html lang="en" suppressHydrationWarning className="bg-black">
      <body className={`font-geist antialiased bg-black ${inter.className}`}>
        <AuthProvider>
          <NavbarServer />
          {children}
          <Suspense fallback={<div />}>
            <FooterServer />
          </Suspense>
          <SanityLive />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
