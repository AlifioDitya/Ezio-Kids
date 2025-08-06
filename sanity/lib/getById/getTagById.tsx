// sanity/lib/ids/getTagsByIds.ts
import type { Tag } from "@/sanity.types";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getTagById(ids: string[]) {
  if (!ids?.length) return [] as Tag[];

  const GET_TAG_BY_ID_QUERY = defineQuery(`*[_type == "tag" && _id in $ids]`);

  const res = await sanityFetch({
    query: GET_TAG_BY_ID_QUERY,
    params: { ids },
  });

  return res.data ?? [];
}
