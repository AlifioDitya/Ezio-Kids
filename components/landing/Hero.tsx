"use client";

import { imageUrl } from "@/lib/imageUrl";
import { HeroSection } from "@/sanity.types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  content?: HeroSection;
}

export default function Hero({ content }: HeroProps) {
  if (!content) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[70vh] sm:h-[calc(100vh-4rem)]">
        {/* Static background image */}
        {content.backgroundImage && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl(content.backgroundImage)?.url() || ""}
              alt={content.backgroundImage.alt || "Hero Background"}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        )}

        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-transparent" />

        {/* Fade-in text block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="absolute inset-0 flex flex-col justify-center sm:justify-end items-center sm:items-start text-center sm:text-left px-6 sm:px-12 sm:py-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {content.heading}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="mt-2 sm:mt-4 text-sm sm:text-lg text-white/90 max-w-xs sm:max-w-md"
          >
            {content.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.4 }}
          >
            <Link
              href={content?.cta?.href || "#"}
              className="mt-4 sm:mt-6 inline-block bg-white text-red-600 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:bg-red-50 transition hover:scale-105 duration-200"
            >
              {content?.cta?.label || "Learn More"}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative blob (unchanged) */}
      <div className="hidden lg:block absolute right-4 bottom-4 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply opacity-20 animate-pulse" />
    </section>
  );
}
