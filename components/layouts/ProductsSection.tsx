// app/components/layouts/ProductsSection.tsx
import { AgeGroup } from "@/app/constant";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  basePath,
  search,
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
  basePath: string;
  search?: string;
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
    search,
  });

  // Empty state (unchanged)
  if (!products.items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white px-6 py-12 text-center">
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
            href={basePath}
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

  const { totalPages, page } = products;

  // Preserve filters/sort/search while switching page
  const buildPageHref = (p: number) => {
    const sp = new URLSearchParams();
    if (sortKey) sp.set("sort", sortKey);
    if (search?.trim()) sp.set("q", search.trim());
    if (sizes?.length) sp.set("size", sizes.join(","));
    if (categories?.length) sp.set("cat", categories.join(","));
    if (sleeves?.length) sp.set("sleeve", sleeves.join(","));
    if (trueColors?.length) sp.set("tcolor", trueColors.join(","));
    if (tags?.length) sp.set("tag", tags.join(","));
    sp.set("page", String(p));
    return `${basePath}?${sp.toString()}`;
  };

  return (
    <div className="flex-1">
      {/* Grid (unchanged styling) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {p.tagInfo.slice(0, 2).map((t, i) => (
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

      {/* Pagination (new) */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent className="flex flex-wrap gap-1.5">
              {/* Prev */}
              <PaginationItem>
                <PaginationPrevious
                  href={page > 1 ? buildPageHref(page - 1) : undefined}
                  aria-disabled={page <= 1}
                />
              </PaginationItem>

              {/* Numbers + ellipses */}
              {getPageList(page, totalPages).map((it, idx) =>
                it === "…" ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={it}>
                    <PaginationLink
                      href={buildPageHref(it)}
                      isActive={it === page}
                      aria-current={it === page ? "page" : undefined}
                      className="shadow-none"
                    >
                      {it}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href={page < totalPages ? buildPageHref(page + 1) : undefined}
                  aria-disabled={page >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

/** compact page list like: [1, "…", 6, 7, 8, "…", 20] */
function getPageList(
  current: number,
  total: number,
  windowSize = 5
): (number | "…")[] {
  if (total <= windowSize + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total]);
  const half = Math.floor(windowSize / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  if (current <= half + 2) {
    start = 2;
    end = Math.min(total - 1, windowSize + 1);
  } else if (current >= total - (half + 1)) {
    end = total - 1;
    start = Math.max(2, total - windowSize);
  }

  for (let p = start; p <= end; p++) pages.add(p);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    result.push(p);
    const next = sorted[i + 1];
    if (next && next - p > 1) result.push("…");
  }
  return result;
}
