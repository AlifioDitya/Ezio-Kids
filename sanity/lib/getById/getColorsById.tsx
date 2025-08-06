// sanity/lib/ids/getColorsByIds.ts
import type { Color } from "@/sanity.types";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getColorById(ids: string[]) {
  if (!ids?.length) return [] as Color[];

  const GET_COLOR_BY_ID_QUERY = defineQuery(
    `*[_type == "color" && _id in $ids]`
  );

  const res = await sanityFetch({
    query: GET_COLOR_BY_ID_QUERY,
    params: { ids },
  });

  return res.data ?? [];
}
