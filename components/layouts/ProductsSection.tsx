// app/components/layouts/ProductsSection.tsx
import { AgeGroup } from "@/app/constant";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";
import { getProducts } from "@/sanity/lib/collectionsPage/getProducts";
import Image from "next/image";
import Link from "next/link";
import { MdSearchOff } from "react-icons/md";

export async function ProductsSection({
  sortKey,
  pageNum,
  sizes,
  categories,
  sleeves,
  tags,
  trueColors,
  ageGroups,
  arrivalsOnly,
  basePath, // <-- add this
}: {
  sortKey: "newest" | "price-asc" | "price-desc";
  pageNum: number;
  sizes: string[];
  categories: string[];
  sleeves: string[];
  tags: string[];
  trueColors: string[];
  ageGroups: AgeGroup[];
  arrivalsOnly?: boolean;
  basePath: string; // <-- add this
}) {
  const products = await getProducts({
    sort: sortKey,
    page: pageNum,
    sizes,
    categories,
    sleeves,
    tags,
    trueColors,
    ageGroups,
    arrivalsOnly,
  });

  // Empty state
  if (!products.items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white px-6 py-12 text-center">
        {/* Soft glow bubble */}
        <div className="relative mb-3">
          <div
            aria-hidden
            className="absolute -inset-6 rounded-full bg-gradient-to-br from-rose-100 to-indigo-100 blur-2xl"
          />
          <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-100 shadow-sm">
            <MdSearchOff className="h-7 w-7 text-rose-500" />
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900">
          No products match your filters
        </h3>
        <p className="mt-1 max-w-xs text-sm text-gray-600">
          Try removing a filter or broaden your selection.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={basePath} // clears all filters
            className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Clear all filters
          </Link>
          <Link
            href="/collections/shop-all"
            className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Shop all
          </Link>
        </div>
      </div>
    );
  }

  // Normal grid
  return (
    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
      {products.items.map(
        (p: Product & { tagInfo?: { title?: string; slug?: string }[] }) => (
          <Link
            key={p._id}
            href={p.slug?.current ? `/products/${p.slug.current}` : "#"}
            className="group block overflow-hidden self-start"
          >
            <div className="relative aspect-4/5 overflow-hidden rounded-sm w-full">
              {p.mainImage && (
                <Image
                  src={imageUrl(p.mainImage)?.url() || ""}
                  alt={p?.name || "Product Image"}
                  fill
                  sizes="(min-width:1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              )}
            </div>

            <div className="w-full h-fit flex flex-col gap-1 p-1 py-3">
              {p?.tagInfo?.length ? (
                <div className="mb-1 flex flex-wrap gap-1.5">
                  {p.tagInfo.slice(0, 3).map((t, i) => (
                    <span
                      key={`${t.slug ?? t.title ?? i}`}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                    >
                      {t.title}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mb-1 h-4" />
              )}

              <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
                {p.name}
              </h2>
              <p className="mt-1 text-xs font-semibold text-gray-900">
                Rp {p.price?.toLocaleString() || "0"}
              </p>
            </div>
          </Link>
        )
      )}
    </div>
  );
}
