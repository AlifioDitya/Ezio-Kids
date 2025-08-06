import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategories = async () => {
  const GET_ALL_CATEGORIES_QUERY = defineQuery(
    `*[_type == "category"] | order(order asc)`
  );

  const categories = await sanityFetch({
    query: GET_ALL_CATEGORIES_QUERY,
  });

  return categories || [];
};
