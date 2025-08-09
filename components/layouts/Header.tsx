"use client";

import Logo from "@/public/images/ezio-kids-logo.svg";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CiMenuBurger, CiSearch, CiShoppingCart } from "react-icons/ci";
import { VscClose } from "react-icons/vsc";
const ClientUserMenu = dynamic(() => import("./ClientUserMenu"), {
  ssr: false,
});

const links = [
  { label: "New Arrival", to: "/collections/new-arrival" },
  { label: "Shop All", to: "/collections/shop-all" },
  { label: "Baby & Toddler", to: "/collections/baby-toddler" },
  { label: "Kids", to: "/collections/kids" },
  { label: "Teens", to: "/collections/teens" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const mobileNavClass = `lg:hidden ${
    isHome ? "sticky top-0 z-50 border-b" : "relative border-none"
  } bg-white`;
  const desktopNavClass = `hidden lg:flex ${
    isHome ? "sticky top-0 z-50 border-b" : "relative border-none"
  } inset-x-0 h-16 items-center justify-between bg-white px-12`;

  return (
    <>
      {/* MOBILE */}
      <nav aria-label="Mobile navigation" className={mobileNavClass}>
        <div className="relative flex items-center h-16 px-4">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="text-2xl text-gray-700 cursor-pointer"
          >
            {open ? <VscClose /> : <CiMenuBurger className="text-xl" />}
          </button>

          <div className="flex flex-1 justify-center ml-18">
            <Link href="/" aria-label="Home" className="pointer-events-auto">
              <Image src={Logo} alt="Ezio Kids" className="h-6 w-auto" />
            </Link>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <ClientUserMenu />

            <button
              aria-label="Search"
              className="text-xl text-gray-600 hover:text-gray-800 transition"
            >
              <CiSearch />
            </button>
            <Link
              href="/cart"
              aria-label="Cart"
              className="text-xl text-gray-600 hover:text-gray-800 transition"
            >
              <CiShoppingCart />
            </Link>
          </div>
        </div>

        {open && (
          <div className="bg-white border-t border-b">
            <div className="flex flex-col px-4 py-2 space-y-2">
              {links.map(({ label, to }) => (
                <Link
                  key={to}
                  href={to}
                  className="flex items-center justify-between w-full py-2 text-left text-gray-700 hover:text-red-600 transition font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* DESKTOP */}
      <nav aria-label="Main navigation" className={desktopNavClass}>
        <div className="flex items-center">
          <Link href="/" aria-label="Home">
            <Image
              src={Logo}
              alt="Ezio Kids"
              className="object-contain hover:scale-105 transition cursor-pointer"
              height={24}
              priority={isHome}
            />
          </Link>
        </div>

        <ul
          role="menubar"
          className="flex items-center justify-center space-x-10 ml-10"
        >
          {links.map(({ label, to }) => (
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

          <button
            aria-label="Search"
            className="text-2xl text-gray-600 hover:text-gray-800 transition cursor-pointer"
          >
            <CiSearch />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="text-2xl text-gray-600 hover:text-gray-800 transition"
          >
            <CiShoppingCart />
          </Link>
        </div>
      </nav>
    </>
  );
}
