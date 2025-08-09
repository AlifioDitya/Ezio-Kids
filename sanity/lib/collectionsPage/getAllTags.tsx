// sanity/lib/collectionsPage/getAllTags.ts
import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export async function getAllTags() {
  const GET_ALL_TAGS_QUERY = defineQuery(
    `*[_type == "tag"] | order(order asc)`
  );

  const res = await sanityFetch({ query: GET_ALL_TAGS_QUERY });
  return {
    data:
      res?.data ?? ([] as Array<{ _id: string; title: string; slug: string }>),
  };
}
