// components/landing/BestSeller.client.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import ProductTile from "../common/ProductTile";

type Item = {
  id: string;
  name: string;
  price: number | null;
  slug: string;
  image?: string;
  badge: string | null;
};

const enterSection: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const enterRow: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const enterCard: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export default function BestSellerClient({ items }: { items: Item[] }) {
  if (!items?.length) return null;

  // UI helpers
  const moreThanOne = items.length > 1;
  const desktopCols = "grid-cols-[repeat(auto-fit,minmax(230px,1fr))]";

  return (
    <section
      aria-labelledby="best-sellers-heading"
      className="relative overflow-hidden bg-rose-50/60 py-10 md:py-16"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-[linear-gradient(to_right,rgba(0,0,0,.9)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.9)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(65%_60%_at_50%_0%,black,transparent)] bg-[radial-gradient(60%_45%_at_40%_10%,rgba(244,63,94,.18),transparent),radial-gradient(40%_35%_at_80%_10%,rgba(99,102,241,.16),transparent)]" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          variants={enterSection}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs md:text-sm lg:text-base font-semibold text-rose-600 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5" />
            <span className="hidden sm:inline">Shop Favourites</span>
            <span className="sm:hidden">Favourites</span>
          </span>

          <h2
            id="best-sellers-heading"
            className="mt-3 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-3xl lg:text-5xl font-extrabold leading-tight text-transparent"
          >
            Best Sellers
          </h2>

          <p className="mx-auto mt-2 lg:mt-4 max-w-prose text-lg lg:text-2xl font-medium text-gray-700/90">
            Our top picks loved by kids and parents alike!
          </p>
        </motion.div>

        {/* Desktop / Large screens */}
        <motion.ul
          role="list"
          variants={enterRow}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "20% 0px" }}
          className={[
            "mt-10 hidden md:grid gap-7",
            desktopCols,
            "md:max-w-lg mx-auto",
          ].join(" ")}
          style={{ contentVisibility: "auto" }}
        >
          {items.map((it) => (
            <motion.li key={it.id} variants={enterCard} className="group">
              <ProductTile
                href={it.slug ? `/products/${it.slug}` : "#"}
                name={it.name}
                price={it.price}
                image={it.image}
                badge={it.badge}
                variant="accent"
                aspectClass="aspect-[4/5]"
              />
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile / Tablet carousel */}
        <motion.div
          variants={enterSection}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mt-8 md:hidden"
        >
          {/* gradient edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-rose-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-rose-50 to-transparent" />

          <Carousel
            opts={{
              align: "start",
              loop: moreThanOne,
            }}
          >
            {moreThanOne && (
              <CarouselPrevious
                aria-label="Previous best seller"
                className="absolute left-1 top-1/2 z-20 -translate-y-1/2 h-9 w-9 rounded-full border-none bg-white/90 shadow hover:bg-rose-200 focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <ChevronLeft className="h-5 w-5 text-gray-900" />
              </CarouselPrevious>
            )}

            <CarouselContent role="list" className="-ml-4 flex">
              {items.map((it) => (
                <CarouselItem
                  key={it.id}
                  role="listitem"
                  className="pl-4 basis-9/12 sm:basis-1/2 md:basis-1/3"
                >
                  <motion.div
                    variants={enterCard}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    <ProductTile
                      href={it.slug ? `/products/${it.slug}` : "#"}
                      name={it.name}
                      price={it.price}
                      image={it.image}
                      badge={it.badge}
                      variant="accent"
                      aspectClass="aspect-[4/5]"
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {moreThanOne && (
              <CarouselNext
                aria-label="Next best seller"
                className="absolute right-1 top-1/2 z-20 -translate-y-1/2 h-9 w-9 rounded-full border-none bg-white/90 shadow hover:bg-rose-200 focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <ChevronRight className="h-5 w-5 text-gray-900" />
              </CarouselNext>
            )}
          </Carousel>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={enterSection}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/collections/shop-all?tag=best-seller"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-rose-500 to-rose-600 px-6 py-2.5 text-lg font-semibold text-white transition hover:brightness-110 sm:w-auto sm:px-8 sm:py-3 sm:text-lg lg:px-10 lg:py-4 lg:text-xl"
          >
            Snag the Faves!
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
