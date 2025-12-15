import { AGE_GROUPS, TITLES } from "@/app/lib/constant";
import CatalogLayout from "@/components/layouts/CatalogLayout";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { GET_CATALOG_PAGE_QUERY } from "@/sanity/lib/products/queries";
import type { Metadata } from "next";
import Image from "next/image";

export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const meta = TITLES["catalog"];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/catalog` },
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
  fabric?: string | string[];
  collar?: string | string[];
};

const toArray = (v?: string | string[]) =>
  !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);

export default async function CatalogPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

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
  const selectedFabrics = toArray(searchParams.fabric);
  const selectedCollars = toArray(searchParams.collar);

  const titleBlock = TITLES["catalog"];

  // Fetch catalog page banner data
  const { data: catalogPage } = await sanityFetch({
    query: GET_CATALOG_PAGE_QUERY,
  });

  return (
    <>
      {catalogPage?.bannerImage && (
        <div className="relative h-[60svh] md:h-[70svh] w-full bg-gray-900 mb-8 md:mb-10">
          <Image
            src={urlFor(catalogPage.bannerImage).width(2160).quality(90).url()}
            alt={catalogPage.bannerTitle || titleBlock.h1}
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end text-left p-4 md:p-8 mb-3">
            <div className="max-w-3xl text-white space-y-4 mt-16 md:mt-0">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bebas tracking-wider drop-shadow-xl">
                {catalogPage.bannerTitle || titleBlock.h1}
              </h1>
              {catalogPage.excerpt && (
                <p className="text-lg md:text-xl font-medium text-gray-100 max-w-2xl leading-relaxed drop-shadow-md">
                  {catalogPage.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <CatalogLayout
        title={titleBlock.h1}
        sortKey={sortKey}
        pageNum={pageNum}
        selectedSizes={selectedSizes}
        selectedCategories={selectedCategories}
        selectedSleeves={selectedSleeves}
        selectedTrueColors={selectedTrueColors}
        selectedTags={selectedTags}
        selectedFabrics={selectedFabrics}
        selectedCollarTypes={selectedCollars}
        ageGroups={AGE_GROUPS}
        arrivalsOnly={false}
        basePath="/catalog"
        searchQ={searchQ}
      />
    </>
  );
}
