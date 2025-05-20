import "@/src/globals.css";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";
import { FooterServer, FooterSkeleton } from "../components/footer";
import { NavbarServer } from "../components/navbar";
import { SanityLive } from "../sanity/lib/live";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  return (
    <html lang="en" suppressHydrationWarning className="bg-black">
      <body className={`font-geist antialiased bg-black `}>
        <NavbarServer />
        {children}
        <Suspense fallback={<div />}>
          <FooterServer />
        </Suspense>
        <SanityLive />
      </body>
    </html>
  );
}
