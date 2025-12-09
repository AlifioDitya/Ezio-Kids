import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export type CollarTypeOption = {
  name: string;
  slug: string;
  image?: string | null;
};

export const getAllCollarTypes = async (): Promise<CollarTypeOption[]> => {
  const QUERY = defineQuery(
    `*[_type == "collarType"]{
      name,
      "slug": slug.current,
      "image": image.asset->url
    } | order(name asc)`
  );

  const result = await sanityFetch({
    query: QUERY,
  });

  return result.data || [];
};
