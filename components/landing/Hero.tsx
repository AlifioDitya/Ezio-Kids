"use client";

import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => (
  <section className="relative w-full overflow-hidden">
    {/* Background container with responsive height */}
    <div className="relative h-[70vh] sm:h-[calc(100vh-4rem)]">
      <Image
        src="/images/banner.jpg"
        alt="Children playing in vibrant outfits outdoors"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent" />

      {/* Text content, centered on mobile, left-aligned on desktop */}
      <div className="absolute inset-0 flex flex-col justify-center sm:justify-end items-center sm:items-start text-center sm:text-left px-6 sm:px-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Discover the Joy of Ezio
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-white/90 max-w-xs sm:max-w-md">
          Explore our sustainable kidswear collection designed for every
          adventure.
        </p>
        <Link
          href="/shop"
          className="mt-4 sm:mt-6 inline-block bg-white text-red-600 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:bg-red-50 transition"
        >
          Shop the Collection
        </Link>
      </div>
    </div>

    {/* Subtle decorative accent on large screens */}
    <div className="hidden lg:block absolute right-4 bottom-4 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply opacity-20 animate-pulse" />
  </section>
);

export default Hero;
