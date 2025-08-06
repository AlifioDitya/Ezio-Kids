"use client";

import Logo from "@/public/images/ezio-kids-logo.svg";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { HiMenu, HiX } from "react-icons/hi";

const links = [
  { label: "Shop All", to: "/collections/shop-all" },
  { label: "Girls", to: "/collections/girls" },
  { label: "Boys", to: "/collections/boys" },
  { label: "Baby & Toddler", to: "/collections/baby" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const mobileNavClass = `lg:hidden ${
    isHome ? "sticky top-0 z-50" : "relative"
  } bg-white border-b`;
  const desktopNavClass = `hidden lg:flex ${
    isHome ? "sticky top-0 z-50" : "relative"
  } inset-x-0 h-16 items-center justify-between bg-white border-b px-12`;

  return (
    <>
      {/* MOBILE */}
      <nav aria-label="Mobile navigation" className={mobileNavClass}>
        <div className="relative flex items-center h-16 px-4">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="text-2xl text-gray-700"
          >
            {open ? <HiX /> : <HiMenu />}
          </button>

          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <Image src={Logo} alt="Ezio Kids" className="h-6 w-auto" />
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <div className="text-gray-700 hover:text-red-600 transition cursor-pointer font-semibold">
                  Sign In
                </div>
              </SignInButton>
            </SignedOut>

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
          <div className="bg-white border-t">
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
                className="text-gray-700 hover:text-red-600 transition font-semibold hover:underline hover:underline-offset-6"
                role="menuitem"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-6">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <div className="text-gray-700 hover:text-red-600 transition cursor-pointer font-semibold">
                Sign In
              </div>
            </SignInButton>
          </SignedOut>

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
