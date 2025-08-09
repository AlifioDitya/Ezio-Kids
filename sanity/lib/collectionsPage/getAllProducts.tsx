// sanity/lib/collectionsPage/getAllProducts.ts
import { sanityFetch } from "../live";

export type SortKey = "newest" | "price-asc" | "price-desc";
export type AgeGroup = "baby" | "toddler" | "child" | "teens";

const SORT: Record<SortKey, string> = {
  newest: "_createdAt desc",
  "price-asc": "price asc",
  "price-desc": "price desc",
};

const QUERY = `
{
  "items": *[
    _type == "product" &&

    // ---- AGE GROUP via variant size ----
    (
      count($ageGroups) == 0 ||
      count(variants[size->ageGroup in $ageGroups]) > 0
    ) &&

    // ---- TRUE COLOR via variant color.trueColor ----
    (
      count($trueColors) == 0 ||
      count(variants[color->trueColor in $trueColors]) > 0
    ) &&

    // ---- SIZE labels ----
    (
      count($sizes) == 0 ||
      count(variants[size->label in $sizes]) > 0
    ) &&

    // ---- CATEGORY slug ----
    (
      count($categories) == 0 ||
      category->slug.current in $categories
    ) &&

    // ---- SLEEVE length ----
    (
      count($sleeves) == 0 ||
      sleeveLength in $sleeves
    ) &&

    // ---- NEW ARRIVALS window ----
    (
      $arrivalsOnly == false ||
      (defined(arrivalDate) && arrivalDate >= $since)
    )
  ]
  | order(ORDER_CLAUSE)
  [$start...$end]{
    _id,
    name,
    price,
    "slug": slug,
    mainImage,
    "tagInfo": tags[]->{ title, "slug": slug.current },
  },

  "total": count(*[
    _type == "product" &&

    (
      count($ageGroups) == 0 ||
      count(variants[size->ageGroup in $ageGroups]) > 0
    ) &&

    (
      count($trueColors) == 0 ||
      count(variants[color->trueColor in $trueColors]) > 0
    ) &&

    (
      count($sizes) == 0 ||
      count(variants[size->label in $sizes]) > 0
    ) &&

    (
      count($categories) == 0 ||
      category->slug.current in $categories
    ) &&

    (
      count($sleeves) == 0 ||
      sleeveLength in $sleeves
    ) &&

    (
      $arrivalsOnly == false ||
      (defined(arrivalDate) && arrivalDate >= $since)
    )
  ])
}
`.trim();

export async function getAllProducts(
  opts: {
    sort?: SortKey;
    page?: number;
    pageSize?: number;

    // filters
    ageGroups?: AgeGroup[];
    trueColors?: string[];
    sizes?: string[];
    categories?: string[];
    sleeves?: string[];

    // collections/new-arrival
    arrivalsOnly?: boolean;
    arrivalsWindowDays?: number;
  } = {}
) {
  const sort = opts.sort ?? "newest";
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, opts.pageSize ?? 24));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const order = SORT[sort] ?? SORT.newest;
  const query = QUERY.replace("ORDER_CLAUSE", order);

  const windowDays = Math.max(1, opts.arrivalsWindowDays ?? 60);
  const since = new Date(Date.now() - windowDays * 86_400_000).toISOString();

  const res = await sanityFetch({
    query,
    params: {
      start,
      end,
      ageGroups: opts.ageGroups ?? [],
      trueColors: opts.trueColors ?? [],
      sizes: opts.sizes ?? [],
      categories: opts.categories ?? [],
      sleeves: opts.sleeves ?? [],
      arrivalsOnly: Boolean(opts.arrivalsOnly),
      since,
    },
  });

  const items = res?.data.items ?? [];
  const total = res?.data.total ?? 0;

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
