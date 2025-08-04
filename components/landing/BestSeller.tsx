"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

export default function BestSeller() {
  return (
    <section
      aria-labelledby="best-sellers-heading"
      className="bg-rose-100 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          id="best-sellers-heading"
          className="text-3xl font-bold text-gray-900"
        >
          Best Sellers
        </h2>
        <p className="mt-2 text-gray-700 font-semibold">
          Our top picks loved by kids and parents alike!
        </p>

        {/* DESKTOP GRID */}
        <ul role="list" className="hidden lg:grid grid-cols-4 gap-8 mt-10">
          {bestSellers.map((item) => (
            <li key={item.id} className="bg-white rounded-lg shadow-sm">
              <Link
                href={`/products/${item.id}`}
                aria-label={`View ${item.name}`}
                className="block h-full hover:scale-[98%] transition-transform duration-300"
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
            </li>
          ))}
        </ul>

        {/* MOBILE & TABLET CAROUSEL */}
        <div className="lg:hidden mt-10 relative">
          <Carousel opts={{ align: "start", loop: false }}>
            <CarouselPrevious
              aria-label="Previous best seller"
              className="
                absolute left-0 top-1/2 -translate-y-1/2
                p-2 bg-white/80 hover:bg-rose-200
                text-gray-900 hover:text-white
                rounded-full z-10 cursor-pointer
                border-none
              "
            >
              ←
            </CarouselPrevious>

            <CarouselContent className="flex">
              {bestSellers.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="
                    flex-none
                    basis-8/12 sm:basis-1/2 md:basis-1/3
                    cursor-pointer
                  "
                >
                  <div className="relative group h-full w-full">
                    <Link
                      href={`/products/${item.id}`}
                      aria-label={`View ${item.name}`}
                      className="
                        relative flex flex-col h-full bg-white rounded-xl
                        shadow-lg overflow-hidden
                        transform transition-transform duration-300
                        group-hover:-translate-y-2
                      "
                    >
                      {/* Variant badge */}
                      <div
                        className="
                          absolute top-2 left-2
                          bg-red-600 text-white text-xs font-semibold
                          uppercase px-2 py-1
                          rounded-full
                          z-10
                        "
                      >
                        {item.variant}
                      </div>

                      {/* Image + gradient overlay */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="
                            object-cover
                            transition-transform duration-500
                            group-hover:scale-105
                          "
                        />
                        <div
                          className="
                            absolute inset-0
                            bg-gradient-to-t from-black/40 to-transparent
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-500
                          "
                        />
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
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselNext
              aria-label="Next best seller"
              className="
                absolute right-0 top-1/2 -translate-y-1/2
                p-2 bg-white/80 hover:bg-rose-200
                text-gray-900 hover:text-white
                rounded-full z-10 cursor-pointer
                border-none
              "
            >
              →
            </CarouselNext>
          </Carousel>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link
            href="/collections/best-seller"
            className="inline-block px-8 py-3 bg-red-500/90 text-white font-semibold rounded-lg hover:bg-red-600/80 transition w-full sm:w-auto"
          >
            Snag the Faves!
          </Link>
        </div>
      </div>
    </section>
  );
}
