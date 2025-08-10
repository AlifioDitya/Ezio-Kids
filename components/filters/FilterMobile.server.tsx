import FilterMobileClient from "./FilterMobile.client";
import {
  getAllCategoriesCached,
  getAllSizesCached,
  getAllTagsCached,
} from "@/sanity/lib/collectionsPage/cache";

export default async function FilterMobile({
  currentSort,
}: {
  currentSort: "newest" | "price-asc" | "price-desc";
}) {
  const [sizes, categories, tags] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
    getAllTagsCached(),
  ]);

  return (
    <FilterMobileClient
      sizes={sizes}
      categories={categories}
      tags={tags}
      currentSort={currentSort}
    />
  );
}
