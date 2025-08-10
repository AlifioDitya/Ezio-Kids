// components/landing/BestSeller.client.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { imageUrl } from "@/lib/imageUrl";
import { motion, type Easing, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

type Item = {
  id: string;
  name: string;
  price: number | null;
  slug: string;
  image?: string;
  badge: string | null;
};

const EASE: Easing = [0.16, 1, 0.3, 1];

const sectionEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const rowEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      type: "spring",
      stiffness: 60,
      damping: 18,
      mass: 0.7,
      staggerChildren: 0.08,
    },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 16, mass: 0.7 },
  },
};

export default function BestSellerClient({ items }: { items: Item[] }) {
  if (!items?.length) return null;

  return (
    <section
      aria-labelledby="best-sellers-heading"
      className="relative overflow-hidden bg-rose-50/60 py-10 md:py-16"
    >
      {/* backdrop gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-[radial-gradient(65%_60%_at_50%_-20%,rgba(244,63,94,0.25),transparent),radial-gradient(40%_35%_at_10%_110%,rgba(99,102,241,0.18),transparent)]" />
      {/* soft grid texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-[linear-gradient(to_right,rgba(0,0,0,.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.8)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 text-center">
        {/* Eyebrow + Heading */}
        <motion.div
          variants={sectionEnter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Shop Favourites
          </span>

          <h2
            id="best-sellers-heading"
            className="bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent font-extrabold leading-tight text-[clamp(22px,2.6vw,36px)]"
          >
            Best Sellers
          </h2>

          <p className="max-w-prose text-[clamp(13px,1.1vw,16px)] text-gray-700/90 font-medium">
            Our top picks loved by kids and parents alike!
          </p>
        </motion.div>

        {/* DESKTOP GRID */}
        <motion.ul
          role="list"
          variants={rowEnter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "35% 0px" }}
          className="hidden lg:grid grid-cols-4 gap-7 mt-10"
        >
          {items.map((item) => {
            const href = item.slug ? `/products/${item.slug}` : "#";
            const imgSrc = item.image
              ? (imageUrl(item.image)?.url() ?? "")
              : "";
            const price =
              typeof item.price === "number"
                ? `Rp ${item.price.toLocaleString("id-ID")}`
                : "—";

            return (
              <motion.li
                key={item.id}
                variants={cardItem}
                className="group relative"
              >
                <div className="perspective-[1200px]">
                  <motion.div
                    whileHover={{ rotateX: -2, rotateY: 2, y: -6 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                      mass: 0.6,
                    }}
                    className="relative rounded-2xl bg-rose-200 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_40px_-20px_rgba(0,0,0,0.25)]"
                  >
                    <div className="rounded-2xl bg-white/80 backdrop-blur-sm overflow-hidden ring-1 ring-black/5">
                      {/* Image */}
                      <div className="relative aspect-[3/4]">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}

                        {/* top badge = any tag other than best-seller */}
                        {item.badge ? (
                          <div className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-gradient-to-b from-rose-500 to-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                            {item.badge}
                          </div>
                        ) : null}
                      </div>

                      {/* Text */}
                      <div className="p-4 text-left">
                        <h3 className="text-[15px] font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-[12px] font-semibold text-rose-700">
                            {price}
                          </span>
                          <Link
                            href={href}
                            aria-label={`View ${item.name}`}
                            className="text-sm font-semibold text-rose-700 hover:text-rose-800"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* MOBILE/TABLET CAROUSEL */}
        <motion.div
          variants={sectionEnter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="lg:hidden mt-8 relative"
        >
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-rose-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-rose-50 to-transparent" />

          <Carousel opts={{ align: "start", loop: false }}>
            <CarouselPrevious
              aria-label="Previous best seller"
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full border-none bg-white/90 shadow hover:bg-rose-200 focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <ChevronLeft className="h-5 w-5 text-gray-900" />
            </CarouselPrevious>

            <CarouselContent role="list" className="-ml-4 flex">
              {items.map((item) => {
                const href = item.slug ? `/products/${item.slug}` : "#";
                const imgSrc = item.image
                  ? (imageUrl(item.image)?.url() ?? "")
                  : "";
                const price =
                  typeof item.price === "number"
                    ? `Rp ${item.price.toLocaleString("id-ID")}`
                    : "—";

                return (
                  <CarouselItem
                    key={item.id}
                    role="listitem"
                    className="pl-4 flex-none basis-8/12 sm:basis-1/2 md:basis-1/3"
                  >
                    <motion.div
                      variants={cardItem}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Link
                        href={href}
                        aria-label={`View ${item.name}`}
                        className="relative block rounded-2xl p-[1px] bg-rose-200 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_20px_40px_-20px_rgba(0,0,0,0.25)]"
                      >
                        <div className="rounded-2xl bg-white/85 backdrop-blur-sm overflow-hidden ring-1 ring-black/5">
                          <div className="relative aspect-[3/4]">
                            {imgSrc ? (
                              <Image
                                src={imgSrc}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100" />
                            )}

                            {item.badge ? (
                              <div className="absolute left-2.5 top-2.5 z-10 inline-flex items-center rounded-full bg-gradient-to-b from-rose-500 to-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                                {item.badge}
                              </div>
                            ) : null}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>

                          <div className="p-4 text-left">
                            <h3 className="text-[15px] font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="mt-2 text-[15px] font-bold text-gray-900">
                              {price}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselNext
              aria-label="Next best seller"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full border-none bg-white/90 shadow hover:bg-rose-200 focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </CarouselNext>
          </Carousel>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={sectionEnter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10"
        >
          <Link
            href="/collections/shop-all?tag=best-seller"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-rose-500 to-rose-600 px-8 py-3 font-semibold text-white shadow-lg shadow-rose-500/25 hover:brightness-110 transition w-full sm:w-auto"
          >
            Snag the Faves!
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
