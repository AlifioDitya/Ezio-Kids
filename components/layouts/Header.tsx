// components/layouts/Header.tsx
"use client";

import { NAV_LINKS } from "@/app/lib/constant";
import { cn } from "@/lib/utils";
import Logo from "@/public/images/ezio-kids-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll detection
  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we are on a specific journal page OR fabric collection page OR about page
  const isTransparentPage =
    (pathname?.startsWith("/journal/") && pathname !== "/journal") ||
    pathname?.startsWith("/collections/fabric/") ||
    pathname === "/about";

  const isTransparent = isTransparentPage && !isScrolled;

  // Icon color: White if transparent layout, else Dark
  const iconClass = isTransparent
    ? "text-white hover:text-white/80"
    : "text-gray-800 hover:text-gray-600";

  // Base classes for the header container
  const headerClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isTransparent
      ? "bg-transparent backdrop-blur-[2px] border-b border-white/10"
      : "bg-white/80 backdrop-blur-md border-b border-gray-200/50"
  );

  // Link text color
  const linkClass = cn(
    "hidden md:block uppercase text-[11px] tracking-wider font-bold transition-colors duration-300",
    isTransparent ? "text-white" : "text-gray-700"
  );

  // Merge dynamic data into NAV_LINKS
  const dynamicLinks = NAV_LINKS.map((item) => {
    if (item.label === "Fabrics") {
      const fabricChildren: (typeof item.children extends
        | (infer U)[]
        | undefined
        ? U
        : never)[] = navData.fabrics.map((f) => ({
        label: f.name,
        href: `/collections/fabric/${f.slug}`,
        image: f.image,
      }));

      // Create "All Fabrics" item with composite images
      const allFabricsImages = navData.fabrics
        .map((f) => f.image)
        .filter((img): img is string => !!img)
        .slice(0, 3);

      // Always add "All Fabrics" at the top
      fabricChildren.unshift({
        label: "All Fabrics",
        href: "/fabrics",
        images: allFabricsImages,
      });

      return {
        ...item,
        children: fabricChildren,
      };
    }

    return item;
  });

  return (
    <>
      <header className={headerClass}>
        <div className="px-4 lg:px-6 h-14 grid grid-cols-3 items-center">
          {/* LEFT: Unified Side Menu Trigger */}
          <div className="flex justify-start items-center gap-4">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className={isTransparent ? "text-white" : "text-gray-800"}
            >
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

            <Link href="/catalog" className={linkClass}>
              CATALOG
            </Link>

            <Link href="/journal" className={linkClass}>
              JOURNAL
            </Link>

            <Link href="/about" className={linkClass}>
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
                className={cn("w-full h-auto object-contain")}
                priority
              />
            </Link>
          </div>

          {/* RIGHT: Utilities */}
          <div className="flex justify-end items-center space-x-5">
            <Link href="/contact" className={linkClass}>
              CONTACT US
            </Link>
            <SearchOpenButton className={iconClass} />
            {/* Add Cart/User icons here if needed in future */}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header - Only render if NOT on a transparent page */}
      {!isTransparentPage && <div className="h-14" />}

      <SearchDrawer />

      <SideMenu
        open={open}
        onClose={() => setOpen(false)}
        data={dynamicLinks}
      />
    </>
  );
}
