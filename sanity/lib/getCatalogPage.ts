import { defineQuery } from "next-sanity";
import { sanityFetch } from "./live";

export async function getCatalogPage() {
  const QUERY = defineQuery(`
    *[_type == "catalogPage"][0]{
      whatsappNumber
    }
  `);

  const res = await sanityFetch({ query: QUERY });
  return res.data ?? null;
}
