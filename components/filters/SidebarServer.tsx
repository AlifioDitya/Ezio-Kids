// components/filters/SidebarServer.tsx
import FilterSidebarClient from "@/components/filters/FilterSidebarClient";
import {
  getAllCategoriesCached,
  getAllSizesCached,
} from "@/sanity/lib/collectionsPage/cache";

export default async function SidebarServer({
  currentSort,
}: {
  currentSort: "newest" | "price-asc" | "price-desc";
}) {
  const [sizes, categories] = await Promise.all([
    getAllSizesCached(),
    getAllCategoriesCached(),
  ]);

  return (
    <FilterSidebarClient
      sizes={sizes}
      categories={categories}
      currentSort={currentSort}
    />
  );
}
