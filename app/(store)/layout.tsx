import Footer from "@/components/layouts/Footer";
import HeaderWithSale from "@/components/layouts/HeaderWithSale";
import { DisableDraftMode } from "@/components/sanity/disableDraftMode";
import { SanityLive } from "@/sanity/lib/live";

import OverlayScrollbar from "@/components/ui/overlay-scrollbar";
import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { draftMode } from "next/headers";
import "../globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EZIO KIDS | Limitless Creativity",
  description:
    "Shop Ezio Kids for modern, durable children's clothing. Discover our best collections from premium fabric.",
  icons: {
    icon: [
      {
        url: "/images/ezio-kids-logo.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${manrope.variable} ${bebasNeue.variable} antialiased`}
        >
          {(await (async () => {
            try {
              return (await draftMode()).isEnabled;
            } catch {
              return false;
            }
          })()) && (
            <>
              <DisableDraftMode />
            </>
          )}
          <HeaderWithSale />
          {children}
          <Footer />
          <SanityLive />
          <OverlayScrollbar />
        </body>
      </html>
    </>
  );
}
