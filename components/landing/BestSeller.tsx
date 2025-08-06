"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, type Easing, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BestSellerItem {
  id: string;
  name: string;
  subtitle: string;
  variant: string;
  price: string;
  imageUrl: string;
}

const bestSellers: BestSellerItem[] = [
  {
    id: "butterfly-blooms",
    name: "Butterfly Blooms",
    subtitle: "Smocked Flutter Top",
    variant: "Limited Edition",
    price: "Rp150.000",
    imageUrl: "/images/placeholder.jpg",
  },
  {
    id: "bright-white",
    name: "Bright White",
    subtitle: "Denim Shorts",
    variant: "Signature",
    price: "Rp80.000",
    imageUrl: "/images/placeholder.jpg",
  },
  {
    id: "frosted-fun",
    name: "Frosted Fun",
    subtitle: "Relaxed Pocket Tee",
    variant: "Limited Edition",
    price: "Rp90.000",
    imageUrl: "/images/placeholder.jpg",
  },
  {
    id: "midwash-blue",
    name: "Midwash Blue",
    subtitle: "Denim Jogger",
    variant: "Signature",
    price: "Rp120.000",
    imageUrl: "/images/placeholder.jpg",
  },
];

// animation presets
// one place to tweak your easing
const EASE: Easing = [0.22, 1, 0.36, 1]; // roughly "easeOut"

// variants with proper typing
const sectionEnter: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const gridContainer: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const gridItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

export default function BestSeller() {
  return (
    <section
      aria-labelledby="best-sellers-heading"
      className="bg-rose-100 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <motion.h2
          id="best-sellers-heading"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={sectionEnter}
          className="text-3xl font-bold text-gray-900"
        >
          Best Sellers
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="mt-2 text-gray-700 font-semibold"
        >
          Our top picks loved by kids and parents alike!
        </motion.p>

        {/* DESKTOP GRID */}
        <motion.ul
          role="list"
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="hidden lg:grid grid-cols-4 gap-8 mt-10"
        >
          {bestSellers.map((item) => (
            <motion.li
              key={item.id}
              variants={gridItem}
              whileHover={{ y: -6, transition: { duration: 0.18 } }}
              className="bg-white rounded-lg shadow-sm"
            >
              <Link
                href={`/products/${item.id}`}
                aria-label={`View ${item.name}`}
                className="block h-full"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-gray-500">
                    {item.variant}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                  <p className="mt-2 text-base font-medium text-gray-900">
                    {item.price}
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* MOBILE & TABLET CAROUSEL (fade/slide in block, per-card stagger) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={sectionEnter}
          className="lg:hidden mt-10 relative"
        >
          <Carousel opts={{ align: "start", loop: false }}>
            <CarouselPrevious
              aria-label="Previous best seller"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-rose-200 text-gray-900 hover:text-white rounded-full z-10 cursor-pointer border-none"
            >
              ←
            </CarouselPrevious>

            <CarouselContent className="flex">
              {bestSellers.map((item, i) => (
                <CarouselItem
                  key={item.id}
                  className="flex-none basis-8/12 sm:basis-1/2 md:basis-1/3 cursor-pointer"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                      delay: 0.06 * i,
                    }}
                    className="relative group h-full w-full"
                  >
                    <Link
                      href={`/products/${item.id}`}
                      aria-label={`View ${item.name}`}
                      className="relative flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 group-hover:-translate-y-2"
                    >
                      {/* Variant badge */}
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.1 + 0.06 * i }}
                        className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded-full z-10"
                      >
                        {item.variant}
                      </motion.div>

                      {/* Image + gradient overlay */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Text */}
                      <div className="p-4 flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.subtitle}</p>
                        <p className="mt-auto text-lg font-bold text-gray-900">
                          {item.price}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselNext
              aria-label="Next best seller"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-rose-200 text-gray-900 hover:text-white rounded-full z-10 cursor-pointer border-none"
            >
              →
            </CarouselNext>
          </Carousel>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="mt-8"
        >
          <Link
            href="/collections/best-seller"
            className="inline-block px-8 py-3 bg-red-500/90 text-white font-semibold rounded-lg hover:bg-red-600/80 transition w-full sm:w-auto"
          >
            Snag the Faves!
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
