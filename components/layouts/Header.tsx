// components/layouts/Header.tsx
"use client";

import Logo from "@/public/images/ezio-kids-logo.svg";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import BasketOpenButton from "../basket/BasketOpenButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS } from "@/app/constant";
import { useEffect, useRef } from "react";
import SearchOpenButton from "../search/SearchOpenButton";
import SearchDrawer from "../search/SearchDrawer";

const ClientUserMenu = dynamic(() => import("./ClientUserMenu"), {
  ssr: false,
});

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${el.offsetHeight}px`
      );
    setVar();
    // update if it ever changes size
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mobileNavClass = `lg:hidden ${isHome ? "sticky top-0 z-50 border-b" : "relative border-none"} bg-white`;
  const desktopNavClass = `hidden lg:flex ${isHome ? "sticky top-0 z-50 border-b" : "relative border-none"} inset-x-0 h-16 items-center justify-between bg-white px-12`;

  return (
    <>
      {/* Search Drawer */}
      <SearchDrawer />

      {/* MOBILE */}
      <nav aria-label="Mobile navigation" className={mobileNavClass}>
        <div className="relative flex items-center h-16 px-4">
          {/* Top drawer trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="text-2xl text-gray-700">
                <CiMenuBurger className="text-xl" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="bottom"
              className="w-full p-0 border-none bg-white/95 backdrop-blur-md rounded-t-2xl shadow-xl pb-8"
            >
              <SheetHeader className="px-7 pt-4.5 pb-0">
                <div className="flex items-center justify-between">
                  <SheetTitle className="font-bold text-lg">Menu</SheetTitle>
                </div>
              </SheetHeader>

              <Separator />

              {/* Nav list */}
              <nav aria-label="Mobile site links" className="px-4 py-3">
                <ul className="space-y-1.5">
                  {NAV_LINKS.map(({ label, to }) => {
                    const active = pathname === to;
                    return (
                      <li key={to}>
                        <SheetClose asChild>
                          <Link
                            href={to}
                            className={[
                              "block w-full rounded-xl px-4 py-3.5 text-[15px] font-semibold transition min-h-12",
                              active
                                ? "bg-gradient-to-r from-blue-100 via-blue-200 to-sky-200 border-[1px] border-blue-300 text-blue-800 shadow-md"
                                : "bg-white/80 text-gray-900 hover:bg-blue-50 border",
                            ].join(" ")}
                          >
                            {label}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Center logo */}
          <div className="flex flex-1 justify-center ml-18">
            <Link href="/" aria-label="Home" className="pointer-events-auto">
              <Image src={Logo} alt="Ezio Kids" className="h-6 w-auto" />
            </Link>
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center space-x-4">
            <ClientUserMenu />
            <SearchOpenButton />
            <BasketOpenButton />
          </div>
        </div>
      </nav>

      {/* DESKTOP */}
      <nav aria-label="Main navigation" className={desktopNavClass}>
        <div className="flex items-center">
          <Link href="/" aria-label="Home">
            <Image
              src={Logo}
              alt="Ezio Kids"
              className="object-contain hover:scale-105 transition"
              height={24}
              priority={isHome}
            />
          </Link>
        </div>

        <ul
          role="menubar"
          className="flex items-center justify-center space-x-10 ml-10"
        >
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to} role="none">
              <Link
                href={to}
                className={`transition font-semibold hover:underline hover:underline-offset-6 ${
                  label === "New Arrival"
                    ? "text-red-600 font-bold"
                    : "text-gray-700 hover:text-blue-main"
                }`}
                role="menuitem"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-6">
          <ClientUserMenu />
          <SearchOpenButton />
          <BasketOpenButton />
        </div>
      </nav>
    </>
  );
}
