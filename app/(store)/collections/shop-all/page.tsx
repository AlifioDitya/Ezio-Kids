// app/collections/shop-all/page.tsx
import FilterSidebarClient from "@/components/filters/FilterSidebar";
import { imageUrl } from "@/lib/imageUrl";
import { Product } from "@/sanity.types";
import { getAllCategories } from "@/sanity/lib/collectionsPage/getAllCategories";
import { getAllProducts } from "@/sanity/lib/collectionsPage/getAllProducts";
import { getAllSizes } from "@/sanity/lib/collectionsPage/getAllSizes";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop All - Ezio Kids",
  description:
    "Browse all our sustainable, playful kidswear—filter by color, size, or product type.",
  alternates: { canonical: "/collections/shop-all" },
};

type SearchParams = { sort?: string; page?: string };

export default async function ShopAllPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { sort, page } = await searchParams;
  const sortKey = ["newest", "price-asc", "price-desc"].includes(sort ?? "")
    ? (sort as "newest" | "price-asc" | "price-desc")
    : "newest";
  const pageNum = Number(page ?? 1) || 1;

  const [sizes, categories] = await Promise.all([
    getAllSizes(),
    getAllCategories(),
  ]);

  return (
    <main className="overflow-x-hidden bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-row gap-8 py-6">
        {/* Sidebar Filters */}
        <FilterSidebarClient
          sizes={sizes.data}
          currentSort={sortKey}
          categories={categories.data}
        />

        {/* Product Grid (streams under Suspense) */}
        <section className="flex flex-col flex-1">
          <h1 className="text-2xl xl:text-3xl font-bold mb-4 xl:mb-6">
            Shop All Products
          </h1>

          <Suspense
            key={`${sortKey}-${pageNum}`}
            fallback={
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-4/5 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            }
          >
            {/* server component that fetches products */}
            <ProductsSection sortKey={sortKey} pageNum={pageNum} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

/** Server component that does the heavier fetch */
async function ProductsSection({
  sortKey,
  pageNum,
}: {
  sortKey: "newest" | "price-asc" | "price-desc";
  pageNum: number;
}) {
  const products = await getAllProducts({ sort: sortKey, page: pageNum });

  return (
    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
      {products.items.map(
        (p: Product & { tagInfo?: { title?: string; slug?: string }[] }) => (
          <a
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
          </a>
        )
      )}
    </div>
  );
}
