import FilterMobile from "@/components/filters/FilterMobile.server";
import FilterSidebar from "@/components/filters/FilterSidebar.server";
import SidebarSkeleton from "@/components/filters/SidebarSkeleton";
import { ProductsSection } from "@/components/layouts/ProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { AgeGroup } from "@/sanity/lib/collectionsPage/getProducts";
import { Suspense } from "react";
import MobileCatalogHeader from "./MobileCatalogHeader";

type Props = {
  title: string;
  sortKey: "newest" | "price-asc" | "price-desc";
  pageNum: number;
  selectedSizes: string[];
  selectedCategories: string[];
  selectedSleeves: string[];
  selectedTrueColors: string[];
  selectedTags: string[];
  selectedFabrics: string[];
  selectedCollarTypes: string[];
  ageGroups: AgeGroup[];
  arrivalsOnly: boolean;
  basePath: string;
  searchQ: string;
  hiddenFacets?: string[];
};

export default function CatalogLayout({
  title,
  sortKey,
  pageNum,
  selectedSizes,
  selectedCategories,
  selectedSleeves,
  selectedTrueColors,
  selectedTags,
  selectedFabrics,
  selectedCollarTypes,
  ageGroups,
  arrivalsOnly,
  basePath,
  searchQ,
  hiddenFacets = [],
}: Props) {
  const suspenseKey = JSON.stringify({
    sortKey,
    pageNum,
    selectedSizes,
    selectedCategories,
    selectedSleeves,
    selectedTrueColors,
    selectedTags,
    selectedFabrics,
    selectedCollarTypes,
    ageGroups,
    arrivalsOnly,
    searchQ,
    hiddenFacets,
  });

  return (
    <main className="bg-white pb-16">
      {/* make the wrapper a column on mobile, row on desktop */}
      <div className="w-full px-0 lg:px-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8 py-6">
        {/* Sidebar: desktop/tablet only */}
        <aside className="shrink-0 flex lg:flex-col justify-between lg:justify-start items-center lg:items-start px-4 lg:px-0 lg:sticky lg:top-16 w-full lg:max-w-48">
          <h1 className="text-lg lg:text-base font-semibold mb-0 lg:mb-3 hidden lg:block flex-wrap w-full">
            {title}
          </h1>

          <MobileCatalogHeader
            title={title}
            staticFilter={
              <Suspense
                fallback={<div className="h-8 w-24 bg-gray-100 rounded" />}
              >
                <FilterMobile hiddenFacets={hiddenFacets} />
              </Suspense>
            }
            stickyFilter={
              <Suspense
                fallback={<div className="h-8 w-24 bg-gray-100 rounded" />}
              >
                <FilterMobile hiddenFacets={hiddenFacets} />
              </Suspense>
            }
          />

          <div className="hidden lg:block">
            <Suspense fallback={<SidebarSkeleton />}>
              <FilterSidebar
                currentSort={sortKey}
                hiddenFacets={hiddenFacets}
              />
            </Suspense>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 flex flex-col min-w-0">
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
            <div className="">
              <ProductsSection
                sortKey={sortKey}
                pageNum={pageNum}
                sizes={selectedSizes}
                categories={selectedCategories}
                sleeves={selectedSleeves}
                tags={selectedTags}
                trueColors={selectedTrueColors}
                fabrics={selectedFabrics}
                collarTypes={selectedCollarTypes}
                ageGroups={ageGroups}
                arrivalsOnly={arrivalsOnly}
                basePath={basePath}
                search={searchQ}
              />
            </div>
          </Suspense>
        </section>
      </div>
    </main>
  );
}
