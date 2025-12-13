// app/fonts.ts
import { Raleway } from "next/font/google";
import localFont from "next/font/local";

export const satoshi = localFont({
  src: [
    {
      path: "./Satoshi-Variable.ttf",
      style: "normal",
      weight: "100 900",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// google fonts
export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
