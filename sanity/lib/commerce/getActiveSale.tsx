import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getActiveSale = async () => {
  const GET_ACTIVE_SALE_QUERY = defineQuery(
    `*[_type == "sale" && isActive == true] | order(_createdAt desc)[0]`
  );

  const sale = await sanityFetch({
    query: GET_ACTIVE_SALE_QUERY,
  });

  return sale.data || null;
};
