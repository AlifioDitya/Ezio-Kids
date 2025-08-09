// components/landing/NewArrivalClient.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";
import { motion, type Easing, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const EASE: Easing = [0.16, 1, 0.3, 1];

const sectionEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.0, ease: EASE } },
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

export default function NewArrivalClient({ items }: { items: Product[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedSnap(api.selectedScrollSnap());
    const updateSnaps = () => {
      setSnapCount(api.scrollSnapList().length);
      setSelectedSnap(api.selectedScrollSnap());
    };
    updateSnaps();
    api.on("select", onSelect);
    api.on("reInit", updateSnaps);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", updateSnaps);
    };
  }, [api]);

  const scrollToSnap = (i: number) => api?.scrollTo(i);

  if (!items?.length) return null;

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className="bg-indigo-50 py-8 md:py-12"
    >
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading + dots */}
        <motion.div
          variants={sectionEnter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3"
        >
          <h2
            id="new-arrivals-heading"
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 text-center"
          >
            New Arrivals for Your Little Ones
          </h2>

          <nav aria-label="New Arrivals pagination" className="flex space-x-2">
            {Array.from({ length: snapCount }).length > 1 &&
              Array.from({ length: snapCount }).map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => scrollToSnap(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-pressed={selectedSnap === idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.06 * idx, ease: EASE }}
                  className={`h-2 w-2 rounded-full transition-colors cursor-pointer ${
                    selectedSnap === idx ? "bg-gray-900" : "bg-gray-400"
                  }`}
                />
              ))}
          </nav>
        </motion.div>

        {/* Carousel row */}
        <motion.div
          variants={rowEnter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "60% 0px" }}
          className="relative"
        >
          <Carousel setApi={setApi} opts={{ align: "start", loop: false }}>
            <CarouselPrevious
              aria-label="Previous slide"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-indigo-200 text-gray-900 hover:text-white rounded-full z-10 cursor-pointer border-none"
            >
              ←
            </CarouselPrevious>

            <CarouselContent
              role="list"
              aria-label="New Arrivals"
              className="-ml-4 flex"
            >
              {items.map((item, idx) => {
                const href = item.slug ? `/products/${item.slug}` : "#";
                const imgSrc = item.mainImage
                  ? (imageUrl(item.mainImage)?.url() ?? "")
                  : "";
                const price =
                  typeof item.price === "number"
                    ? `IDR ${item.price.toLocaleString("id-ID")}`
                    : "—";
                return (
                  <CarouselItem
                    key={idx}
                    role="listitem"
                    className="flex-none basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 hover:scale-[98%] transition-transform duration-300 cursor-pointer"
                  >
                    <motion.div variants={cardItem} className="h-full w-full">
                      <Link
                        href={href}
                        className="flex flex-col h-full w-full gap-3"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-white">
                          {imgSrc ? (
                            <Image
                              src={imgSrc}
                              alt={item.name || "Product image"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-gray-700 text-sm">{price}</p>
                        </div>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselNext
              aria-label="Next slide"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-indigo-200 text-gray-900 hover:text-white rounded-full z-10 cursor-pointer border-none"
            >
              →
            </CarouselNext>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
