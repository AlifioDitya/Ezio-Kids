// sanity/lib/ids/getCategoriesByIds.ts
import type { Category } from "@/sanity.types";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getCategoryByIds(ids: string[]) {
  if (!ids?.length) return [] as Category[];

  const GET_CATEGORY_BY_ID_QUERY = defineQuery(
    `*[_type == "category" && _id in $ids]`
  );

  const res = await sanityFetch({
    query: GET_CATEGORY_BY_ID_QUERY,
    params: { ids },
  });

  return res.data ?? [];
}
