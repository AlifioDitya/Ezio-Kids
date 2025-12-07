// sanity/lib/search/getSearchResults.ts
import { sanityFetch } from "../live";

type SearchResult = {
  products: Array<{
    _id: string;
    name?: string;
    price?: number;
    slug?: { current?: string };
    mainImage?: unknown;
    mainImageUrl?: string;
    additionalImages?: Array<{ asset?: { url: string }; alt?: string }>;
    variants?: Array<{
      _key: string;
      color?: {
        name?: string;
        slug?: string;
        trueColor?: string;
        swatchUrl?: string;
      };
      priceOverride?: number;
    }>;
    tagInfo?: { title?: string; slug?: string }[];
  }>;
  suggestions: string[];
  total: number;
  q: string;
};

const GET_SEARCH_RESULTS_QUERY = /* groq */ `
{
  "products": *[
    _type == "product" &&
    (
      name match $q || 
      lower(name) match lower($q) ||
      category->name match $q ||
      count(tags[@->title match $q || @->slug.current match $q]) > 0
    )
  ] | order(_score desc, _createdAt desc) [0...$limit]{
    _id,
    name,
    price,
    "slug": slug,
    mainImage,
    "mainImageUrl": mainImage.asset->url,
    "additionalImages": additionalImages[]{ asset->{ "url": url }, "alt": alt },
    "variants": variants[]{
      _key,
      priceOverride,
      color->{
        name,
        "slug": slug.current,
        "trueColor": color.hex,
        "swatchUrl": swatch.asset->url
      }
    },
    "tagInfo": tags[]->{ title, "slug": slug.current },
  },

  "total": count(*[
    _type == "product" &&
    (
      name match $q || 
      lower(name) match lower($q) ||
      category->name match $q ||
      count(tags[@->title match $q || @->slug.current match $q]) > 0
    )
  ]),

  // primitive suggestions: tag titles + category names containing query
  "suggestions": array::unique([
    ...*[_type=="tag" && (title match $q || slug.current match $q)][0...10].title,
    ...*[_type=="category" && (name match $q || slug.current match $q)][0...10].name
  ])
}
`;

export async function getSearchResults({
  q,
  limit = 8,
}: {
  q: string;
  limit?: number;
}): Promise<SearchResult> {
  const cleaned = `${q}*`; // prefix match
  const res = await sanityFetch({
    query: GET_SEARCH_RESULTS_QUERY,
    params: { q: cleaned, limit },
  });

  return {
    q,
    products: res?.data?.products ?? [],
    suggestions: res?.data?.suggestions ?? [],
    total: res?.data?.total ?? 0,
  };
}
