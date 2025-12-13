import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { getAllFabricsQuery } from "@/sanity/lib/products/getAllFabrics";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

interface Fabric {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: SanityImageSource;
  bannerImage?: SanityImageSource;
  excerpt?: string;
}

export default async function FabricSelection() {
  const { data: fabrics } = await sanityFetch({
    query: getAllFabricsQuery,
  });

  if (!fabrics || fabrics.length === 0) {
    return null;
  }

  const displayedFabrics = fabrics.slice(0, 4);

  return (
    <section
      className="py-20 bg-neutral-50"
      aria-labelledby="fabric-selection-heading"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-zinc-500 font-bold tracking-wider uppercase text-sm mb-3 block">
              Curated Materials
            </span>
            <h2
              id="fabric-selection-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bebas text-zinc-900 tracking-wide leading-10 sm:leading-12 lg:leading-14"
            >
              Explore Our <br /> <span className="text-blue-main">Premium</span>
              <span className="text-rose-600"> Fabrics</span>
            </h2>
          </div>

          <Link
            href="/fabrics"
            className="group flex items-center text-zinc-800 font-semibold hover:text-zinc-600 transition-colors pb-2"
          >
            <span className="mr-3 text-lg tracking-wide relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-zinc-800 after:transition-transform group-hover:after:scale-x-100">
              Browse All Fabrics
            </span>
            <BsArrowRight className="text-xl transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {displayedFabrics.map((fabric: Fabric) => (
            <Link
              key={fabric._id}
              href={`/collections/fabric/${fabric.slug}`}
              className="group relative block aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-sm cursor-pointer"
            >
              <div className="absolute inset-0 bg-neutral-200">
                {fabric.image && (
                  <Image
                    src={urlFor(fabric.image).url()}
                    alt={fabric.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

              <div className="absolute bottom-2 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-2xl md:text-3xl font-bebas text-white tracking-wider">
                  {fabric.name}
                </h3>

                <div className="grid grid-rows-[1fr] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                  <div className="overflow-hidden">
                    {fabric.excerpt && (
                      <p className="text-zinc-200 text-sm line-clamp-2 mt-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-75">
                        {fabric.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-white text-xs tracking-widest uppercase font-bold lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-150">
                      <span className="border-b border-white pb-0.5">
                        Shop Collection
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
