// sanity/lib/collectionsPage/getAllProducts.ts
import { sanityFetch } from "../live";

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT: Record<SortKey, string> = {
  newest: "_createdAt desc",
  "price-asc": "price asc",
  "price-desc": "price desc",
};

const GET_ALL_PRODUCTS_QUERY = `
{
  "items": *[
    _type == "product"
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
  "total": count(*[_type == "product"])
}
`.trim();

export async function getAllProducts(
  opts: {
    sort?: SortKey;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const sort = opts.sort ?? "newest";
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, opts.pageSize ?? 24));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // inline trusted order clause
  const order = SORT[sort] ?? SORT.newest;
  const query = GET_ALL_PRODUCTS_QUERY.replace("ORDER_CLAUSE", order);

  const res = await sanityFetch({
    query,
    params: { start, end },
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
