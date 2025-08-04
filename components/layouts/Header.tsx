"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { HiMenu, HiX } from "react-icons/hi";

import Logo from "@/public/images/ezio-kids-logo.svg";
import Image from "next/image";

const links = [
  { label: "Shop All", to: "/collections/all" },
  { label: "Girls", to: "/collections/girls" },
  { label: "Boys", to: "/collections/boys" },
  { label: "Baby & Toddler", to: "/collections/baby" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      {/** MOBILE NAV */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed inset-x-0 top-0 z-50 bg-white border-b"
      >
        <div className="relative flex items-center h-16 px-4">
          {/* Hamburger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="text-2xl text-gray-700"
          >
            {open ? <HiX /> : <HiMenu />}
          </button>

          {/* Logo (centered but pointer-events-none so clicks fall through) */}
          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <Image src={Logo} alt="Ezio Kids" className="h-6" />
          </div>

          {/* User, Search, Cart */}
          <div className="ml-auto flex items-center space-x-4">
            {user ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <div className="text-gray-700 hover:text-red-600 transition cursor-pointer font-semibold">
                  Sign In
                </div>
              </SignInButton>
            )}
            <button
              aria-label="Search"
              className="text-xl text-gray-600 hover:text-gray-800 transition"
            >
              <CiSearch />
            </button>
            <button
              aria-label="Cart"
              className="text-xl text-gray-600 hover:text-gray-800 transition"
            >
              <CiShoppingCart />
            </button>
          </div>
        </div>

        {/* slide-down links */}
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

      {/** DESKTOP NAV */}
      <nav
        aria-label="Main navigation"
        className="hidden lg:flex fixed inset-x-0 top-0 z-50 h-16 items-center justify-between bg-white border-b px-12 shadow-sm"
      >
        {/* logo left */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={Logo}
              alt="Ezio Kids"
              className="object-contain"
              height={24}
            />
          </Link>
        </div>

        {/* links center */}
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

        {/* icons right */}
        <div className="flex items-center space-x-6">
          {/* User button or sign in */}
          {user ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <div className="text-gray-700 hover:text-red-600 transition cursor-pointer font-semibold">
                Sign In
              </div>
            </SignInButton>
          )}

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
