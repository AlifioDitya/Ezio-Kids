// sanity/lib/search/getFeaturedForSearch.ts
import { Product } from "@/sanity.types";
import { sanityFetch } from "../live";

export type FeaturedSearchData = {
  newThisWeek: Product[];
  popularNow: Product[];
  trendingSearches: string[];
};

const QUERY = /* groq */ `
{
  "newThisWeek": *[
    _type=="product" && defined(arrivalDate) && arrivalDate >= $since
  ] | order(arrivalDate desc)[0...10]{
    _id, name, price, "slug": slug, mainImage
  },

  "popularNow": *[
    _type=="product" && count(tags[@->slug.current == "best-seller"]) > 0
  ] | order(_createdAt desc)[0...10]{
    _id, name, price, "slug": slug, mainImage
  },

  // keep fun & short; you can swap to your own list in Studio
  "trendingSearches": array::compact( [
    "matching set", "romper", "graphic tee", "denim", "swim", "rainbow",
    "organic", "limited edition"
  ] )
}
`;

export async function getFeaturedForSearch(
  days = 45
): Promise<FeaturedSearchData> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const res = await sanityFetch({ query: QUERY, params: { since } });
  return res?.data ?? { newThisWeek: [], popularNow: [], trendingSearches: [] };
}
