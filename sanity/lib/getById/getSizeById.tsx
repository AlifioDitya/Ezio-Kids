// sanity/lib/ids/getSizesByIds.ts
import type { Size } from "@/sanity.types";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getSizeById(ids: string[]) {
  if (!ids?.length) return [] as Size[];

  const GET_SIZE_BY_ID_QUERY = defineQuery(`*[_type == "size" && _id in $ids]`);

  const res = await sanityFetch({
    query: GET_SIZE_BY_ID_QUERY,
    params: { ids },
  });

  return res.data ?? [];
}
