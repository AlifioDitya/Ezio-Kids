// app/collections/collar/[slug]/page.tsx
import { AgeGroup } from "@/app/constant";
import CatalogLayout from "@/components/layouts/CatalogLayout";
import { client } from "@/sanity/lib/client";
import {
  COLLAR_TYPES_QUERY,
  getNavData,
} from "@/sanity/lib/products/getNavData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate params from Sanity data
export async function generateStaticParams() {
  const collarTypes = await client.fetch(COLLAR_TYPES_QUERY);
  return collarTypes.map((c: { slug: string }) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { collarTypes } = await getNavData();
  const matched = collarTypes.find(
    (c: { slug: string; name: string }) => c.slug === slug
  );

  if (matched) {
    return {
      title: `${matched.name} Collar Collection - Ezio Kids`,
      description: `Shop our ${matched.name} collection at Ezio Kids.`,
      alternates: { canonical: `/collections/collar/${slug}` },
    };
  }
  return {};
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
  // 'collar' not needed as it's the main context
};

const toArray = (v?: string | string[]) =>
  !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);

export default async function CollarPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;

  const { collarTypes } = await getNavData();
  const matched = collarTypes.find(
    (c: { slug: string; name: string }) => c.slug === slug
  );

  if (!matched) {
    notFound();
  }

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
  // Auto-select this collar
  const selectedCollarTypes = [slug];

  const ageGroups: AgeGroup[] = [];

  return (
    <CatalogLayout
      title={matched.name + " Collar Collection"}
      sortKey={sortKey}
      pageNum={pageNum}
      selectedSizes={selectedSizes}
      selectedCategories={selectedCategories}
      selectedSleeves={selectedSleeves}
      selectedTrueColors={selectedTrueColors}
      selectedTags={selectedTags}
      selectedFabrics={selectedFabrics}
      selectedCollarTypes={selectedCollarTypes}
      ageGroups={ageGroups}
      arrivalsOnly={false}
      basePath={`/collections/collar/${slug}`}
      searchQ={searchQ}
      hiddenFacets={["collar"]}
    />
  );
}
