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
  title: "Ezio Kids - Playful, Sustainable Kidswear",
  description:
    "Shop Ezio Kids for bright, eco-friendly, and durable children's clothing. Discover our new arrivals and best sellers!",
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
          {(await draftMode()).isEnabled && (
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
