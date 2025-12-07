// components/layouts/Header.tsx
"use client";

import { NAV_LINKS } from "@/app/constant";
import { cn } from "@/lib/utils";
import Logo from "@/public/images/ezio-kids-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SearchDrawer from "../search/SearchDrawer";
import SearchOpenButton from "../search/SearchOpenButton";
import SideMenu from "./SideMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Icon color: White if transparent home, else Dark
  const iconClass = "text-gray-800 hover:text-gray-600";

  // Base classes for the header container
  const headerClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    "bg-white"
  );

  return (
    <>
      <header className={headerClass}>
        <div className="px-6 h-14 grid grid-cols-3 items-center max-w-[1440px]">
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
              className="uppercase text-[11px] tracking-wider font-semibold "
            >
              CATALOG
            </Link>

            <Link
              href="/journal"
              className="uppercase text-[11px] tracking-wider font-semibold "
            >
              JOURNAL
            </Link>

            <Link
              href="/about"
              className="uppercase text-[11px] tracking-wider font-semibold"
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

      <SideMenu open={open} onClose={() => setOpen(false)} data={NAV_LINKS} />
    </>
  );
}
