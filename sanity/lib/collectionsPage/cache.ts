// sanity/lib/collectionsPage/cache.ts
import { cache } from "react";
import { getAllCategories } from "./getAllCategories";
import { getAllSizes } from "./getAllSizes";
import { getAllTags } from "./getAllTags";

// Wrap with React cache so repeated calls in the same process are instant.
export const getAllSizesCached = cache(async () => {
  const res = await getAllSizes();
  return res.data;
});

export const getAllCategoriesCached = cache(async () => {
  const res = await getAllCategories();
  return res.data;
});

export const getAllTagsCached = cache(async () => {
  const res = await getAllTags();
  return res.data;
});

import { getAllFabrics } from "./getAllFabrics";

export const getAllFabricsCached = cache(async () => {
  const res = await getAllFabrics();
  return res;
});

import { getAllCollarTypes } from "./getAllCollarTypes";

export const getAllCollarTypesCached = cache(async () => {
  const res = await getAllCollarTypes();
  return res;
});
