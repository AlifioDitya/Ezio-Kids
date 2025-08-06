// sanity/lib/ids/getCollectionById.ts
import type { Collection } from "@/sanity.types";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getCollectionById(ids: string[]) {
  if (!ids?.length) return [] as Collection[];

  const GET_COLLECTION_BY_ID_QUERY = defineQuery(
    `*[_type == "collection" && _id in $ids]`
  );

  const res = await sanityFetch({
    query: GET_COLLECTION_BY_ID_QUERY,
    params: { ids },
  });

  return res.data ?? [];
}
