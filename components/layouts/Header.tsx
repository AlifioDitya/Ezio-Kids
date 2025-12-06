// components/layouts/Header.tsx
"use client";

import { NAV_LINKS } from "@/app/constant";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "@/public/images/ezio-kids-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchDrawer from "../search/SearchDrawer";
import SearchOpenButton from "../search/SearchOpenButton";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic colors based on state
  const isTransparent = isHome && !scrolled;

  // Icon color: White if transparent home, else Dark
  const iconClass = isTransparent
    ? "text-white hover:text-white/80"
    : "text-gray-800 hover:text-gray-600";

  // Base classes for the header container
  const headerClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
    isTransparent ? "bg-transparent border-transparent" : "bg-white"
  );

  return (
    <>
      <header className={headerClass}>
        <div className="px-6 h-14 grid grid-cols-3 items-center max-w-[1440px]">
          {/* LEFT: Unified Side Menu Trigger */}
          <div className="flex justify-start items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className={cn("p-2 -ml-2 text-2xl transition", iconClass)}
                >
                  <div className="w-4 h-px bg-current mb-2 rounded" />
                  <div className="w-4 h-px bg-current rounded" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full h-full sm:w-[350px] sm:h-auto p-0 border-r-0 bg-white backdrop-blur-xl"
              >
                <SheetHeader className="px-6 py-6 text-left border-b border-gray-100 flex flex-row items-center justify-between">
                  <SheetTitle className="text-2xl font-bold font-bebas tracking-wide text-gray-900"></SheetTitle>
                  {/* Mobile close button is handled by Sheet primitive, usually top right */}
                </SheetHeader>
                <nav className="flex flex-col py-4 h-full overflow-y-auto">
                  {NAV_LINKS.map((link) => (
                    <SheetClose key={link.to} asChild>
                      <Link
                        href={link.to}
                        className={cn(
                          "group flex items-center px-6 py-5 text-lg font-medium transition-all border-b border-gray-50 last:border-none",
                          pathname === link.to
                            ? "text-gray-900 bg-gray-50/50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/30"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
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
      {!isHome && <div className="h-14 md:h-16" />}

      <SearchDrawer />
    </>
  );
}
