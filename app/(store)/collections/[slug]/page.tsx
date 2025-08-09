// app/collections/[slug]/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { ProductsSection } from "@/components/layouts/ProductsSection";
import { AgeGroup } from "@/app/constant";
import SidebarServer from "@/components/filters/SidebarServer";
import SidebarSkeleton from "@/components/filters/SidebarSkeleton";

export const ALLOWED_SLUGS = [
  "shop-all",
  "new-arrival",
  "baby-toddler",
  "kids",
  "teens",
] as const;
type Slug = (typeof ALLOWED_SLUGS)[number];

export const dynamicParams = false;
export function generateStaticParams() {
  return ALLOWED_SLUGS.map((slug) => ({ slug }));
}

const TITLES: Record<Slug, { h1: string; title: string; description: string }> =
  {
    "shop-all": {
      h1: "Shop All Products",
      title: "Shop All - Ezio Kids",
      description:
        "Browse all our sustainable, playful kidswear—filter by color, size, or product type.",
    },
    "new-arrival": {
      h1: "New Arrivals",
      title: "New Arrivals - Ezio Kids",
      description: "Fresh drops and latest styles for your little ones.",
    },
    "baby-toddler": {
      h1: "Baby & Toddler",
      title: "Baby & Toddler - Ezio Kids",
      description: "Cozy, durable fits for ages 0-3.",
    },
    kids: {
      h1: "Kids",
      title: "Kids - Ezio Kids",
      description: "Playproof styles for growing kids.",
    },
    teens: {
      h1: "Teens",
      title: "Teens - Ezio Kids",
      description: "Confident looks for teens.",
    },
  };

export function generateMetadata({
  params,
}: {
  params: { slug: Slug };
}): Metadata {
  const meta = TITLES[params.slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/collections/${params.slug}` },
  };
}

type SearchParams = {
  sort?: string | string[];
  page?: string | string[];
  size?: string | string[];
  cat?: string | string[];
  sleeve?: string | string[];
  tcolor?: string | string[];
};

const toArray = (v?: string | string[]) =>
  !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);
const ARRIVALS_DEFAULT = { arrivalsOnly: true } as const;

export default async function CollectionsPage({
  params,
  searchParams,
}: {
  params: { slug: Slug };
  searchParams: SearchParams;
}) {
  const slug = params.slug;
  if (!ALLOWED_SLUGS.includes(slug)) notFound();

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
    ageGroupsFromSlug,
    arrivalsOnly,
  });

  const titleBlock = TITLES[slug];

  return (
    <main className="overflow-x-hidden bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-row gap-8 py-6">
        {/* Sidebar (streams immediately) */}
        <Suspense fallback={<SidebarSkeleton />}>
          <SidebarServer currentSort={sortKey} />
        </Suspense>

        {/* Grid */}
        <section className="flex flex-col flex-1">
          <h1 className="text-2xl xl:text-3xl font-bold mb-4 xl:mb-6">
            {titleBlock.h1}
          </h1>

          <Suspense
            key={suspenseKey}
            fallback={
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
            <ProductsSection
              sortKey={sortKey}
              pageNum={pageNum}
              sizes={selectedSizes}
              categories={selectedCategories}
              sleeves={selectedSleeves}
              trueColors={selectedTrueColors}
              ageGroups={ageGroupsFromSlug}
              arrivalsOnly={arrivalsOnly}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
