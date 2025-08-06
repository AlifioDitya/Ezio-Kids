"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion, type Easing, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const products = [
  { id: 1, title: "Sprint Tennis Skirt", price: "Rp80.000" },
  { id: 2, title: "Playa Swim Trunk", price: "Rp120.000" },
  { id: 3, title: "Safari Two Piece Swim", price: "Rp150.000" },
  { id: 4, title: "Rise & Shine Romper", price: "Rp100.000" },
  { id: 5, title: "Poolside Flutter Tank", price: "Rp100.000" },
  { id: 6, title: "Sunny Day Dress", price: "Rp300.000" },
  { id: 7, title: "Adventure Shorts", price: "Rp100.000" },
  { id: 8, title: "Beachcomber Tee", price: "Rp100.000" },
  { id: 9, title: "Explorer Cargo Pants", price: "Rp100.000" },
  { id: 10, title: "Sunset Hoodie", price: "Rp100.000" },
];

// smooth "easeOut" cubic-bezier to satisfy TS
const EASE: Easing = [0.22, 1, 0.36, 1];

const sectionEnter: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const rowEnter: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

export function NewArrival() {
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

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className="bg-indigo-50 py-8 md:py-12"
    >
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading + Dots */}
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
            {Array.from({ length: snapCount }).map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => scrollToSnap(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-pressed={selectedSnap === idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.04 * idx }}
                className={`h-2 w-2 rounded-full transition-colors ${
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
          viewport={{ once: true, margin: "-10% 0px" }}
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
              {products.map((prod) => (
                <CarouselItem
                  key={prod.id}
                  role="listitem"
                  className="flex-none basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 hover:scale-[98%] transition-transform duration-300 cursor-pointer"
                >
                  <motion.div variants={cardItem} className="h-full w-full">
                    <Link
                      href={`/products/${prod.id}`}
                      className="flex flex-col h-full w-full gap-3"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                        <Image
                          src="/images/placeholder-2.jpg"
                          alt={prod.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {prod.title}
                        </h3>
                        <p className="text-gray-700 text-sm">{prod.price}</p>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
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
