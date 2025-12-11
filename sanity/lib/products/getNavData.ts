import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const COLLAR_TYPES_QUERY = defineQuery(`
    *[_type == "collarType"] | order(name asc) {
      name,
      "slug": slug.current,
      "image": image.asset->url
    }
  `);

export const FABRICS_QUERY = defineQuery(`
    *[_type == "fabric"] | order(name asc) {
      name,
      "slug": slug.current,
      "image": image.asset->url
    }
  `);

export const getNavData = async () => {
  const [collarTypes, fabrics] = await Promise.all([
    sanityFetch({ query: COLLAR_TYPES_QUERY }),
    sanityFetch({ query: FABRICS_QUERY }),
  ]);

  return {
    collarTypes: collarTypes.data,
    fabrics: fabrics.data,
  };
};
