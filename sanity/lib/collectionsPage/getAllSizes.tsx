import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllSizes = async () => {
  const GET_ALL_SIZE_QUERY = defineQuery(
    `*[_type == "size"] | order(order asc)`
  );

  const getAllSizeContent = await sanityFetch({
    query: GET_ALL_SIZE_QUERY,
  });

  return getAllSizeContent || [];
};
