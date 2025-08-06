import Footer from "@/components/layouts/Footer";
import HeaderWithSale from "@/components/layouts/HeaderWithSale";
import { DisableDraftMode } from "@/components/sanity/disableDraftMode";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity";
import { Poppins, Quicksand } from "next/font/google";
import { draftMode } from "next/headers";
import "../globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
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
    <ClerkProvider dynamic>
      <html lang="en">
        <body
          className={`${quicksand.variable} ${poppins.variable} antialiased`}
        >
          {(await draftMode()).isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}

          <HeaderWithSale />
          {children}
          <Footer />

          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
