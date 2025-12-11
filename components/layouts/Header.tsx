// components/layouts/Header.tsx
"use client";

import { NAV_LINKS } from "@/app/lib/constant";
import { cn } from "@/lib/utils";
import Logo from "@/public/images/ezio-kids-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SearchDrawer from "../search/SearchDrawer";
import SearchOpenButton from "../search/SearchOpenButton";
import SideMenu from "./SideMenu";

export default function Header({
  navData,
}: {
  navData: {
    collarTypes: { name: string; slug: string; image: string | null }[];
    fabrics: { name: string; slug: string; image: string | null }[];
  };
}) {
  const [open, setOpen] = useState(false);

  // Icon color: White if transparent home, else Dark
  const iconClass = "text-gray-800 hover:text-gray-600";

  // Base classes for the header container
  const headerClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    "bg-white"
  );

  // Merge dynamic data into NAV_LINKS
  const dynamicLinks = NAV_LINKS.map((item) => {
    if (item.label === "Collar Types") {
      return {
        ...item,
        children: navData.collarTypes.map((c) => ({
          label: c.name,
          href: `/collections/collar/${c.slug}`,
          image: c.image,
        })),
      };
    }
    if (item.label === "Fabrics") {
      return {
        ...item,
        children: navData.fabrics.map((f) => ({
          label: f.name,
          href: `/collections/fabric/${f.slug}`,
          image: f.image,
        })),
      };
    }
    return item;
  });

  return (
    <>
      <header className={headerClass}>
        <div className="px-4 lg:px-6 h-14 grid grid-cols-3 items-center max-w-[1440px]">
          {/* LEFT: Unified Side Menu Trigger */}
          <div className="flex justify-start items-center gap-4">
            <button aria-label="Open menu" onClick={() => setOpen(true)}>
              <svg
                className="h-5 w-5 mt-px"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="14" x2="20" y2="14" />
              </svg>
            </button>

            <Link
              href="/catalog"
              className="hidden md:block uppercase text-[11px] tracking-wider font-bold text-gray-700 "
            >
              CATALOG
            </Link>

            <Link
              href="/journal"
              className="hidden md:block uppercase text-[11px] tracking-wider font-bold text-gray-700 "
            >
              JOURNAL
            </Link>

            <Link
              href="/about"
              className="hidden md:block uppercase text-[11px] tracking-wider font-bold text-gray-700"
            >
              ABOUT
            </Link>
          </div>

          {/* CENTER: Logo (Smaller) */}
          <div className="flex justify-center items-center">
            <Link href="/" className="relative block w-20 lg:w-22">
              <Image
                src={Logo}
                alt="Ezio Kids"
                width={128}
                height={32}
                className="w-full h-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* RIGHT: Utilities */}
          <div className="flex justify-end items-center space-x-4">
            <SearchOpenButton className={iconClass} />
            {/* Add Cart/User icons here if needed in future */}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      <SearchDrawer />

      <SideMenu
        open={open}
        onClose={() => setOpen(false)}
        data={dynamicLinks}
      />
    </>
  );
}
