// app/collections/[slug]/page.tsx
import { AgeGroup, ALLOWED_SLUGS, Slug, TITLES } from "@/app/constant";
import CatalogLayout from "@/components/layouts/CatalogLayout";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  fabric?: string | string[];
  collar?: string | string[];
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

  const selectedFabrics = toArray(searchParams.fabric);
  const selectedCollarTypes = toArray(searchParams.collar);

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

  const titleBlock = TITLES[slug];

  return (
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
      selectedCollarTypes={selectedCollarTypes}
      ageGroups={ageGroupsFromSlug}
      arrivalsOnly={arrivalsOnly}
      basePath={`/collections/${slug}`}
      searchQ={searchQ}
    />
  );
}
