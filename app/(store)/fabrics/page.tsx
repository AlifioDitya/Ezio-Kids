import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { getAllFabricsQuery } from "@/sanity/lib/products/getAllFabrics";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

export const metadata = {
  title: "Premium Fabrics | Ezio Kids",
  description:
    "Explore our collection of premium, kid-friendly fabrics tailored for comfort and style.",
};

interface Fabric {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: SanityImageSource;
  bannerImage?: SanityImageSource;
  excerpt?: string;
  weight?: string;
  properties?: { key: string; value: string }[];
  journal?: { title: string; slug: string };
}

export const dynamic = "force-dynamic";

export default async function FabricsPage() {
  const { data: fabrics } = await sanityFetch({
    query: getAllFabricsQuery,
  });

  if (!fabrics || fabrics.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bebas">No fabrics found</h1>
      </div>
    );
  }

  return (
    <main className="bg-neutral-50 min-h-screen pb-20">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <span className="text-zinc-500 font-bold tracking-wider uppercase text-sm mb-3 block">
            Our Material Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-bebas text-zinc-900 tracking-wide leading-[0.9] max-w-4xl">
            Crafted for <span className="text-blue-main">Comfort</span> &{" "}
            <span className="text-rose-600">Durability</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-600 max-w-2xl leading-relaxed">
            Discover the premium fabrics that make Ezio Kids clothing special.
            Each material is selected for its softness, breathability, and
            ability to keep up with active kids.
          </p>
        </div>
      </section>

      {/* Fabrics List */}
      <div className="container mx-auto px-6 max-w-7xl space-y-24 mt-12">
        {fabrics.map((fabric: Fabric, index: number) => (
          <section
            key={fabric._id}
            className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center`}
          >
            {/* Image Side */}
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-xl group">
                <div className="absolute inset-0 bg-neutral-200">
                  {fabric.bannerImage ? (
                    <Image
                      src={urlFor(fabric.bannerImage).url()}
                      alt={fabric.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : fabric.image ? (
                    <Image
                      src={urlFor(fabric.image).url()}
                      alt={fabric.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : null}
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-dots-pattern opacity-20 -z-10 hidden lg:block" />
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-4">
                <span className="text-4xl md:text-5xl font-bebas text-zinc-900 uppercase tracking-widest">
                  0{index + 1}
                </span>
                <div className="h-px bg-zinc-300 flex-1" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                {/* Swatch/Avatar Image */}
                {fabric.image && (
                  <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-zinc-200 shadow-sm shrink-0">
                    <Image
                      src={urlFor(fabric.image).url()}
                      alt={`${fabric.name} swatch`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <h2 className="text-4xl md:text-6xl font-bebas text-zinc-800 mt-1.5">
                  {fabric.name}
                </h2>
              </div>

              <div className="prose prose-zinc prose-lg mb-6 text-zinc-600">
                <p>
                  {fabric.description ||
                    fabric.excerpt ||
                    "Experience the quality of our premium fabric."}
                </p>
              </div>

              {/* Journal Link */}
              {fabric.journal && (
                <Link
                  href={`/journal/${fabric.journal.slug}`}
                  className="inline-flex flex-col gap-1 text-rose-600 hover:text-rose-700 font-bold tracking-wide uppercase text-sm mb-8 transition-colors"
                >
                  <p className="text-xs text-zinc-500">Read the Guide</p>
                  <span className="w-fit border-b-2 border-rose-600/30 pb-0.5 hover:border-rose-600">
                    {fabric.journal.title}
                  </span>
                </Link>
              )}

              {/* Properties Grid */}
              {(fabric.weight ||
                (fabric.properties && fabric.properties.length > 0)) && (
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 border-l-2 border-zinc-200 pl-6">
                  {fabric.weight && (
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">
                        Weight
                      </span>
                      <span className="block text-zinc-800 font-medium">
                        {fabric.weight} gsm
                      </span>
                    </div>
                  )}
                  {fabric.properties?.slice(0, 3).map((prop, i) => (
                    <div key={i}>
                      <span className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">
                        {prop.key}
                      </span>
                      <span className="block text-zinc-800 font-medium">
                        {prop.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href={`/collections/fabric/${fabric.slug}`}
                className="inline-flex items-center group text-base tracking-wide text-white bg-slate-800 px-8 py-3 w-fit hover:bg-slate-700 transition-colors rounded-sm"
              >
                <span>Shop {fabric.name} Collection</span>
                <BsArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
