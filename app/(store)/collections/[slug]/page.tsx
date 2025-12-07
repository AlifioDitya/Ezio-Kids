// app/collections/[slug]/page.tsx
import { AgeGroup, ALLOWED_SLUGS, Slug, TITLES } from "@/app/constant";
import FilterMobile from "@/components/filters/FilterMobile.server";
import FilterSidebar from "@/components/filters/FilterSidebar.server";
import SidebarSkeleton from "@/components/filters/SidebarSkeleton";
import { ProductsSection } from "@/components/layouts/ProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamicParams = false;
export function generateStaticParams() {
  return ALLOWED_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: Slug }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = TITLES[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/collections/${slug}` },
  };
}

type SearchParams = {
  sort?: string | string[];
  page?: string | string[];
  size?: string | string[];
  cat?: string | string[];
  sleeve?: string | string[];
  tcolor?: string | string[];
  tag?: string | string[];
  q?: string | string[];
};

const toArray = (v?: string | string[]) =>
  !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);
const ARRIVALS_DEFAULT = { arrivalsOnly: true } as const;

export default async function CollectionsPage(props: {
  params: Promise<{ slug: Slug }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  if (!ALLOWED_SLUGS.includes(slug)) notFound();

  // search
  const searchRaw = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q;
  const searchQ = (searchRaw ?? "").trim();

  // sort & paging
  const sortRaw = Array.isArray(searchParams.sort)
    ? searchParams.sort[0]
    : searchParams.sort;
  const pageRaw = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const sortKey: "newest" | "price-asc" | "price-desc" =
    sortRaw === "newest" || sortRaw === "price-asc" || sortRaw === "price-desc"
      ? sortRaw
      : "newest";
  const pageNum = Number(pageRaw ?? 1) || 1;

  // filters
  const selectedSizes = toArray(searchParams.size);
  const selectedCategories = toArray(searchParams.cat);
  const selectedSleeves = toArray(searchParams.sleeve);
  const selectedTrueColors = toArray(searchParams.tcolor);
  const selectedTags = toArray(searchParams.tag);

  // derive age groups from slug
  const ageGroupsFromSlug: AgeGroup[] =
    slug === "baby-toddler"
      ? ["baby", "toddler"]
      : slug === "kids"
        ? ["child"]
        : slug === "teens"
          ? ["teens"]
          : [];

  const arrivalsOnly =
    slug === "new-arrival" ? ARRIVALS_DEFAULT.arrivalsOnly : false;

  const suspenseKey = JSON.stringify({
    slug,
    sortKey,
    pageNum,
    selectedSizes,
    selectedCategories,
    selectedSleeves,
    selectedTrueColors,
    selectedTags,
    ageGroupsFromSlug,
    arrivalsOnly,
    searchQ,
  });

  const titleBlock = TITLES[slug];

  return (
    <main className="overflow-x-hidden bg-white pb-16">
      <h1 className="mt-4 px-6 text-base font-semibold mb-2 sm:mb-0 hidden sm:block">
        {titleBlock.h1}
      </h1>
      {/* make the wrapper a column on mobile, row on desktop */}
      <div className="w-full px-6 flex flex-col sm:flex-row gap-4 sm:gap-8 py-6">
        {/* Sidebar: desktop/tablet only */}
        <aside className="hidden sm:block shrink-0">
          <Suspense fallback={<SidebarSkeleton />}>
            <FilterSidebar currentSort={sortKey} />
          </Suspense>
        </aside>

        {/* Content */}
        <section className="flex-1 flex flex-col min-w-0">
          {/* Title */}
          <h1 className="text-lg font-semibold mb-3 sm:mb-0 block sm:hidden">
            {titleBlock.h1}
          </h1>

          {/* Mobile filter bar */}
          <div
            className="
              sm:hidden
              -mx-6                   /* full-bleed edge */
              bg-white/80
              backdrop-blur
              supports-[backdrop-filter]:bg-white/60
              border-y
            "
          >
            <div className="px-6 py-4">
              <Suspense fallback={<div className="h-10" />}>
                <FilterMobile currentSort={sortKey} />
              </Suspense>
            </div>
          </div>

          {/* Products grid */}
          <Suspense
            key={suspenseKey}
            fallback={
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-4/5 w-full rounded-sm" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))}
              </div>
            }
          >
            <div className="">
              <ProductsSection
                sortKey={sortKey}
                pageNum={pageNum}
                sizes={selectedSizes}
                categories={selectedCategories}
                sleeves={selectedSleeves}
                tags={selectedTags}
                trueColors={selectedTrueColors}
                ageGroups={ageGroupsFromSlug}
                arrivalsOnly={arrivalsOnly}
                basePath={`/collections/${slug}`}
                search={searchQ}
              />
            </div>
          </Suspense>
        </section>
      </div>
    </main>
  );
}
