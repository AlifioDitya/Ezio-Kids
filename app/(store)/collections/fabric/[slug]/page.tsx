// app/collections/fabric/[slug]/page.tsx
import { AgeGroup } from "@/app/lib/constant";
import CatalogLayout from "@/components/layouts/CatalogLayout";
import { client } from "@/sanity/lib/client";
import { FABRICS_QUERY, getNavData } from "@/sanity/lib/products/getNavData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate params from Sanity data
export async function generateStaticParams() {
  const fabrics = await client.fetch(FABRICS_QUERY);
  return fabrics.map((f: { slug: string }) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { fabrics } = await getNavData();
  const matched = fabrics.find(
    (f: { slug: string; name: string }) => f.slug === slug
  );

  if (matched) {
    return {
      title: `${matched.name} Fabric Collection - Ezio Kids`,
      description: `Shop our ${matched.name} collection at Ezio Kids.`,
      alternates: { canonical: `/collections/fabric/${slug}` },
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
  collar?: string | string[];
  // 'fabric' not needed as it's the main context
};

const toArray = (v?: string | string[]) =>
  !v ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);

export default async function FabricPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;

  const { fabrics } = await getNavData();
  const matched = fabrics.find(
    (f: { slug: string; name: string }) => f.slug === slug
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

  // Auto-select this fabric
  const selectedFabrics = [slug];
  // Allow filtering by collar type
  const selectedCollarTypes = toArray(searchParams.collar);

  const ageGroups: AgeGroup[] = []; // No age group inference for fabric pages

  return (
    <CatalogLayout
      title={matched.name + " Collection"}
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
      basePath={`/collections/fabric/${slug}`}
      searchQ={searchQ}
      hiddenFacets={["fabric"]}
    />
  );
}
