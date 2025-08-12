"use client";

import { imageUrl } from "@/lib/imageUrl";
import { HeroSection } from "@/sanity.types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  content?: HeroSection;
}

/** Mobile/tablet (base) alignment — no breakpoints */
const mobilePositionClass = (position?: string): string => {
  switch (position) {
    case "top-left":
      return "items-start justify-start text-left";
    case "top-center":
      return "items-center justify-start text-center";
    case "top-right":
      return "items-end justify-start text-right";
    case "middle-left":
      return "items-start justify-center text-left";
    case "middle-center":
      return "items-center justify-center text-center";
    case "middle-right":
      return "items-end justify-center text-right";
    case "bottom-left":
      return "items-start justify-end text-left";
    case "bottom-center":
      return "items-center justify-end text-center";
    case "bottom-right":
      return "items-end justify-end text-right";
    default:
      return "items-center justify-center text-center";
  }
};

/** Desktop (lg:) alignment — explicit lg: classes so Tailwind can see them */
const desktopPositionClass = (position?: string): string => {
  switch (position) {
    case "top-left":
      return "lg:items-start lg:justify-start lg:text-left";
    case "top-center":
      return "lg:items-center lg:justify-start lg:text-center";
    case "top-right":
      return "lg:items-end lg:justify-start lg:text-right";
    case "middle-left":
      return "lg:items-start lg:justify-center lg:text-left";
    case "middle-center":
      return "lg:items-center lg:justify-center lg:text-center";
    case "middle-right":
      return "lg:items-end lg:justify-center lg:text-right";
    case "bottom-left":
      return "lg:items-start lg:justify-end lg:text-left";
    case "bottom-center":
      return "lg:items-center lg:justify-end lg:text-center";
    case "bottom-right":
      return "lg:items-end lg:justify-end lg:text-right";
    default:
      return "lg:items-center lg:justify-center lg:text-center";
  }
};

export default function Hero({ content }: HeroProps) {
  if (!content) return null;
  const ctaHref = content?.cta?.href || "/collections/shop-all";

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[60vh] lg:h-[80vh] xl:h-[80vh]">
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

        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className={[
            // responsive paddings using Tailwind breakpoints
            "absolute inset-0 flex flex-col",
            "px-4 py-4 sm:px-8 sm:py-8 lg:px-24 lg:py-24",
            mobilePositionClass(content.textPositionMobile ?? "middle-center"),
            desktopPositionClass(content.textPositionDesktop ?? "bottom-left"),
          ].join(" ")}
        >
          {/* Fluid heading size */}
          <h1 className="font-extrabold text-white leading-tight text-[clamp(28px,4vw,72px)]">
            {content.heading}
          </h1>

          {/* Fluid body size + sensible line length cap */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="mt-4 md:mt-6 text-white/90 text-lg md:text-xl lg:text-2xl md:max-w-3/4"
          >
            {content.subheading}
          </motion.p>

          {/* Fluid button typography + padding */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.4 }}
          >
            <Link
              href={ctaHref}
              prefetch
              className="mt-8 inline-block bg-white text-red-600 font-bold
                   text-base md:text-lg lg:text-xl
                   py-2 md:py-3 px-4 md:px-16
                   rounded-md transition hover:scale-105 duration-200 shadow-none"
            >
              {content?.cta?.label || "Learn More"}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
