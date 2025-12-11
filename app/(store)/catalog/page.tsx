import { AGE_GROUPS, TITLES } from "@/app/lib/constant";
import CatalogLayout from "@/components/layouts/CatalogLayout";
import type { Metadata } from "next";

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
      selectedCollarTypes={selectedCollars}
      ageGroups={AGE_GROUPS}
      arrivalsOnly={false}
      basePath="/catalog"
      searchQ={searchQ}
    />
  );
}
