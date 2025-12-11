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
    category?: { name?: string; slug?: string };
    fabric?: { name?: string };
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
      fabric.name match $q ||
      count(variants[color->name match $q]) > 0 ||
      sleeveLength match $q ||
      count(tags[@->title match $q || @->slug.current match $q]) > 0
    ) &&
    // Filters
    (count($sizes) == 0 || count(variants[size->label in $sizes]) > 0) &&
    (count($categories) == 0 || category->slug.current in $categories) &&
    (count($fabrics) == 0 || fabric->slug.current in $fabrics) &&
    (count($collarTypes) == 0 || collarType->slug.current in $collarTypes) &&
    (count($tags) == 0 || count(tags[@->slug.current in $tags]) > 0) &&
    (count($trueColors) == 0 || count(variants[color->trueColor in $trueColors]) > 0) &&
    (count($sleeves) == 0 || sleeveLength in $sleeves)
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
    "category": category->{name, "slug": slug.current},
    "fabric": fabric{name},
  },

  "total": count(*[
    _type == "product" &&
    (
      name match $q || 
      lower(name) match lower($q) ||
      category->name match $q ||
      fabric.name match $q ||
      count(variants[color->name match $q]) > 0 ||
      sleeveLength match $q ||
      count(tags[@->title match $q || @->slug.current match $q]) > 0
    ) &&
    // Filters
    (count($sizes) == 0 || count(variants[size->label in $sizes]) > 0) &&
    (count($categories) == 0 || category->slug.current in $categories) &&
    (count($fabrics) == 0 || fabric->slug.current in $fabrics) &&
    (count($collarTypes) == 0 || collarType->slug.current in $collarTypes) &&
    (count($tags) == 0 || count(tags[@->slug.current in $tags]) > 0) &&
    (count($trueColors) == 0 || count(variants[color->trueColor in $trueColors]) > 0) &&
    (count($sleeves) == 0 || sleeveLength in $sleeves)
  ]),

  // primitive suggestions: tag titles + category names containing query
  "suggestions": array::unique([
    ...*[_type=="tag" && (title match $q || slug.current match $q)][0...10].title,
    ...*[_type=="category" && (name match $q || slug.current match $q)][0...10].name,
    ...*[_type=="product" && fabric.name match $q].fabric.name
  ])
}
`;

export async function getSearchResults({
  q,
  limit = 8,
  sizes = [],
  categories = [],
  fabrics = [],
  collarTypes = [],
  tags = [],
  trueColors = [],
  sleeves = [],
}: {
  q: string;
  limit?: number;
  sizes?: string[];
  categories?: string[];
  fabrics?: string[];
  collarTypes?: string[];
  tags?: string[];
  trueColors?: string[];
  sleeves?: string[];
}): Promise<SearchResult> {
  const cleaned = `${q}*`; // prefix match
  const res = await sanityFetch({
    query: GET_SEARCH_RESULTS_QUERY,
    params: {
      q: cleaned,
      limit,
      sizes,
      categories,
      fabrics,
      collarTypes,
      tags,
      trueColors,
      sleeves,
    },
  });

  return {
    q,
    products: res?.data?.products ?? [],
    suggestions: res?.data?.suggestions ?? [],
    total: res?.data?.total ?? 0,
  };
}
