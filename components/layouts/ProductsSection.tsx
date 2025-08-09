// app/components/layouts/ProductsSection.tsx
import { AgeGroup } from "@/app/constant";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";
import { getAllProducts } from "@/sanity/lib/collectionsPage/getAllProducts";
import Image from "next/image";
import Link from "next/link";

/** Server component that fetches products */
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
}) {
  const products = await getAllProducts({
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

  return (
    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
      {products.items.map(
        (p: Product & { tagInfo?: { title?: string; slug?: string }[] }) => (
          <Link
            key={p._id}
            href={p.slug?.current ? `/products/${p.slug.current}` : "#"}
            className="group block overflow-hidden"
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
                IDR {p.price?.toLocaleString() || "0"}
              </p>
            </div>
          </Link>
        )
      )}
    </div>
  );
}
