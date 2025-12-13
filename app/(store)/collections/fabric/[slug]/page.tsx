// app/collections/fabric/[slug]/page.tsx
import { AGE_GROUPS } from "@/app/lib/constant";
import CatalogLayout from "@/components/layouts/CatalogLayout";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { FABRICS_QUERY } from "@/sanity/lib/products/getNavData";
import { GET_FABRIC_BY_SLUG_QUERY } from "@/sanity/lib/products/queries";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";

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
  const { data: matched } = await sanityFetch({
    query: GET_FABRIC_BY_SLUG_QUERY,
    params: { slug },
  });

  if (matched) {
    return {
      title: `${matched.name} Fabric Collection - Ezio Kids`,
      description:
        matched.excerpt || `Shop our ${matched.name} collection at Ezio Kids.`,
      alternates: { canonical: `/collections/fabric/${slug}` },
      openGraph: {
        images: matched.bannerImage
          ? [urlFor(matched.bannerImage).width(1200).height(630).url()]
          : undefined,
      },
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

  // Use the detailed query
  const { data: matched } = await sanityFetch({
    query: GET_FABRIC_BY_SLUG_QUERY,
    params: { slug },
  });

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

  return (
    <>
      {/* Optional Hero Banner */}
      {matched.bannerImage && (
        <div className="relative h-[60svh] md:h-[70svh] w-full bg-gray-900 mb-8 md:mb-10">
          <Image
            src={urlFor(matched.bannerImage).width(1920).quality(90).url()}
            alt={matched.bannerTitle || matched.name}
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end text-left p-4 md:p-8 mb-3">
            <div className="max-w-3xl text-white space-y-4 mt-16 md:mt-0">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bebas tracking-wider drop-shadow-xl">
                {matched.bannerTitle || matched.name}
              </h1>
              {matched.excerpt && (
                <p className="text-base px-px md:px-1 font-medium text-gray-100 max-w-2xl leading-relaxed drop-shadow-md">
                  {matched.excerpt}
                </p>
              )}
              {matched.journal && matched.journal.slug && (
                <div className="pt-2 px-px md:px-1">
                  <Link
                    href={`/journal/${matched.journal.slug}`}
                    className="group inline-flex items-center gap-2  pb-1 text-xs md:text-sm font-bold uppercase tracking-widest hover:text-gray-200 hover:border-gray-200 transition-all"
                  >
                    <p className="relative w-fit after:absolute after:left-0 after:-bottom-[2px] after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-neutral-50 after:transition-transform group-hover:after:scale-x-100">
                      Read The Fabric Guide
                    </p>
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CatalogLayout
        title={`${matched.name} Collection`}
        sortKey={sortKey}
        pageNum={pageNum}
        selectedSizes={selectedSizes}
        selectedCategories={selectedCategories}
        selectedSleeves={selectedSleeves}
        selectedTrueColors={selectedTrueColors}
        selectedTags={selectedTags}
        selectedFabrics={selectedFabrics}
        selectedCollarTypes={selectedCollarTypes}
        ageGroups={AGE_GROUPS}
        arrivalsOnly={false}
        basePath={`/collections/fabric/${slug}`}
        searchQ={searchQ}
        hiddenFacets={["fabric"]}
        // If banner is present, we might want to reduce top padding of catalog
      />
    </>
  );
}
