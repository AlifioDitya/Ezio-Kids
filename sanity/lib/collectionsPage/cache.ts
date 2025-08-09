// sanity/lib/collectionsPage/cache.ts
import { cache } from "react";
import { getAllSizes } from "./getAllSizes";
import { getAllCategories } from "./getAllCategories";

// Wrap with React cache so repeated calls in the same process are instant.
export const getAllSizesCached = cache(async () => {
  const res = await getAllSizes();
  return res.data;
});

export const getAllCategoriesCached = cache(async () => {
  const res = await getAllCategories();
  return res.data;
});
