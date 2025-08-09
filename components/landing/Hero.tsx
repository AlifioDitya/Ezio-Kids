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
      <div className="relative h-[60vh] md:h-[calc(100vh-30rem)] lg:h-[calc(100vh-18rem)] xl:h-[calc(100vh-8rem)]">
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
            // fluid paddings so spacing scales on big screens
            "absolute inset-0 flex flex-col",
            "px-[clamp(16px,5vw,96px)] py-[clamp(16px,6vw,96px)]",
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
            className="mt-[clamp(8px,1.2vw,16px)] text-white/90 text-[clamp(14px,1.2vw,20px)] max-w-[min(90vw,60ch)]"
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
              className="mt-[clamp(16px,2vw,24px)] inline-block bg-white text-red-600 font-bold
                         text-[clamp(14px,1vw,18px)]
                         py-[clamp(10px,1.2vw,14px)] px-[clamp(16px,2vw,28px)]
                         rounded-xl shadow-lg hover:bg-red-50 transition hover:scale-105 duration-200"
            >
              {content?.cta?.label || "Learn More"}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
